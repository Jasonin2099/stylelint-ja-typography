import stylelint from 'stylelint';

import { isIgnoredSelector, isStringOrRegExp, keyword, ruleName as ns, ruleUrl } from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'no-line-break-anywhere';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  rejected: () =>
    'Unexpected "line-break: anywhere". It ignores all line-breaking prohibitions (禁則処理), so 。、」 can start a line; use "loose", "normal" or "strict", and "overflow-wrap: anywhere" for long URLs.',
});

const meta = { url: ruleUrl(name) };

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

  root.walkDecls(/^(-webkit-)?line-break$/i, (decl) => {
    if (keyword(decl.value) !== 'anywhere') return;
    if (isIgnoredSelector(decl, secondaryOptions?.ignoreSelectors)) return;
    report({ message: messages.rejected(), node: decl, word: 'anywhere', result, ruleName });
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
