import stylelint from 'stylelint';

import {
  isIgnoredSelector,
  isString,
  isStringOrRegExp,
  parseFeatureSettings,
  ruleName as ns,
  ruleUrl,
  subjectCompounds,
} from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'no-palt-on-body-text';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  rejected: (feature, selector) =>
    `Unexpected "${feature}" on body text selector "${selector}". Japanese running text is set solid (ベタ組み); apply "${feature}" to headings or short UI labels instead.`,
});

const meta = { url: ruleUrl(name) };

const PROPORTIONAL = new Set(['palt', 'pkna', 'vpal', 'vkna']);

export const DEFAULT_BODY_ELEMENTS = [
  'html', 'body', 'main', 'article', 'section', 'p', 'li', 'dd', 'dt', 'td', 'th',
  'blockquote', 'figcaption', 'div',
];

function isBodySelector(selector, bodyElements) {
  return subjectCompounds(selector).some((compound) => {
    let body = false;
    for (const node of compound) {
      if (node.type === 'class' || node.type === 'id' || node.type === 'nesting') return false;
      if (node.type === 'attribute' && node.attribute.toLowerCase() !== 'lang') return false;
      if (node.type === 'universal') body = true;
      if (node.type === 'tag' && bodyElements.includes(node.value.toLowerCase())) body = true;
      if (node.type === 'pseudo' && node.value.toLowerCase() === ':root') body = true;
      if (node.type === 'pseudo' && /^:(where|is)$/i.test(node.value)) {
        if (node.nodes.some((s) => isBodySelector(String(s), bodyElements))) body = true;
      }
    }
    return body;
  });
}

const rule = (primary, secondaryOptions) => (root, result) => {
  const valid = validateOptions(
    result,
    ruleName,
    { actual: primary, possible: [true] },
    {
      actual: secondaryOptions,
      possible: { bodyElements: [isString], ignoreSelectors: [isStringOrRegExp] },
      optional: true,
    },
  );
  if (!valid) return;

  const bodyElements = (secondaryOptions?.bodyElements ?? DEFAULT_BODY_ELEMENTS).map((e) =>
    e.toLowerCase(),
  );

  root.walkDecls(/^font-feature-settings$/i, (decl) => {
    const parent = decl.parent;
    if (!parent || parent.type !== 'rule') return;
    if (isIgnoredSelector(decl, secondaryOptions?.ignoreSelectors)) return;
    if (!isBodySelector(parent.selector, bodyElements)) return;
    const features = parseFeatureSettings(decl.value);
    if (!features) return;
    for (const f of features) {
      if (!f.enabled || !PROPORTIONAL.has(f.tag)) continue;
      report({
        message: messages.rejected(f.tag, parent.selector),
        node: decl,
        word: f.tag,
        result,
        ruleName,
      });
    }
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
