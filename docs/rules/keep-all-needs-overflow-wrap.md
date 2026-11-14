# ja-typography/keep-all-needs-overflow-wrap

[日本語](./keep-all-needs-overflow-wrap.ja.md)

Require `overflow-wrap: anywhere` (or `break-word`) in the same block as `word-break: keep-all`.

```css
h1 { word-break: keep-all; }
/**              ↑
 * no fallback when a phrase is wider than the line */
```

## Why

`word-break: keep-all` suppresses the soft wrap opportunities between CJK letters. The spec says it plainly: “In this style, sequences of CJK characters do not break” ([CSS Text 3 § word-break](https://www.w3.org/TR/css-text-3/#valdef-word-break-keep-all)). Japanese is written without spaces, so a line can then only break at punctuation, spaces or `<wbr>`. A long heading becomes one unbreakable run and overflows its box on phones.

`keep-all` is still useful: together with phrase markup from [BudouX](https://github.com/google/budoux) (`<wbr>` between 文節) it gives natural phrase-based wrapping. But a phrase can still be wider than the container, so add a safety net:

```css
h1 {
  word-break: keep-all;
  overflow-wrap: anywhere;
}
```

`overflow-wrap` only breaks inside a word when there is no other way to fit the line ([CSS Text 3 § overflow-wrap](https://www.w3.org/TR/css-text-3/#overflow-wrap-property)). `anywhere` also lets min-content sizing shrink (in flex/grid items), which `break-word` does not.

Chromium also offers `word-break: auto-phrase` (Chrome 119+, Japanese only) which does BudouX-style phrase wrapping in the browser; it is not reported by this rule.

## Options

### `true`

The following patterns are considered problems:

```css
h1 { word-break: keep-all; }
```

```css
h1 { word-break: keep-all; overflow-wrap: normal; }
```

The following patterns are *not* considered problems:

```css
h1 { word-break: keep-all; overflow-wrap: anywhere; }
```

```css
h1 { word-break: keep-all; word-wrap: break-word; }
```

## Optional secondary options

### `ignoreSelectors: ["string", "/regex/"]`

Skip rules whose selector matches, e.g. Korean-only blocks where spaces separate words: `{ "ignoreSelectors": ["/:lang\\(ko\\)/"] }`.

## Autofix

Not fixable: whether `anywhere` or `break-word` is right depends on the layout (flex/grid min-content sizing).
