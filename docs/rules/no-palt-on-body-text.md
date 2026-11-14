# ja-typography/no-palt-on-body-text

[日本語](./no-palt-on-body-text.ja.md)

Disallow proportional Japanese glyph metrics (`palt`, `pkna`, `vpal`, `vkna`) in `font-feature-settings` on selectors that style running body text.

```css
body { font-feature-settings: "palt"; }
/**                            ↑
 * proportional metrics on body text */
```

## Why

Japanese body text is, in principle, set *solid* (ベタ組み): kanji and kana sit on a square em grid with no extra space between their frames ([JLREQ: principles of arrangement of kanji and kana](https://www.w3.org/TR/jlreq/#principles_of_arrangement_of_kanji_and_kana_characters)). `palt` re-spaces kana and punctuation to proportional widths (CSS Fonts 4 §[font-kerning](https://www.w3.org/TR/css-fonts-4/#font-kerning-prop) describes `palt`/`vpal` as *Proportional Alternate Widths*). That is great for headings and short labels, but on long paragraphs it breaks the grid and makes lines uneven.

Common style guides therefore apply `palt` only to headings, e.g. `:where(h1, h2, h3):lang(ja) { font-feature-settings: "palt"; }`.

Also note that `font-feature-settings` does not merge: a child that sets another feature silently drops an inherited `palt` (CSS Fonts 4 §[font-feature-settings](https://www.w3.org/TR/css-fonts-4/#font-feature-settings-prop)). Setting it on `body` therefore tends to cause inconsistent results anyway.

## What counts as body text

The rule looks at the *subject* (right-most compound) of each selector. It reports when that compound is `*`, `:root`, or one of the body elements below, and is **not** qualified with a class, id, attribute (other than `lang`) or `&`.

Default body elements: `html`, `body`, `main`, `article`, `section`, `p`, `li`, `dd`, `dt`, `td`, `th`, `blockquote`, `figcaption`, `div`.

So `.c-button`, `p.lead` and `h1` are allowed; `body`, `article p` and `:where(p, li)` are reported.

## Options

### `true`

The following patterns are considered problems:

```css
body { font-feature-settings: "palt"; }
```

```css
article p { font-feature-settings: "palt", "tnum"; }
```

```css
* { font-feature-settings: "pkna"; }
```

The following patterns are *not* considered problems:

```css
:where(h1, h2, h3):lang(ja) { font-feature-settings: "palt"; }
```

```css
.c-button { font-feature-settings: "palt"; }
```

```css
body { font-feature-settings: "palt" 0; }
```

## Optional secondary options

### `bodyElements: ["string"]`

Replace the list of element names treated as body text.

### `ignoreSelectors: ["string", "/regex/"]`

Skip rules whose selector matches. For example `{ "ignoreSelectors": ["/^\\.prose/"] }`.

## Autofix

Not fixable: whether a block is body text is a design decision.
