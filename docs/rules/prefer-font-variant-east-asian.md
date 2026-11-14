# ja-typography/prefer-font-variant-east-asian

[日本語](./prefer-font-variant-east-asian.ja.md)

Prefer `font-variant-east-asian` over the equivalent OpenType tags in `font-feature-settings`.

```css
p { font-feature-settings: "pwid"; }
/**                         ↑
 * use font-variant-east-asian: proportional-width */
```

## Why

CSS Fonts 4 says: “Authors should not use `font-feature-settings` to set any of the font features in the table below. Instead, please use the higher-level replacement properties” ([§ font-feature-settings](https://www.w3.org/TR/css-fonts-4/#font-feature-settings-prop)). The table maps the East Asian features like this:

| OpenType tag | `font-variant-east-asian` |
| --- | --- |
| `jp78` | `jis78` |
| `jp83` | `jis83` |
| `jp90` | `jis90` |
| `jp04` | `jis04` |
| `smpl` | `simplified` |
| `trad` | `traditional` |
| `fwid` | `full-width` |
| `pwid` | `proportional-width` |
| `ruby` | `ruby` |

The higher-level property cascades on its own. `font-feature-settings` does not: a child that sets `"tnum"` drops an inherited `"pwid"`, while `font-variant-east-asian` keeps working.

Note: `palt` (proportional alternate *metrics*) is **not** the same as `pwid` (proportional *glyphs*) and has no `font-variant` equivalent, so this rule leaves `palt`, `pkna`, `halt` and `vpal` alone.

## Options

### `true`

The following patterns are considered problems:

```css
p { font-feature-settings: "pwid"; }
```

```css
rt { font-feature-settings: "ruby" on; }
```

The following patterns are *not* considered problems:

```css
p { font-variant-east-asian: proportional-width; }
```

```css
h1 { font-feature-settings: "palt"; }
```

## Autofix

Fixable with `--fix`:

```css
/* before */
h1 { font-feature-settings: "palt", "trad"; }
/* after */
h1 { font-feature-settings: "palt"; font-variant-east-asian: traditional; }
```

The fix is skipped when the block already has `font-variant` or `font-variant-east-asian`, when the declaration is `!important`, or when the tags cannot be combined into one valid value (for example `"jp78", "jp90"`). Disabled tags (`"pwid" 0`) are ignored.
