# ja-typography/prefer-font-kerning

[日本語](./prefer-font-kerning.ja.md)

Prefer `font-kerning` over the `"kern"` / `"vkrn"` OpenType tags in `font-feature-settings`.

```css
p { font-feature-settings: "kern"; }
/**                         ↑
 * use font-kerning: normal */
```

## Why

CSS Fonts 4 says authors should not use `font-feature-settings` for features that have a higher-level property, because those properties cascade on their own and can be synthesised when a font has no feature bit ([§ font-feature-settings](https://www.w3.org/TR/css-fonts-4/#font-feature-settings-prop)). The replacement table maps both kerning tags to `font-kerning`:

| OpenType tag | `font-kerning` (enabled) | `font-kerning` (disabled) |
| --- | --- | --- |
| `kern` (kerning) | `normal` | `none` |
| `vkrn` (vertical kerning) | `normal` | `none` |

The `font-kerning` property then turns on `kern` or `vkrn` according to `writing-mode` ([§ 6.3 font-kerning](https://www.w3.org/TR/css-fonts-4/#font-kerning-prop)). A child that sets `font-feature-settings: "palt"` would drop an inherited `"kern"`, while `font-kerning: normal` keeps working.

This is the same idea as `prefer-font-variant-east-asian` for the East Asian tags. `"palt"` / `"vpal"` are left alone: they have no `font-kerning` equivalent (they change glyph metrics, not kerning).

## Options

### `true`

The following patterns are considered problems:

```css
p { font-feature-settings: "kern"; }
```

```css
.v { font-feature-settings: "vkrn" on; }
```

```css
p { font-feature-settings: "kern" off; }
```

The following patterns are *not* considered problems:

```css
p { font-kerning: normal; }
```

```css
h1 { font-feature-settings: "palt"; }
```

## Autofix

Fixable with `--fix` when `"kern"` and/or `"vkrn"` are the only features in the list and they agree (all on → `normal`, all off → `none`):

```css
/* before */
p { font-feature-settings: "kern"; }
/* after */
p { font-kerning: normal; }
```

The fix is skipped when other features remain in the list (for example `"palt", "kern"`), when the block already has `font-kerning`, when the declaration is `!important`, or when `"kern"` and `"vkrn"` disagree (one on, one off).
