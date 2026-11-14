import stylelint from 'stylelint';
import valueParser from 'postcss-value-parser';

import {
  findSibling,
  isIgnoredSelector,
  isJapaneseContext,
  isStringOrRegExp,
  keyword,
  ruleName as ns,
  ruleUrl,
} from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'no-synthetic-italic';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  rejected: (value) =>
    `Unexpected "${value}" on Japanese text. Japanese fonts have no italic face, so the browser slants glyphs synthetically; use text-emphasis, font-weight or another typeface, or add "font-synthesis-style: none".`,
});

const meta = { url: ruleUrl(name) };

function slantKeyword(value) {
  const words = valueParser(value).nodes.filter((n) => n.type === 'word').map((n) => n.value.toLowerCase());
  return words.find((w) => w === 'italic' || w === 'oblique');
}

function synthesisDisabled(decl) {
  return findSibling(decl, ['font-synthesis', 'font-synthesis-style']).some((d) => {
    const v = keyword(d.value);
    if (d.prop.toLowerCase() === 'font-synthesis-style') return v === 'none';
    // font-synthesis lists the kinds that ARE allowed; "none" or a list
    // without "style" disables oblique synthesis.
    return v === 'none' || !/\bstyle\b/.test(v);
  });
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

  root.walkDecls(/^(font-style|font)$/i, (decl) => {
    const isShorthand = decl.prop.toLowerCase() === 'font';
    const slant = isShorthand ? slantKeyword(decl.value) : keyword(decl.value).split(/\s+/)[0];
    if (slant !== 'italic' && slant !== 'oblique') return;
    if (isIgnoredSelector(decl, secondaryOptions?.ignoreSelectors)) return;
    if (!isJapaneseContext(decl, secondaryOptions)) return;
    if (synthesisDisabled(decl)) return;
    report({ message: messages.rejected(slant), node: decl, word: slant, result, ruleName });
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
