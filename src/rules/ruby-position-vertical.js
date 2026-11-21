import stylelint from 'stylelint';

import { isIgnoredSelector, isStringOrRegExp, keyword, ruleName as ns, ruleUrl } from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'ruby-position-vertical';
export const ruleName = ns(name);

export const messages = ruleMessages(ruleName, {
  rejected: (actual) =>
    `Unexpected "${actual}" in vertical writing mode: it puts ruby on the left of the base text. Japanese vertical text puts ruby on the right ("over").`,
});

const meta = { url: ruleUrl(name) };

// writing-mode values whose line-over side is the right (CSS Writing Modes 3,
// § 6.3). sideways-lr is the exception and is not used for Japanese.
const VERTICAL = new Set(['vertical-rl', 'vertical-lr', 'tb', 'tb-rl', 'tb-lr']);
const WRITING_MODE = /^(-webkit-)?writing-mode$/i;

function setsVertical(container) {
  if (!container || !container.nodes) return false;
  const decls = container.nodes.filter((n) => n.type === 'decl' && WRITING_MODE.test(n.prop));
  const last = decls.at(-1);
  return !!last && VERTICAL.has(keyword(last.value));
}

/** The annotation side a ruby-position value asks for, or null. */
function underValue(prop, value) {
  const words = keyword(value).split(/\s+/);
  if (/^-webkit-/i.test(prop)) return words.includes('after') ? 'after' : null;
  return words.includes('under') ? words.join(' ') : null;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

  // Selectors of rules that switch to vertical text, e.g. `.tategaki`.
  const anchors = [];
  root.walkRules((r) => {
    if (!setsVertical(r)) return;
    for (const s of r.selectors) anchors.push(s.trim());
  });
  const anchorRes = anchors.map((a) => new RegExp(`^${escapeRe(a)}(?:\\s*[\\s>~+]\\s*|$)`));

  function isVertical(decl) {
    for (let n = decl.parent; n && n.type !== 'root'; n = n.parent) {
      if (setsVertical(n)) return true;
    }
    const r = decl.parent;
    if (!r || r.type !== 'rule') return false;
    return r.selectors.some((s) => anchorRes.some((re) => re.test(s.trim())));
  }

  root.walkDecls(/^(-webkit-)?ruby-position$/i, (decl) => {
    const actual = underValue(decl.prop, decl.value);
    if (!actual) return;
    if (isIgnoredSelector(decl, secondaryOptions?.ignoreSelectors)) return;
    if (!isVertical(decl)) return;
    report({
      message: messages.rejected(actual),
      node: decl,
      word: /^-webkit-/i.test(decl.prop) ? 'after' : 'under',
      result,
      ruleName,
    });
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
