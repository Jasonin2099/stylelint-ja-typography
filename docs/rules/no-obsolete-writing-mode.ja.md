# ja-typography/no-obsolete-writing-mode

[English](./no-obsolete-writing-mode.md)

`writing-mode` の古い SVG 1.1／IE 向けの値（`tb-rl`、`tb`、`lr-tb` など）を禁止します。

```css
.tategaki { writing-mode: tb-rl; }
/**                       ↑
 * vertical-rl を使う */
```

## 理由

IE 向けに書かれた古い縦書きの解説では `writing-mode: tb-rl` が使われています。CSS Writing Modes 3 は、これらの SVG 1.1 の値を「SVG1 文書以外では廃止されており、SVG 以外のユーザーエージェントでは対応は任意」としています（[3.2.1 Obsolete SVG1.1 writing-mode Values](https://www.w3.org/TR/css-writing-modes-3/#svg-writing-mode)）。今でも受け付けるブラウザーは互換性のために残しているだけです。また、古い CSS の草案にあった `tb-lr` は `vertical-lr` に置き換えられたと書かれています。

| 古い値 | 現在の値 |
| --- | --- |
| `lr`、`lr-tb`、`rl`、`rl-tb` | `horizontal-tb` |
| `tb`、`tb-rl` | `vertical-rl` |
| `tb-lr` | `vertical-lr` |

対応は仕様が定める計算値と同じなので、これらの値に対応しているブラウザーでの表示は修正後も変わりません。

Stylelint 本体の `declaration-property-value-keyword-no-deprecated` は、Stylelint 18 の時点で `writing-mode` を扱っていません。

IE 専用の `-ms-writing-mode` は対象外です。

## オプション

### `true`

問題とみなす例：

```css
.v { writing-mode: tb-rl; }
```

```css
.v { -webkit-writing-mode: tb-rl; }
```

問題としない例：

```css
.v { writing-mode: vertical-rl; }
```

## 自動修正

`--fix` で上の表のとおりに修正できます。
