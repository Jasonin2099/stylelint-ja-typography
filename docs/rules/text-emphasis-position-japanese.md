# ja-typography/text-emphasis-position-japanese

[日本語](./text-emphasis-position-japanese.ja.md)

Disallow `text-emphasis-position` values that put emphasis marks (圏点 / 傍点) on the wrong side of Japanese text: `under` (below horizontal text) and `left` (left of vertical text). Also reports Japanese emphasis that inherits such a value from `html`, `:root`, `body` or `*`.

```css
:lang(ja) em {
  text-emphasis: sesame;
  text-emphasis-position: under right;
  /**                     ↑
   * marks end up below the line; Japanese puts them above */
}
```

## Why

JLREQ: “Emphasis dots are attached to the right of the base characters in vertical writing mode, or above them in horizontal writing mode” ([JLREQ § 3.3.9 Composition of Emphasis Dots](https://www.w3.org/TR/jlreq/#composition_of_emphasis_dots)).

CSS Text Decoration 3 gives `text-emphasis-position` one keyword for each direction: `over` / `under` for horizontal text and `right` / `left` for vertical text. Its note says the preferred position depends on the language: `over right` for Japanese, `under right` for Chinese ([CSS Text Decoration 3, § 3.4 `text-emphasis-position`](https://www.w3.org/TR/css-text-decor-3/#text-emphasis-position-property)).

The initial value is `over right`, so Japanese text is right by default. Problems come from CSS written for Chinese (`under right`) or copied from it, and the property is inherited: `html { text-emphasis-position: under; }` on a bilingual site moves the marks under every Japanese `em` too.

## What is reported

Only declarations that look like Japanese text are checked (the same detection as the other rules): a `:lang(ja)` / `[lang="ja"]` selector, a Japanese font first in `font-family` / `font` on the same or an enclosing block, or `assumeJapanese: true`.

- `under` in a Japanese rule, unless the same or an enclosing block sets a vertical `writing-mode` (where `under` has no effect).
- `left` in a Japanese rule, unless the same or an enclosing block sets `writing-mode: horizontal-tb` (where `left` has no effect).
- `text-emphasis` / `text-emphasis-style` in a Japanese rule, without its own `text-emphasis-position` (on the block or an enclosing block), when the file sets `under` or `left` on a top-level `html`, `:root`, `body` or `*` rule that is not Japanese. Not checked with `assumeJapanese`, because the root rule then counts as Japanese and is reported directly.

`-webkit-text-emphasis-position` and `-webkit-text-emphasis(-style)` are treated the same. `auto` (CSS Text Decoration 4, Firefox 132+ only) is left alone, as are variables and global keywords.

Browser support: unprefixed `text-emphasis-position` is in Chrome 99, Firefox 46 and Safari 7; a single `over` / `under` keyword without `right` / `left` needs Chrome 99 or Firefox 108 (MDN browser-compat-data).

## Options

### `true`

The following patterns are considered problems:

```css
:lang(ja) em { text-emphasis-position: under right; }
```

```css
:lang(ja) .tategaki { writing-mode: vertical-rl; text-emphasis-position: over left; }
```

```css
html { text-emphasis-position: under right; }
:lang(ja) em { text-emphasis: dot; }
```

The following patterns are *not* considered problems:

```css
:lang(ja) em { text-emphasis: sesame; text-emphasis-position: over right; }
```

```css
:lang(zh) em { text-emphasis: dot; text-emphasis-position: under right; }
```

```css
html { text-emphasis-position: under right; }
:lang(ja) em { text-emphasis: dot; text-emphasis-position: over right; }
```

### `assumeJapanese: true`

Treat every declaration as Japanese text (for stylesheets used only on Japanese pages).

### `ignoreSelectors: ["/regex/", "string"]`

Selectors to skip, e.g. deliberate left-side marks in kanbun:

```json
{ "ja-typography/text-emphasis-position-japanese": [true, { "ignoreSelectors": ["/kanbun/"] }] }
```

## Autofix

Not fixable: the side can be intended (and the rule cannot see which writing mode the element ends up in), so it does not rewrite the value.
