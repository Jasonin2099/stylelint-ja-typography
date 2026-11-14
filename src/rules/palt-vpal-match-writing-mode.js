import stylelint from 'stylelint';
import valueParser from 'postcss-value-parser';

import { findSibling, keyword, parseFeatureSettings, ruleName as ns, ruleUrl } from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'palt-vpal-match-writing-mode';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected, mode) =>
    `Expected "${expected}" instead of "${actual}" in ${mode} writing mode.`,
});

const meta = { url: ruleUrl(name), fixable: true };

const TO_VERTICAL = { palt: 'vpal', halt: 'vhal', kern: 'vkrn' };
const TO_HORIZONTAL = Object.fromEntries(Object.entries(TO_VERTICAL).map(([h, v]) => [v, h]));

const VERTICAL = new Set(['vertical-rl', 'vertical-lr', 'tb', 'tb-rl']);
const HORIZONTAL = new Set(['horizontal-tb', 'sideways-rl', 'sideways-lr', 'lr', 'lr-tb', 'rl', 'rl-tb']);

function modeOf(decl) {
  const wm = findSibling(decl, ['writing-mode', '-webkit-writing-mode']).at(-1);
  if (!wm) return null;
  const v = keyword(wm.value);
  if (VERTICAL.has(v)) {
    // text-orientation: sideways lays the whole line out horizontally, so
    // horizontal features (palt) are the right ones.
    const to = findSibling(decl, ['text-orientation', '-webkit-text-orientation']).at(-1);
    if (to && keyword(to.value) === 'sideways') return 'horizontal';
    return 'vertical';
  }
  if (HORIZONTAL.has(v)) return 'horizontal';
  return null;
}

const rule = (primary) => (root, result) => {
  const valid = validateOptions(result, ruleName, { actual: primary, possible: [true] });
  if (!valid) return;

  root.walkDecls(/^font-feature-settings$/i, (decl) => {
    const mode = modeOf(decl);
    if (!mode) return;
    const map = mode === 'vertical' ? TO_VERTICAL : TO_HORIZONTAL;
    const features = parseFeatureSettings(decl.value);
    if (!features) return;
    const tags = new Set(features.map((f) => f.tag));

    for (const f of features) {
      const expected = map[f.tag];
      if (!f.enabled || !expected) continue;
      const canFix = !tags.has(expected);
      report({
        message: messages.expected(f.tag, expected, mode),
        node: decl,
        word: f.tag,
        result,
        ruleName,
        fix: canFix
          ? () => {
              const parsed = valueParser(decl.value);
              parsed.walk((n) => {
                if (n.type === 'string' && n.value === f.tag) n.value = expected;
              });
              decl.value = parsed.toString();
            }
          : undefined,
      });
    }
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
