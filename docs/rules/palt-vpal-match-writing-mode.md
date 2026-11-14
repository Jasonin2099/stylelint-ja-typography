# ja-typography/palt-vpal-match-writing-mode

[日本語](./palt-vpal-match-writing-mode.ja.md)

Require the vertical variants of spacing features (`vpal`, `vhal`) in vertical writing modes, and the horizontal ones (`palt`, `halt`) in horizontal modes.

```css
.tategaki {
  writing-mode: vertical-rl;
  font-feature-settings: "palt";
  /**                     ↑
   * should be "vpal" */
}
```

## Why

OpenType keeps separate features for horizontal and vertical metrics. `palt` adjusts *advance widths*; in vertical text the advance is the glyph's *height*, which is what `vpal` adjusts. CSS Fonts 4 names the pair explicitly: “enabled with the `palt` feature, or, for vertical typesetting, the `vpal` feature” ([§ font-kerning](https://www.w3.org/TR/css-fonts-4/#font-kerning-prop)). Using `palt` in `vertical-rl` text either does nothing or shifts glyphs sideways off the column centre.

The same pairing applies to `halt`/`vhal` (half widths). Kerning (`kern`/`vkrn`) is not checked: use `font-kerning: normal`, which CSS Fonts 4 says “will set the kern or vkrn feature depending on the writing-mode”.

When `text-orientation: sideways` is set, a vertical line is laid out like rotated horizontal text ([CSS Writing Modes 3 § text-orientation](https://www.w3.org/TR/css-writing-modes-3/#text-orientation)), so the horizontal features are expected. `sideways-rl` / `sideways-lr` are treated as horizontal for the same reason.

The rule only inspects `writing-mode` declared in the **same block** as `font-feature-settings`.

## Options

### `true`

The following patterns are considered problems:

```css
.v { writing-mode: vertical-rl; font-feature-settings: "palt"; }
```

```css
.h { writing-mode: horizontal-tb; font-feature-settings: "vpal"; }
```

The following patterns are *not* considered problems:

```css
.v { writing-mode: vertical-rl; font-feature-settings: "vpal"; }
```

```css
.v { writing-mode: vertical-rl; text-orientation: sideways; font-feature-settings: "palt"; }
```

## Autofix

Fixable with `--fix`: the feature tag is swapped (`"palt"` → `"vpal"`). Settings such as `1` and the other features in the list are kept. If the replacement tag is already present, the problem is reported but not fixed.
