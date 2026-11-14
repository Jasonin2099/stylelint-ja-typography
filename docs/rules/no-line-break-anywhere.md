# ja-typography/no-line-break-anywhere

[日本語](./no-line-break-anywhere.ja.md)

Disallow `line-break: anywhere`.

```css
p { line-break: anywhere; }
/**             ↑
 * turns off 禁則処理 (kinsoku) */
```

## Why

Japanese line breaking forbids some characters at the start of a line (closing brackets, 。、, small kana, ー …) and some at the end (opening brackets). JLREQ defines these as line start and line end prohibition rules ([JLREQ: line start prohibition rule](https://www.w3.org/TR/jlreq/#term.line-start-prohibition-rule)). CSS implements these rules through `line-break: strict | normal | loose`.

`anywhere` is different: “There is a soft wrap opportunity around every typographic character unit, including around any punctuation character … disregarding any prohibition against line breaks” ([CSS Text 3 § line-break](https://www.w3.org/TR/css-text-3/#valdef-line-break-anywhere)). On Japanese text this puts 。 or 」 at the beginning of lines.

People usually reach for it to stop long URLs or code from overflowing. `overflow-wrap: anywhere` solves that without dropping kinsoku, because it only breaks when nothing else fits.

| Need | Use |
| --- | --- |
| Long URL / ID overflows | `overflow-wrap: anywhere` |
| Narrow columns, newspaper-like | `line-break: loose` |
| Formal text, books | `line-break: strict` |

The spec notes that `anywhere` can be wanted for some mostly-CJK displays; use `ignoreSelectors` for those deliberate cases.

## Options

### `true`

The following patterns are considered problems:

```css
p { line-break: anywhere; }
```

```css
p { -webkit-line-break: anywhere; }
```

The following patterns are *not* considered problems:

```css
p { line-break: strict; }
```

```css
p { overflow-wrap: anywhere; }
```

## Optional secondary options

### `ignoreSelectors: ["string", "/regex/"]`

Skip rules whose selector matches.

## Autofix

Not fixable: there are several possible replacements (see the table).
