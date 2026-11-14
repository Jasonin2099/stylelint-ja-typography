import stylelint from 'stylelint';

import { findSibling, parseFeatureSettings, ruleName as ns, ruleUrl } from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'prefer-font-variant-east-asian';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  expected: (tag, keyword) =>
    `Expected "font-variant-east-asian: ${keyword}" instead of "${tag}" in font-feature-settings.`,
});

const meta = { url: ruleUrl(name), fixable: true };

export const EAST_ASIAN = {
  jp78: 'jis78',
  jp83: 'jis83',
  jp90: 'jis90',
  jp04: 'jis04',
  smpl: 'simplified',
  trad: 'traditional',
  fwid: 'full-width',
  pwid: 'proportional-width',
  ruby: 'ruby',
};

const VARIANT_GROUP = new Set(['jis78', 'jis83', 'jis90', 'jis04', 'simplified', 'traditional']);
const WIDTH_GROUP = new Set(['full-width', 'proportional-width']);

/** Keywords form a valid <font-variant-east-asian> value (one per group). */
function isValidCombination(keywords) {
  return (
    keywords.filter((k) => VARIANT_GROUP.has(k)).length <= 1 &&
    keywords.filter((k) => WIDTH_GROUP.has(k)).length <= 1
  );
}

const rule = (primary) => (root, result) => {
  const valid = validateOptions(result, ruleName, { actual: primary, possible: [true] });
  if (!valid) return;

  root.walkDecls(/^font-feature-settings$/i, (decl) => {
    const features = parseFeatureSettings(decl.value);
    if (!features) return;
    const hits = features.filter(
      (f) => f.enabled && EAST_ASIAN[f.tag] && (f.setting === null || f.setting === 'on' || f.setting === '1'),
    );
    if (hits.length === 0) return;

    const keywords = hits.map((f) => EAST_ASIAN[f.tag]);
    const conflicting = findSibling(decl, ['font-variant', 'font-variant-east-asian']).length > 0;
    const important = decl.important;
    const canFix = !conflicting && !important && isValidCombination(keywords);

    // The first report carries the fix for the whole declaration.
    hits.forEach((f, i) => {
      report({
        message: messages.expected(f.tag, EAST_ASIAN[f.tag]),
        node: decl,
        word: f.tag,
        result,
        ruleName,
        fix:
          canFix && i === 0
            ? () => {
                const rest = features.filter((x) => !hits.includes(x));
                const variant = decl.clone({ prop: 'font-variant-east-asian', value: keywords.join(' ') });
                if (rest.length === 0) {
                  decl.replaceWith(variant);
                  return;
                }
                decl.value = rest
                  .map((x) => `"${x.tag}"${x.setting === null ? '' : ` ${x.setting}`}`)
                  .join(', ');
                decl.after(variant);
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
