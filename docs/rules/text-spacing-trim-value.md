# ja-typography/text-spacing-trim-value

[日本語](./text-spacing-trim-value.ja.md)

Report `text-spacing-trim` values that browsers drop: values that are in CSS Text 4 but not implemented yet, the per-position keywords that only the Editor's Draft has, and values that were never valid or were removed.

```css
p { text-spacing-trim: trim-both; }
/**                    ↑
 * in the spec, but no browser supports it yet */
```

## Why

`text-spacing-trim` controls whether fullwidth punctuation such as `「` `」` `、` `。` is set full-width (spaced) or half-width (trimmed) at the start of a line, at the end, and between adjacent punctuation ([CSS Text 4 § 8.6](https://drafts.csswg.org/css-text-4/#text-spacing-trim-property)). It is the CSS version of the JLREQ rules for 約物 spacing.

The property is still moving, and an unrecognised value makes the browser drop the whole declaration, so the text silently keeps the inherited or initial spacing:

- **Implemented** — `normal`, `space-all`, `space-first`, `trim-start`: Chrome / Edge 123 and later. Firefox and Safari do not support the property yet ([MDN browser-compat-data](https://github.com/mdn/browser-compat-data/blob/main/css/properties/text-spacing-trim.json)).
- **In the spec, not implemented** — `trim-both`, `trim-all`, `auto`. The [Working Draft (2026-08-14)](https://www.w3.org/TR/css-text-4/#text-spacing-trim-property) defines `<spacing-trim> = space-all | normal | space-first | trim-start | trim-both | trim-all` plus `auto`, and the [web-platform-tests](https://github.com/web-platform-tests/wpt/blob/master/css/css-text/parsing/text-spacing-trim-valid.html) parse exactly those seven. No browser ships the last three.
- **Editor's Draft only** — `[ trim-start | space-start | space-first ] || [ trim-adjacent | space-adjacent ] || [ trim-end | space-end | allow-end ]`, e.g. `trim-start allow-end`. The current [Editor's Draft](https://drafts.csswg.org/css-text-4/#text-spacing-trim-property) lets you set each position separately, but the Working Draft and the browser tests still treat `allow-end` and combinations as invalid.
- **Never valid / removed** — `none` and `no-compress` belonged to the 2019 `text-spacing` draft (use `space-all` for "no trimming"); `ideograph-alpha`, `ideograph-numeric`, `punctuation`, `no-autospace`, `insert` and `replace` are `text-autospace` values; `normal` and `auto` cannot be combined with other keywords.

For unimplemented values, give a supported value first so browsers that do not know the new one keep it:

```css
p {
  text-spacing-trim: trim-start; /* Chrome 123+ */
  text-spacing-trim: trim-both;  /* when browsers ship it */
}
```

or wrap the enhancement in `@supports (text-spacing-trim: trim-both)`.

Stylelint's own [`declaration-property-value-no-unknown`](https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown) (on in `stylelint-config-recommended`) also reports the invalid values, without the hints; it accepts `trim-both`, `trim-all` and `auto` because they are in the spec. If you use it, `ignore: ["invalid"]` avoids double reports.

## Options

### `true`

The following patterns are considered problems:

```css
p { text-spacing-trim: trim-both; }
```

```css
p { text-spacing-trim: trim-start allow-end; }
```

```css
p { text-spacing-trim: none; }
```

```css
p { text-spacing-trim: ideograph-alpha; }
```

The following patterns are *not* considered problems:

```css
p { text-spacing-trim: trim-start; }
```

```css
p { text-spacing-trim: trim-start; text-spacing-trim: trim-both; }
```

```css
@supports (text-spacing-trim: trim-all) {
  .compact { text-spacing-trim: trim-all; }
}
```

### `ignore: ["unsupported", "draft", "invalid"]`

Skip one kind of report: `unsupported` (`trim-both`, `trim-all`, `auto`), `draft` (per-position keywords of the Editor's Draft) or `invalid` (everything else that is not a value).

```json
{ "ja-typography/text-spacing-trim-value": [true, { "ignore": ["invalid"] }] }
```

### `ignoreSelectors: ["/regex/", "string"]`

Selectors to skip.

## Autofix

Not fixable: which supported value is right (`trim-start` or `space-first` for `trim-both`, for example) depends on the text.
