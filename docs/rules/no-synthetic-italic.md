# ja-typography/no-synthetic-italic

[日本語](./no-synthetic-italic.ja.md)

Disallow `font-style: italic` / `oblique` on Japanese text unless oblique synthesis is turned off.

```css
:lang(ja) em { font-style: italic; }
/**                         ↑
 * the browser will skew kanji and kana */
```

## Why

CSS Fonts 4 notes that “Chinese, Japanese and Korean fonts almost always lack italic or oblique faces” ([§ font-synthesis](https://www.w3.org/TR/css-fonts-4/#font-synthesis)). When italic is requested and no such face exists, the browser *synthesizes* an oblique by skewing the regular glyphs. Skewed kanji look broken, and the effect is not a Japanese convention at all.

The W3C Internationalization article [Using `<b>` and `<i>` elements](https://www.w3.org/International/questions/qa-b-and-i-tags) gives the Japanese alternatives: emphasis dots (傍点, CSS `text-emphasis`), corner brackets for titles, and so on.

Typical replacements:

```css
:lang(ja) em { font-style: normal; text-emphasis: filled sesame; }
:lang(ja) em { font-style: normal; font-weight: bold; }
```

If you *want* Latin words in a Japanese paragraph to be italic, keep `font-style: italic` and add `font-synthesis-style: none` (or `font-synthesis: weight`). Then Latin glyphs use the real italic of the Latin font and Japanese glyphs stay upright. This rule accepts that pattern.

## When is text “Japanese”?

A stylesheet does not know the language of the HTML, so the rule uses these signals:

- the selector (or an enclosing nested selector) contains `:lang(ja)`, `[lang="ja"]`, `[lang|=ja]` or `[lang^=ja]`;
- the same block, or an enclosing block in nested CSS, sets `font-family` (or the `font` shorthand) whose **first** family is a known Japanese font (Hiragino, Yu Gothic, Meiryo, Noto Sans JP, BIZ UD, 游ゴシック, any name containing kana or kanji, …);
- or the `assumeJapanese` option is on.

## Options

### `true`

The following patterns are considered problems:

```css
:lang(ja) em { font-style: italic; }
```

```css
.note { font: italic 16px/1.8 "Noto Sans JP", sans-serif; }
```

The following patterns are *not* considered problems:

```css
em { font-style: italic; }
```

```css
:lang(ja) em { font-style: italic; font-synthesis-style: none; }
```

## Optional secondary options

### `assumeJapanese: boolean`

Treat every rule as Japanese text. Useful for sites that are Japanese only.

### `ignoreSelectors: ["string", "/regex/"]`

Skip rules whose selector matches.

## Autofix

Not fixable: the right replacement (emphasis dots, bold, a different typeface) is a design choice.
