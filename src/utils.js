import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';

export const NAMESPACE = 'ja-typography';
const REPO = 'https://github.com/Jasonin2099/stylelint-ja-typography';

export const ruleName = (name) => `${NAMESPACE}/${name}`;
export const ruleUrl = (name) => `${REPO}/blob/main/docs/rules/${name}.md`;

/** Direct declarations of the block that contains `decl`. */
export function siblingDecls(decl) {
  const parent = decl.parent;
  if (!parent || !parent.nodes) return [];
  return parent.nodes.filter((n) => n.type === 'decl');
}

export function findSibling(decl, prop) {
  const want = Array.isArray(prop) ? prop : [prop];
  return siblingDecls(decl).filter((d) => want.includes(d.prop.toLowerCase()));
}

export function keyword(value) {
  return String(value).trim().toLowerCase().replace(/\s*!important\s*$/, '');
}

/**
 * Parse a font-feature-settings value into
 * [{ tag, enabled, node, raw }]. Returns null for values we cannot read
 * (variables, `normal`, functions).
 */
export function parseFeatureSettings(value) {
  const v = keyword(value);
  if (v === 'normal' || /var\(|env\(|\$|@\{/.test(v)) return null;
  const parsed = valueParser(value);
  const items = [];
  let current = null;
  for (const node of parsed.nodes) {
    if (node.type === 'div' && node.value === ',') {
      current = null;
      continue;
    }
    if (node.type === 'string') {
      current = { tag: node.value, enabled: true, node, setting: null };
      items.push(current);
      continue;
    }
    if (node.type === 'word' && current) {
      const w = node.value.toLowerCase();
      if (w === '!important') continue;
      current.setting = w;
      current.enabled = !(w === 'off' || w === '0');
    }
  }
  return items;
}

const JA_LANG_RE = /:lang\(\s*["']?ja\b|\[\s*lang\s*([|^*]?=)\s*["']?ja\b/i;

/** Well-known Japanese font families (lower-cased, without quotes). */
export const JAPANESE_FONTS = [
  'hiragino sans', 'hiragino kaku gothic pro', 'hiragino kaku gothic pron',
  'hiragino mincho pro', 'hiragino mincho pron', 'hiragino maru gothic pro',
  'hiragino maru gothic pron', 'ヒラギノ角ゴシック', 'ヒラギノ角ゴ pro', 'ヒラギノ角ゴ pron',
  'ヒラギノ明朝 pro', 'ヒラギノ明朝 pron', 'yu gothic', 'yugothic', 'yu gothic ui',
  'yu gothic medium', '游ゴシック', '游ゴシック体', '游ゴシック medium', 'yu mincho',
  'yumincho', '游明朝', '游明朝体', 'meiryo', 'meiryo ui', 'メイリオ', 'ms gothic',
  'ms pgothic', 'ms ui gothic', 'ｍｓ ゴシック', 'ｍｓ ｐゴシック', 'ms mincho', 'ms pmincho',
  'ｍｓ 明朝', 'ｍｓ ｐ明朝', 'osaka', 'noto sans jp', 'noto serif jp', 'noto sans cjk jp',
  'noto serif cjk jp', 'source han sans', 'source han sans jp', 'source han serif',
  'source han serif jp', '源ノ角ゴシック', '源ノ明朝', 'biz udgothic', 'biz udpgothic',
  'biz udmincho', 'biz udpmincho', 'm plus 1p', 'm plus 1', 'm plus 2', 'm plus rounded 1c',
  'kosugi', 'kosugi maru', 'sawarabi gothic', 'sawarabi mincho', 'zen kaku gothic new',
  'zen maru gothic', 'zen old mincho', 'shippori mincho', 'ibm plex sans jp', 'klee one',
  'kiwi maru', 'line seed jp', 'udev gothic', 'morisawa', 'a-otf',
];

export function fontFamilies(value) {
  return String(value)
    .split(',')
    .map((f) => f.trim().replace(/^["']|["']$/g, '').toLowerCase())
    .filter(Boolean);
}

/** Font families part of a `font` shorthand (everything after the size). */
export function fontShorthandFamilies(value) {
  const m = String(value).match(/(?:^|\s)[\d.]+[a-z%]*(?:\s*\/\s*[\d.]+[a-z%]*)?\s+(.+)$/i);
  return m ? m[1] : null;
}

export function isJapaneseFont(name) {
  const n = name.toLowerCase();
  if (/[\u3040-\u30ff\u4e00-\u9fff]/.test(n)) return true;
  return JAPANESE_FONTS.some((f) => n === f || n.startsWith(`${f} `));
}

function selectorOf(node) {
  let n = node;
  const parts = [];
  while (n && n.type !== 'root') {
    if (n.type === 'rule' && n.selector) parts.push(n.selector);
    n = n.parent;
  }
  return parts.join(' ');
}

/**
 * True when the declaration is (heuristically) styling Japanese text:
 * - option `assumeJapanese: true`, or
 * - the enclosing selector uses :lang(ja) / [lang="ja"], or
 * - the same block (or an ancestor block) sets a Japanese font first in
 *   font-family / font.
 */
export function isJapaneseContext(decl, options = {}) {
  if (options.assumeJapanese) return true;
  if (JA_LANG_RE.test(selectorOf(decl))) return true;
  let n = decl.parent;
  while (n && n.type !== 'root') {
    if (n.nodes) {
      for (const d of n.nodes) {
        if (d.type !== 'decl') continue;
        const p = d.prop.toLowerCase();
        let families = null;
        if (p === 'font-family') families = d.value;
        if (p === 'font') families = fontShorthandFamilies(d.value);
        const first = families && fontFamilies(families)[0];
        if (first && isJapaneseFont(first)) return true;
      }
    }
    n = n.parent;
  }
  return false;
}

export function matchesAny(text, patterns = []) {
  return patterns.some((p) => {
    if (p instanceof RegExp) return p.test(text);
    const s = String(p);
    const m = s.match(/^\/(.+)\/([a-z]*)$/);
    return m ? new RegExp(m[1], m[2]).test(text) : s === text;
  });
}

export function isIgnoredSelector(decl, ignoreSelectors) {
  if (!ignoreSelectors || ignoreSelectors.length === 0) return false;
  const rule = decl.parent;
  if (!rule || rule.type !== 'rule') return false;
  return rule.selectors.some((s) => matchesAny(s.trim(), ignoreSelectors));
}

/** Returns the compound selectors (as arrays of nodes) at the right end of each selector. */
export function subjectCompounds(selector) {
  const out = [];
  try {
    selectorParser((root) => {
      root.each((sel) => {
        let compound = [];
        sel.each((node) => {
          if (node.type === 'combinator') compound = [];
          else if (node.type !== 'comment') compound.push(node);
        });
        out.push(compound);
      });
    }).processSync(selector);
  } catch {
    return [];
  }
  return out;
}

export const isString = (v) => typeof v === 'string';
export const isStringOrRegExp = (v) => typeof v === 'string' || v instanceof RegExp;
