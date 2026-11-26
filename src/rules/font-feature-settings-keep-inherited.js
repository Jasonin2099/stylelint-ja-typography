import stylelint from 'stylelint';

import {
  isIgnoredSelector,
  isString,
  isStringOrRegExp,
  keyword,
  parseFeatureSettings,
  ruleName as ns,
  ruleUrl,
  subjectCompounds,
} from '../utils.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const name = 'font-feature-settings-keep-inherited';
export const ruleName = ns(name);

const list = (tags) => tags.map((t) => `"${t}"`).join(', ');

export const messages = ruleMessages(ruleName, {
  dropped: (tags, from) =>
    `font-feature-settings here replaces the list set on "${from}" and drops ${list(tags)} (the property is not merged). Repeat ${tags.length > 1 ? 'them' : 'it'} in this list.`,
  reset: (tags, from) =>
    `The "font" shorthand resets font-feature-settings to "normal", dropping ${list(tags)} set on "${from}". Set font-feature-settings again after it, or use the longhands.`,
});

const meta = { url: ruleUrl(name) };

/**
 * OpenType features that matter for Japanese text and only have a
 * font-feature-settings switch (or are commonly set there). `kern` is left
 * to prefer-font-kerning.
 */
export const DEFAULT_FEATURES = [
  'palt', 'vpal', 'halt', 'vhal', 'pkna', 'hkna', 'vkna', 'pwid', 'fwid', 'hwid',
  'twid', 'qwid', 'jp78', 'jp83', 'jp90', 'jp04', 'nlck', 'expt', 'trad', 'hojo',
  'ruby', 'vert', 'vrt2', 'ital',
];

const FFS = /^font-feature-settings$/i;
const KEEPS_INHERITED = new Set(['inherit', 'unset', 'revert', 'revert-layer']);
// Characters that may follow an ancestor selector inside a descendant /
// same-element selector: a combinator (space, >) or a further simple selector.
const CONTINUES = /^(?:\s*>|\s+|[.#:[])/;

/**
 * Last effective font settings of a block, or null:
 * { kind: 'ffs', tags, decl } | { kind: 'reset' (font shorthand) | 'off' (normal) | 'unknown' (variables), decl }.
 */
function blockSettings(rule) {
  let out = null;
  for (const node of rule.nodes ?? []) {
    if (node.type !== 'decl') continue;
    const prop = node.prop.toLowerCase();
    if (FFS.test(prop)) {
      const v = keyword(node.value);
      // An explicit `normal` / `initial` turns every feature off on purpose.
      if (v === 'normal' || v === 'initial') out = { kind: 'off', decl: node };
      else if (KEEPS_INHERITED.has(v)) out = null;
      else {
        const items = parseFeatureSettings(node.value);
        if (!items) {
          out = { kind: 'unknown', decl: node };
        } else {
          out = { kind: 'ffs', tags: new Map(items.map((i) => [i.tag, i])), decl: node };
        }
      }
    } else if (prop === 'font') {
      if (!KEEPS_INHERITED.has(keyword(node.value))) out = { kind: 'reset', decl: node };
    }
  }
  return out;
}

/** At-rule context of a node, e.g. "media print|supports (x)". */
function context(node) {
  const parts = [];
  for (let n = node.parent; n && n.type !== 'root'; n = n.parent) {
    if (n.type === 'atrule') parts.unshift(`${n.name.toLowerCase()} ${n.params}`);
  }
  return parts;
}

const isPrefix = (outer, inner) => outer.length <= inner.length && outer.every((p, i) => p === inner[i]);

function isRootLike(selector) {
  const compounds = subjectCompounds(selector);
  return (
    compounds.length === 1 &&
    compounds[0].length > 0 &&
    compounds[0].every(
      (node) =>
        (node.type === 'tag' && /^(html|body)$/i.test(node.value)) ||
        node.type === 'universal' ||
        (node.type === 'pseudo' && node.value.toLowerCase() === ':root'),
    )
  );
}

/** How closely `selector` sits under `ancestor`: its length when it does, else -1. */
function descends(selector, ancestor) {
  const s = selector.trim();
  const a = ancestor.trim();
  if (s === a || !s.startsWith(a)) return -1;
  return CONTINUES.test(s.slice(a.length)) && !/^\s*[+~]/.test(s.slice(a.length)) ? a.length : -1;
}

const rule = (primary, secondaryOptions) => (root, result) => {
  const valid = validateOptions(
    result,
    ruleName,
    { actual: primary, possible: [true] },
    {
      actual: secondaryOptions,
      possible: { features: [isString], ignoreSelectors: [isStringOrRegExp] },
      optional: true,
    },
  );
  if (!valid) return;
  const options = secondaryOptions ?? {};
  const watched = new Set((options.features ?? DEFAULT_FEATURES).map((f) => f.toLowerCase()));

  // Every rule with an effective font-feature-settings / font reset.
  const entries = [];
  root.walkRules((r) => {
    const settings = blockSettings(r);
    if (settings) entries.push({ rule: r, settings, context: context(r) });
  });
  const providers = entries.filter((e) => e.settings.kind === 'ffs' && e.settings.tags.size > 0);

  for (const entry of entries) {
    const { rule: r, settings } = entry;
    if (settings.kind === 'unknown' || settings.kind === 'off') continue;
    if (isIgnoredSelector(settings.decl, options.ignoreSelectors)) continue;
    if (r.selectors.every((s) => isRootLike(s))) continue;

    // Closest provider: an enclosing (nested) rule first, then the longest
    // selector this rule sits under, then a root-like rule.
    let from = null;
    for (let n = r.parent; n && n.type !== 'root' && !from; n = n.parent) {
      if (n.type === 'rule') from = providers.find((p) => p.rule === n) ?? null;
    }
    if (!from) {
      let best = -1;
      for (const p of providers) {
        if (p === entry || !isPrefix(p.context, entry.context)) continue;
        for (const a of p.rule.selectors) {
          for (const s of r.selectors) {
            const d = descends(s, a);
            if (d > best) {
              best = d;
              from = p;
            }
          }
        }
      }
    }
    if (!from) {
      from =
        providers.find(
          (p) => p !== entry && isPrefix(p.context, entry.context) && p.rule.selectors.every((s) => isRootLike(s)),
        ) ?? null;
    }
    if (!from) continue;

    const own = settings.kind === 'ffs' ? settings.tags : new Map();
    const missing = [...from.settings.tags.keys()].filter((t) => watched.has(t.toLowerCase()) && !own.has(t));
    if (missing.length === 0) continue;
    const message =
      settings.kind === 'reset'
        ? messages.reset(missing, from.rule.selector)
        : messages.dropped(missing, from.rule.selector);
    report({ message, node: settings.decl, result, ruleName, word: settings.decl.prop });
  }
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default createPlugin(ruleName, rule);
