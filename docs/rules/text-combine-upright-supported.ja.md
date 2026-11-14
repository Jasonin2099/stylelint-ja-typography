# ja-typography/text-combine-upright-supported

[English](./text-combine-upright-supported.md)

ブラウザーが対応していない `text-combine-upright` の値と、標準プロパティのない古い `-webkit-text-combine` を報告します。

```css
.tategaki { text-combine-upright: digits 2; }
/**                               ↑
 * どのブラウザーも未実装 */
```

## 理由

縦書きの日本語では、日付や年齢などの 2〜3 桁の数字を縦中横（1 文字分の幅に横向きで収める）にするのが一般的です。CSS Writing Modes では次の 2 通りの指定が定められています（[text-combine-upright](https://www.w3.org/TR/css-writing-modes-3/#text-combine-upright)）。

- `all`：要素内の文字をすべてまとめます。Chrome 48、Firefox 48、Safari 15.4 から使えます（[MDN browser-compat-data](https://github.com/mdn/browser-compat-data/blob/main/css/properties/text-combine-upright.json)）。
- `digits <integer>`：連続する半角数字を自動でまとめます。MDN には「どのブラウザーも対応していない」とあり、browser-compat-data にも対応の記録がありません。

そのため `digits` を指定しても何も起きません。数字を要素で囲みます。

```html
<p>令和<span class="tcy">12</span>年</p>
```

```css
.tcy { text-combine-upright: all; }
```

古い WebKit は 2011 年の草案の名前 `-webkit-text-combine: horizontal` を使っていました。互換用に残すのは構いませんが、標準の `text-combine-upright` も必要です。

## オプション

### `true`

問題とみなす例：

```css
.v { text-combine-upright: digits 2; }
```

```css
.tcy { -webkit-text-combine: horizontal; }
```

問題としない例：

```css
.tcy { text-combine-upright: all; }
```

```css
.tcy { -webkit-text-combine: horizontal; text-combine-upright: all; }
```

## 自動修正

`-webkit-text-combine: horizontal | none` は、後ろに `text-combine-upright: all | none` を追加して修正します。`digits` は HTML の変更が必要なため修正しません。
