# ja-typography/prefer-font-variant-east-asian

[English](./prefer-font-variant-east-asian.md)

`font-feature-settings` の東アジア向けの OpenType 機能の代わりに、`font-variant-east-asian` を使うよう求めます。

```css
p { font-feature-settings: "pwid"; }
/**                         ↑
 * font-variant-east-asian: proportional-width を使う */
```

## 理由

CSS Fonts 4 には「次の表の機能は `font-feature-settings` で指定すべきではなく、上位のプロパティを使うこと」とあります（[font-feature-settings](https://www.w3.org/TR/css-fonts-4/#font-feature-settings-prop)）。東アジア向けの機能の対応は次のとおりです。

| OpenType 機能 | `font-variant-east-asian` |
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

上位のプロパティは単独でカスケードします。`font-feature-settings` は違い、子要素で `"tnum"` を指定すると継承した `"pwid"` が外れます。`font-variant-east-asian` ならそうなりません。

注意：`palt`（プロポーショナル**メトリクス**）は `pwid`（プロポーショナル**字形**）とは別の機能で、`font-variant` に対応する値がありません。そのため `palt`・`pkna`・`halt`・`vpal` はこのルールの対象外です。

## オプション

### `true`

問題とみなす例：

```css
p { font-feature-settings: "pwid"; }
```

```css
rt { font-feature-settings: "ruby" on; }
```

問題としない例：

```css
p { font-variant-east-asian: proportional-width; }
```

```css
h1 { font-feature-settings: "palt"; }
```

## 自動修正

`--fix` で修正できます。

```css
/* 修正前 */
h1 { font-feature-settings: "palt", "trad"; }
/* 修正後 */
h1 { font-feature-settings: "palt"; font-variant-east-asian: traditional; }
```

同じブロックにすでに `font-variant` か `font-variant-east-asian` がある場合、`!important` 付きの場合、一つの値にまとめられない組み合わせ（例：`"jp78", "jp90"`）の場合は修正しません。無効にした機能（`"pwid" 0`）は対象外です。
