import stylelint from 'stylelint';

import {
  isIgnoredSelector,
  isJapaneseContext,
  isStringOrRegExp,
  keyword,
  ruleName as ns,
  ruleUrl,
  subjectCompounds,
} from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'text-autospace-initial-value';
export const ruleName = ns(name);

const WHY =
  'CSS Text 4 gives text-autospace the initial value "normal" (space between kanji and Latin letters or digits), but Chrome 140+, Firefox 145+ and Safari 18.4+ all ship "no-autospace" (no space)';

export const messages = ruleMessages(ruleName, {
  keyword: (value) =>
    `"text-autospace: ${value}" falls back to the initial value. ${WHY}, so this gives different results by browser and may change later. Write "normal" or "no-autospace".`,
  missing: () =>
    `This stylesheet sets Japanese text up on the root but never sets text-autospace. ${WHY}. Set "normal" or "no-autospace" on the root so the result is the same everywhere.`,
});

const meta = { url: ruleUrl(name) };

// `initial` and `revert` both end at the initial value on the property
// (the user-agent sheet does not set text-autospace). `inherit` and `unset`
// follow the parent, so they are left alone.
const FALLBACK = new Set(['initial', 'revert']);

const ROOT_TAGS = new Set(['html', 'body']);

/** `html`, `body`, `:root`, `*`, `:lang(ja)`, `[lang|=ja]` and combinations of them. */
function isRootLike(compound) {
  if (compound.length === 0) return false;
  let anchor = false;
  for (const node of compound) {
    if (node.type === 'tag' && ROOT_TAGS.has(node.value.toLowerCase())) anchor = true;
    else if (node.type === 'pseudo' && node.value.toLowerCase() === ':root') anchor = true;
    else if (node.type === 'pseudo' && node.value.toLowerCase() === ':lang') anchor = true;
    else if (node.type === 'attribute' && node.attribute.trim().toLowerCase() === 'lang') anchor = true;
    else if (node.type === 'universal') anchor = true;
    else return false;
  }
  return anchor;
}

const rootLikeRule = (rule) => rule.selectors.some((s) => subjectCompounds(s).some(isRootLike));

const rule = (primary, secondaryOptions) => (root, result) => {
  const valid = validateOptions(
    result,
    ruleName,
    { actual: primary, possible: [true] },
    {
      actual: secondaryOptions,
      possible: {
        assumeJapanese: [true, false],
        requireOnRoot: [true, false],
        ignoreSelectors: [isStringOrRegExp],
      },
      optional: true,
    },
  );
  if (!valid) return;

  root.walkDecls(/^text-autospace$/i, (decl) => {
    const value = keyword(decl.value);
    if (!FALLBACK.has(value)) return;
    if (isIgnoredSelector(decl, secondaryOptions?.ignoreSelectors)) return;
    if (!isJapaneseContext(decl, secondaryOptions)) return;
    report({
      message: messages.keyword(value),
      node: decl,
      word: decl.value.trim().replace(/\s*!important\s*$/i, ''),
      result,
      ruleName,
    });
  });

  if (!secondaryOptions?.requireOnRoot) return;

  let setsIt = false;
  let firstJapaneseRoot = null;
  root.walkRules((r) => {
    if (!rootLikeRule(r)) return;
    const decls = (r.nodes ?? []).filter((n) => n.type === 'decl');
    if (decls.some((d) => /^text-autospace$/i.test(d.prop))) setsIt = true;
    if (!firstJapaneseRoot && decls.length > 0 && isJapaneseContext(decls[0], secondaryOptions)) {
      if (!isIgnoredSelector(decls[0], secondaryOptions?.ignoreSelectors)) firstJapaneseRoot = r;
    }
  });
  if (setsIt || !firstJapaneseRoot) return;
  report({
    message: messages.missing(),
    node: firstJapaneseRoot,
    word: firstJapaneseRoot.selector,
    result,
    ruleName,
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
