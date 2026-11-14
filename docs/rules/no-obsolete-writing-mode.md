# ja-typography/no-obsolete-writing-mode

[日本語](./no-obsolete-writing-mode.ja.md)

Disallow the obsolete SVG 1.1 / IE values of `writing-mode` (`tb-rl`, `tb`, `lr-tb` …).

```css
.tategaki { writing-mode: tb-rl; }
/**                       ↑
 * use vertical-rl */
```

## Why

Older Japanese vertical-text tutorials (written for IE) use `writing-mode: tb-rl`. CSS Writing Modes 3 lists these SVG 1.1 values as “obsolete in any context except SVG1 documents and … therefore optional for non-SVG UAs” ([§ 3.2.1 Obsolete SVG1.1 writing-mode Values](https://www.w3.org/TR/css-writing-modes-3/#svg-writing-mode)). Browsers that still accept them only do so for compatibility. The spec also states that the `tb-lr` value of the older CSS draft “is replaced by `vertical-lr`”.

| Obsolete | Modern |
| --- | --- |
| `lr`, `lr-tb`, `rl`, `rl-tb` | `horizontal-tb` |
| `tb`, `tb-rl` | `vertical-rl` |
| `tb-lr` | `vertical-lr` |

The mapping is the one the spec gives for computing these values, so the fix does not change rendering in browsers that support them.

Stylelint's core `declaration-property-value-keyword-no-deprecated` does not cover `writing-mode` (as of Stylelint 18).

`-ms-writing-mode` (IE only) is out of scope.

## Options

### `true`

The following patterns are considered problems:

```css
.v { writing-mode: tb-rl; }
```

```css
.v { -webkit-writing-mode: tb-rl; }
```

The following patterns are *not* considered problems:

```css
.v { writing-mode: vertical-rl; }
```

## Autofix

Fixable with `--fix` using the table above.
