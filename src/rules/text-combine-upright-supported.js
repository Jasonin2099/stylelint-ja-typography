import stylelint from 'stylelint';

import { findSibling, keyword, ruleName as ns, ruleUrl } from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'text-combine-upright-supported';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  digits: () =>
    'Unexpected "text-combine-upright: digits". No major browser supports it; wrap the digits in an element and use "text-combine-upright: all".',
  legacy: (value, expected) =>
    `Expected "text-combine-upright: ${expected}" next to "-webkit-text-combine: ${value}".`,
});

const meta = { url: ruleUrl(name), fixable: true };

const LEGACY = { horizontal: 'all', none: 'none' };

const rule = (primary) => (root, result) => {
  const valid = validateOptions(result, ruleName, { actual: primary, possible: [true] });
  if (!valid) return;

  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    const value = keyword(decl.value);

    if (prop === 'text-combine-upright' || prop === '-webkit-text-combine-upright') {
      if (!/^digits\b/.test(value)) return;
      report({ message: messages.digits(), node: decl, word: 'digits', result, ruleName });
      return;
    }

    if (prop === '-webkit-text-combine') {
      const expected = LEGACY[value];
      if (!expected) return;
      if (findSibling(decl, 'text-combine-upright').length > 0) return;
      report({
        message: messages.legacy(value, expected),
        node: decl,
        result,
        ruleName,
        fix: () => {
          decl.after(decl.clone({ prop: 'text-combine-upright', value: expected }));
        },
      });
    }
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
