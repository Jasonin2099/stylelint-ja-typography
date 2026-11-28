import stylelint from 'stylelint';

import { isIgnoredSelector, isStringOrRegExp, keyword, ruleName as ns, ruleUrl, siblingDecls } from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'text-spacing-trim-value';
export const ruleName = ns(name);

const SUPPORTED_LIST = 'normal, space-all, space-first, trim-start';

export const messages = ruleMessages(ruleName, {
  invalid: (value, hint) =>
    `Invalid text-spacing-trim value "${value}"${hint ? ` (${hint})` : ''}. CSS Text 4 allows normal, space-all, space-first, trim-start, trim-both, trim-all or auto.`,
  unsupported: (value) =>
    `"text-spacing-trim: ${value}" is in CSS Text 4 but no browser supports it yet, so the declaration is dropped. Put a supported value (${SUPPORTED_LIST}) before it as a fallback.`,
  draft: (value) =>
    `"text-spacing-trim: ${value}" uses the per-position keywords of the CSS Text 4 Editor's Draft only; the Working Draft and the browser tests treat it as invalid and browsers drop it. Use ${SUPPORTED_LIST}.`,
});

const meta = { url: ruleUrl(name) };

// Shipped in Chromium 123 (MDN browser-compat-data); no other engine yet.
const SUPPORTED = new Set(['normal', 'space-all', 'space-first', 'trim-start']);
// CSS Text 4 Working Draft (2026-08-14): <spacing-trim> | auto.
const SPEC = new Set([...SUPPORTED, 'trim-both', 'trim-all', 'auto']);
// Editor's Draft (2026-11): [start] || [adjacent] || [end] per-position keywords.
const GROUPS = [
  ['trim-start', 'space-start', 'space-first'],
  ['trim-adjacent', 'space-adjacent'],
  ['trim-end', 'space-end', 'allow-end'],
];
const AUTOSPACE = new Set(['ideograph-alpha', 'ideograph-numeric', 'punctuation', 'no-autospace', 'insert', 'replace']);
const CSS_WIDE = new Set(['inherit', 'initial', 'unset', 'revert', 'revert-layer']);

function hintFor(words) {
  const moved = words.find((w) => AUTOSPACE.has(w));
  if (moved) return `"${moved}" belongs to text-autospace`;
  if (words.includes('none')) return '"none" was in the 2019 text-spacing draft; use space-all';
  if (words.includes('no-compress')) return '"no-compress" was in the 2019 text-spacing draft and was removed';
  if (words.length > 1 && words.some((w) => SPEC.has(w) && !GROUPS[0].includes(w))) {
    return 'normal, space-all, trim-both, trim-all and auto stand alone';
  }
  return '';
}

/** 'ok' | 'unsupported' | 'draft' | 'invalid' (+ hint) for a declaration value. */
export function classify(value) {
  const v = keyword(value);
  if (!v || CSS_WIDE.has(v) || /var\(|env\(|\$|@\{|#\{/.test(v)) return { kind: 'ok' };
  const words = v.split(/\s+/);
  if (words.length === 1 && SPEC.has(v)) return { kind: SUPPORTED.has(v) ? 'ok' : 'unsupported' };
  const used = GROUPS.map((g) => words.filter((w) => g.includes(w)).length);
  const perPosition = words.every((w) => GROUPS.some((g) => g.includes(w))) && used.every((n) => n <= 1);
  if (perPosition) return { kind: 'draft' };
  return { kind: 'invalid', hint: hintFor(words) };
}

function insideSupports(decl) {
  for (let n = decl.parent; n && n.type !== 'root'; n = n.parent) {
    if (n.type === 'atrule' && n.name.toLowerCase() === 'supports' && /text-spacing-trim/i.test(n.params)) return true;
  }
  return false;
}

function hasSupportedFallback(decl) {
  const decls = siblingDecls(decl);
  const i = decls.indexOf(decl);
  return decls
    .slice(0, i)
    .some((d) => d.prop.toLowerCase() === 'text-spacing-trim' && classify(d.value).kind === 'ok');
}

const rule = (primary, secondaryOptions) => (root, result) => {
  const valid = validateOptions(
    result,
    ruleName,
    { actual: primary, possible: [true] },
    {
      actual: secondaryOptions,
      possible: { ignore: ['unsupported', 'draft', 'invalid'], ignoreSelectors: [isStringOrRegExp] },
      optional: true,
    },
  );
  if (!valid) return;
  const ignore = new Set([secondaryOptions?.ignore ?? []].flat());

  root.walkDecls(/^text-spacing-trim$/i, (decl) => {
    const { kind, hint } = classify(decl.value);
    if (kind === 'ok' || ignore.has(kind)) return;
    if (isIgnoredSelector(decl, secondaryOptions?.ignoreSelectors)) return;
    if (kind !== 'invalid' && (insideSupports(decl) || hasSupportedFallback(decl))) return;
    const value = keyword(decl.value);
    report({
      message: kind === 'invalid' ? messages.invalid(value, hint) : messages[kind](value),
      node: decl,
      word: decl.value.trim().replace(/\s*!important\s*$/i, ''),
      result,
      ruleName,
    });
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
