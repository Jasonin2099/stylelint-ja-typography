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

const name = 'text-emphasis-position-japanese';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  under: (actual) =>
    `Unexpected "${actual}" on Japanese text: "under" puts emphasis marks (圏点) below horizontal text. Japanese puts them above ("over right").`,
  left: (actual) =>
    `Unexpected "${actual}" on Japanese text: "left" puts emphasis marks (圏点) on the left of vertical text. Japanese puts them on the right ("over right").`,
  inherited: (actual, selector) =>
    `Japanese emphasis marks inherit "text-emphasis-position: ${actual}" from "${selector}". Set "text-emphasis-position: over right" here.`,
});

const meta = { url: ruleUrl(name) };

const POSITION = /^(-webkit-)?text-emphasis-position$/i;
const EMPHASIS = /^(-webkit-)?text-emphasis(-style)?$/i;
const WRITING_MODE = /^(-webkit-)?writing-mode$/i;
const VERTICAL = new Set(['vertical-rl', 'vertical-lr', 'sideways-rl', 'tb', 'tb-rl', 'tb-lr']);
const HORIZONTAL = new Set(['horizontal-tb', 'lr', 'lr-tb', 'rl', 'rl-tb']);
const GLOBAL = new Set(['inherit', 'initial', 'unset', 'revert', 'revert-layer']);

/** 'vertical' | 'horizontal' | null from the last writing-mode in this block or an enclosing one. */
function writingMode(decl) {
  for (let n = decl.parent; n && n.type !== 'root'; n = n.parent) {
    const decls = (n.nodes ?? []).filter((d) => d.type === 'decl' && WRITING_MODE.test(d.prop));
    const last = decls.at(-1);
    if (!last) continue;
    const v = keyword(last.value);
    if (VERTICAL.has(v)) return 'vertical';
    if (HORIZONTAL.has(v)) return 'horizontal';
    return null;
  }
  return null;
}

/** Keywords of a text-emphasis-position value, or null when it cannot be read. */
function positionWords(value) {
  const v = keyword(value);
  if (!v || GLOBAL.has(v) || /[($@{]/.test(v)) return null;
  return v.split(/\s+/);
}

/** True for selectors that match the root or every element (html, :root, body, *). */
function isRootLike(selector) {
  const compounds = subjectCompounds(selector);
  return (
    compounds.length > 0 &&
    compounds.every((compound) =>
      compound.every(
        (node) =>
          (node.type === 'tag' && /^(html|body)$/i.test(node.value)) ||
          node.type === 'universal' ||
          (node.type === 'pseudo' && node.value.toLowerCase() === ':root'),
      ),
    )
  );
}

const rule = (primary, secondaryOptions) => (root, result) => {
  const valid = validateOptions(
    result,
    ruleName,
    { actual: primary, possible: [true] },
    {
      actual: secondaryOptions,
      possible: { assumeJapanese: [true, false], ignoreSelectors: [isStringOrRegExp] },
      optional: true,
    },
  );
  if (!valid) return;
  const options = secondaryOptions ?? {};

  // Non-Japanese positions set on the root, e.g. `html { text-emphasis-position: under; }`
  // for a Chinese site; Japanese text below inherits them.
  let inheritedFrom = null;

  root.walkDecls(POSITION, (decl) => {
    const words = positionWords(decl.value);
    if (!words) return;
    const under = words.includes('under');
    const left = words.includes('left');
    if (!under && !left) return;
    const actual = words.join(' ');

    if (!isJapaneseContext(decl, options)) {
      const r = decl.parent;
      if (r && r.type === 'rule' && r.parent?.type === 'root' && isRootLike(r.selector)) {
        inheritedFrom ??= { actual, selector: r.selector };
      }
      return;
    }
    if (isIgnoredSelector(decl, options.ignoreSelectors)) return;

    const mode = writingMode(decl);
    if (under && mode !== 'vertical') {
      report({ message: messages.under(actual), node: decl, word: 'under', result, ruleName });
    }
    if (left && mode !== 'horizontal') {
      report({ message: messages.left(actual), node: decl, word: 'left', result, ruleName });
    }
  });

  if (!inheritedFrom || options.assumeJapanese) return;

  root.walkDecls(EMPHASIS, (decl) => {
    const v = keyword(decl.value);
    if (v === 'none' || GLOBAL.has(v)) return;
    if (!isJapaneseContext(decl, options)) return;
    if (isIgnoredSelector(decl, options.ignoreSelectors)) return;
    for (let n = decl.parent; n && n.type !== 'root'; n = n.parent) {
      if ((n.nodes ?? []).some((d) => d.type === 'decl' && POSITION.test(d.prop))) return;
    }
    report({
      message: messages.inherited(inheritedFrom.actual, inheritedFrom.selector),
      node: decl,
      result,
      ruleName,
    });
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
