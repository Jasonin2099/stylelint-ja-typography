# ja-typography/font-feature-settings-keep-inherited

[日本語](./font-feature-settings-keep-inherited.ja.md)

Report a `font-feature-settings` list (or a `font` shorthand) that silently drops a Japanese OpenType feature such as `palt` set on an ancestor-like rule.

```css
.headline { font-feature-settings: "palt"; }
.headline .date { font-feature-settings: "tnum"; }
/**                                     ↑
 * The date loses "palt": this list replaces ".headline"'s list */
```

## Why

`font-feature-settings` is not merged. CSS Fonts 4 says: “The entire property value is set at once. Unlike the font-variant properties, there is no way to modify the inherited value by adding or removing individual features.” ([CSS Fonts 4, 6.12 `font-feature-settings`](https://drafts.csswg.org/css-fonts-4/#font-feature-settings-prop)). So a child that only wants tabular figures also turns off the proportional kana / punctuation metrics (`palt`) it inherited, and the line suddenly looks looser.

The `font` shorthand has the same effect: `font-feature-settings` is one of its “reset implicitly” sub-properties, so `font: 1em/1.8 serif` sets it back to `normal` ([CSS Fonts 4, 2.7 `font`](https://drafts.csswg.org/css-fonts-4/#font-prop)).

The `font-variant-*` properties (for example `font-variant-numeric: tabular-nums` instead of `"tnum"`) cascade one by one and do not have this problem; prefer them where one exists (see [`prefer-font-variant-east-asian`](./prefer-font-variant-east-asian.md)). `palt`, `vpal`, `halt` and `pkna` have no `font-variant` equivalent.

## What is checked

For each rule whose last word on font settings is a `font-feature-settings` list or a `font` shorthand, the rule finds the closest *provider* — another rule that enables or disables watched features — and reports watched features the provider sets that this list does not mention (on or off):

1. an enclosing rule (CSS nesting), otherwise
2. the rule with the longest selector this selector sits under: a descendant (`.a .b`, `.a > .b`) or the same element with more conditions (`.a:hover`, `.a.is-active`, `.a::before`). `.a + .b`, `.a ~ .b` and `.a-b` do not count, nor does a provider inside an at-rule (`@media`, `@supports`, `@layer`) the checked rule is not in; otherwise
3. a root-like rule (`html`, `:root`, `body`, `*`) — not checked between two root-like rules.

Selectors are compared as written; the rule does not know the HTML, so a provider can be missed but is not invented. `font-feature-settings: normal` / `initial`, `font: inherit` and values with variables are left alone; `-webkit-font-feature-settings` is not read. Within one block, a `font` shorthand after `font-feature-settings` is already reported by the core rule [`declaration-block-no-shorthand-property-overrides`](https://stylelint.io/user-guide/rules/declaration-block-no-shorthand-property-overrides/).

Watched features by default: `palt`, `vpal`, `halt`, `vhal`, `pkna`, `hkna`, `vkna`, `pwid`, `fwid`, `hwid`, `twid`, `qwid`, `jp78`, `jp83`, `jp90`, `jp04`, `nlck`, `expt`, `trad`, `hojo`, `ruby`, `vert`, `vrt2`, `ital` (`kern` is left to [`prefer-font-kerning`](./prefer-font-kerning.md)).

## Options

### `true`

The following patterns are considered problems:

```css
.headline { font-feature-settings: "palt"; }
.headline .date { font-feature-settings: "tnum"; }
```

```css
.btn { font-feature-settings: "palt"; }
.btn:hover { font-feature-settings: "ss01"; }
```

```css
.tate { font-feature-settings: "vpal"; }
.tate .note { font: 0.8em/1.6 serif; }
```

The following patterns are *not* considered problems:

```css
.headline { font-feature-settings: "palt"; }
.headline .date { font-feature-settings: "palt", "tnum"; }
```

```css
/* Turned off on purpose */
.headline { font-feature-settings: "palt"; }
.headline code { font-feature-settings: "palt" 0, "zero"; }
```

```css
.headline { font-feature-settings: "palt"; }
.headline .date { font-variant-numeric: tabular-nums; }
```

### `features: ["palt", "liga", …]`

Replace the list of watched features (OpenType tags, compared as written).

### `ignoreSelectors: ["/regex/", "string"]`

Selectors of the *overriding* rule to skip.

## Autofix

Not fixable: the provider is found by selector text, which can be wrong for the real document, and the fix (repeat the feature, turn it off, or switch to a `font-variant-*` property) depends on intent.
