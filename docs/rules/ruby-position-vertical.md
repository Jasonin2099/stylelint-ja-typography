# ja-typography/ruby-position-vertical

[日本語](./ruby-position-vertical.ja.md)

Disallow `ruby-position: under` (and Safari's `-webkit-ruby-position: after`) in vertical Japanese text, where it puts the ruby on the left of the base characters.

```css
.tategaki { writing-mode: vertical-rl; }
.tategaki rt { ruby-position: under; }
/**                           ↑
 * ruby ends up on the left; Japanese vertical text puts it on the right */
```

## Why

`ruby-position` is line-relative. CSS Ruby 1 defines `over` as “the ruby annotation appears line-over the base” and `under` as “line-under the base”, and its figures show `under` as “Ruby to the left of Japanese base text in vertical layout” ([CSS Ruby 1, `ruby-position`](https://www.w3.org/TR/css-ruby-1/#valdef-ruby-position-under)). In vertical writing modes the line-over side is the right and line-under is the left ([CSS Writing Modes 3, § 6.3 Line-relative Directions](https://www.w3.org/TR/css-writing-modes-3/#line-directions)).

JLREQ says that “in principle, ruby is attached to the right of base characters in vertical writing mode, and above in horizontal writing mode”, and that ruby on the left (or below) “is very rare” ([JLREQ § 3.3.4 Choice of Sides for Ruby with Respect to Base Characters](https://www.w3.org/TR/jlreq/#choice_of_sides_for_ruby_with_respect_to_base_characters)).

So a stylesheet that sets `ruby-position: under` for horizontal pages (for example to move furigana under the line in a quiz) usually puts it on the wrong side once the same rule applies to vertical text. The browser default (`alternate`, which behaves like `over` for the first annotation level) is already right.

Left-side ruby is legitimate in one case: double-sided ruby, where the reading goes on the right and a gloss on the left (JLREQ Figure 117). Use `ignoreSelectors` for that, or a disable comment.

Browser support: `ruby-position: over | under` is in Chrome 84, Firefox 38 and Safari 18.2; older Safari only knows `-webkit-ruby-position: before | after` (MDN browser-compat-data). `after` is treated the same as `under`.

## How vertical text is detected

The rule only looks at the stylesheet, so it reports when one of these holds:

- the same block, or an enclosing (nested) block, sets `writing-mode: vertical-rl`, `vertical-lr` or an obsolete vertical value (`tb-rl`, `tb`);
- the selector starts with a selector that sets a vertical `writing-mode` elsewhere in the same file, followed by a combinator (`.tategaki rt`, `.tategaki > ruby rt`).

Vertical text set by another file or by inline styles is not detected.

## Options

### `true`

The following patterns are considered problems:

```css
.v { writing-mode: vertical-rl; ruby-position: under; }
```

```css
.tate { writing-mode: vertical-rl; }
.tate rt { ruby-position: under; }
```

```css
.v { writing-mode: vertical-rl; -webkit-ruby-position: after; }
```

The following patterns are *not* considered problems:

```css
.v { writing-mode: vertical-rl; ruby-position: over; }
```

```css
/* horizontal text */
.quiz rt { ruby-position: under; }
```

### `ignoreSelectors: ["/regex/", "string"]`

Selectors to skip, e.g. the second annotation level of double-sided ruby:

```json
{ "ja-typography/ruby-position-vertical": [true, { "ignoreSelectors": [".tategaki rtc"] }] }
```

## Autofix

Not fixable: left-side ruby can be intended, so the rule does not change it to `over`.
