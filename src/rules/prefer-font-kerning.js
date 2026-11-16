import stylelint from 'stylelint';

import { findSibling, parseFeatureSettings, ruleName as ns, ruleUrl } from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'prefer-font-kerning';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  expected: (tag, keyword) =>
    `Expected "font-kerning: ${keyword}" instead of "${tag}" in font-feature-settings.`,
});

const meta = { url: ruleUrl(name), fixable: true };

const KERN_TAGS = new Set(['kern', 'vkrn']);

const rule = (primary) => (root, result) => {
  const valid = validateOptions(result, ruleName, { actual: primary, possible: [true] });
  if (!valid) return;

  root.walkDecls(/^font-feature-settings$/i, (decl) => {
    const features = parseFeatureSettings(decl.value);
    if (!features) return;
    const hits = features.filter((f) => KERN_TAGS.has(String(f.tag).toLowerCase()));
    if (hits.length === 0) return;

    const keywords = hits.map((f) => (f.enabled ? 'normal' : 'none'));
    const consistent = new Set(keywords).size === 1;
    const onlyKern = hits.length === features.length;
    const conflicting = findSibling(decl, 'font-kerning').length > 0;
    const canFix = onlyKern && consistent && !conflicting && !decl.important;

    hits.forEach((f, i) => {
      const keyword = f.enabled ? 'normal' : 'none';
      report({
        message: messages.expected(f.tag, keyword),
        node: decl,
        word: f.tag,
        result,
        ruleName,
        fix:
          canFix && i === 0
            ? () => {
                decl.replaceWith(decl.clone({ prop: 'font-kerning', value: keywords[0] }));
              }
            : undefined,
      });
    });
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
