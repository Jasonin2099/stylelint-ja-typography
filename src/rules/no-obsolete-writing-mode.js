import stylelint from 'stylelint';

import { keyword, ruleName as ns, ruleUrl } from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'no-obsolete-writing-mode';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  rejected: (actual, expected) =>
    `Unexpected obsolete writing-mode value "${actual}"; use "${expected}".`,
});

const meta = { url: ruleUrl(name), fixable: true };

// CSS Writing Modes 3, §3.2.1 "Obsolete SVG1.1 writing-mode Values", plus the
// tb-lr value from the 2011 CSS draft that vertical-lr replaced.
export const OBSOLETE = {
  lr: 'horizontal-tb',
  'lr-tb': 'horizontal-tb',
  rl: 'horizontal-tb',
  'rl-tb': 'horizontal-tb',
  tb: 'vertical-rl',
  'tb-rl': 'vertical-rl',
  'tb-lr': 'vertical-lr',
};

const rule = (primary) => (root, result) => {
  const valid = validateOptions(result, ruleName, { actual: primary, possible: [true] });
  if (!valid) return;

  root.walkDecls(/^(-webkit-)?writing-mode$/i, (decl) => {
    const actual = keyword(decl.value);
    const expected = OBSOLETE[actual];
    if (!expected) return;
    report({
      message: messages.rejected(actual, expected),
      node: decl,
      word: decl.value.trim().split(/\s+/)[0],
      result,
      ruleName,
      fix: () => {
        decl.value = expected;
      },
    });
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
