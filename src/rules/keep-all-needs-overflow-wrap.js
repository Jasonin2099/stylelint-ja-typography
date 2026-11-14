import stylelint from 'stylelint';

import {
  findSibling,
  isIgnoredSelector,
  isStringOrRegExp,
  keyword,
  ruleName as ns,
  ruleUrl,
} from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'keep-all-needs-overflow-wrap';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  expected: () =>
    'Expected "overflow-wrap: anywhere" (or "break-word") next to "word-break: keep-all". Japanese has no spaces, so keep-all makes whole sentences unbreakable and they overflow narrow screens.',
});

const meta = { url: ruleUrl(name) };

const SAFE = new Set(['anywhere', 'break-word']);

const rule = (primary, secondaryOptions) => (root, result) => {
  const valid = validateOptions(
    result,
    ruleName,
    { actual: primary, possible: [true] },
    {
      actual: secondaryOptions,
      possible: { ignoreSelectors: [isStringOrRegExp] },
      optional: true,
    },
  );
  if (!valid) return;

  root.walkDecls(/^(-ms-)?word-break$/i, (decl) => {
    if (keyword(decl.value) !== 'keep-all') return;
    if (isIgnoredSelector(decl, secondaryOptions?.ignoreSelectors)) return;
    const wrap = findSibling(decl, ['overflow-wrap', 'word-wrap']).at(-1);
    if (wrap && SAFE.has(keyword(wrap.value))) return;
    report({ message: messages.expected(), node: decl, word: 'keep-all', result, ruleName });
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
