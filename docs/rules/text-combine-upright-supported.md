# ja-typography/text-combine-upright-supported

[日本語](./text-combine-upright-supported.ja.md)

Report `text-combine-upright` values that browsers do not support, and legacy `-webkit-text-combine` without the standard property.

```css
.tategaki { text-combine-upright: digits 2; }
/**                               ↑
 * not implemented anywhere */
```

## Why

In vertical Japanese text, two- or three-digit numbers (dates, ages) are usually set *tate-chu-yoko* (縦中横): rotated upright and squeezed into one character cell. CSS Writing Modes defines two ways to ask for this ([§ text-combine-upright](https://www.w3.org/TR/css-writing-modes-3/#text-combine-upright)):

- `all`: combine all characters of the element. Supported in Chrome 48, Firefox 48 and Safari 15.4 ([MDN browser-compat-data](https://github.com/mdn/browser-compat-data/blob/main/css/properties/text-combine-upright.json)).
- `digits <integer>`: combine runs of ASCII digits automatically. MDN notes that it “is not supported in any browsers”, and browser-compat-data has no support entry for it.

So `digits` silently does nothing. Wrap the numbers instead:

```html
<p>令和<span class="tcy">12</span>年</p>
```

```css
.tcy { text-combine-upright: all; }
```

Old WebKit used the 2011 draft name `-webkit-text-combine: horizontal`. Keeping it as a fallback is fine, but the standard `text-combine-upright` must be present too.

## Options

### `true`

The following patterns are considered problems:

```css
.v { text-combine-upright: digits 2; }
```

```css
.tcy { -webkit-text-combine: horizontal; }
```

The following patterns are *not* considered problems:

```css
.tcy { text-combine-upright: all; }
```

```css
.tcy { -webkit-text-combine: horizontal; text-combine-upright: all; }
```

## Autofix

`-webkit-text-combine: horizontal | none` is fixed by adding `text-combine-upright: all | none` after it. `digits` is not fixable because it needs markup changes.
