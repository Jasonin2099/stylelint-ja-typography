# ja-typography/palt-vpal-match-writing-mode

[English](./palt-vpal-match-writing-mode.md)

縦書きでは縦組み用の機能（`vpal`・`vhal`）を、横書きでは横組み用の機能（`palt`・`halt`）を使うよう求めます。

```css
.tategaki {
  writing-mode: vertical-rl;
  font-feature-settings: "palt";
  /**                     ↑
   * "vpal" にする */
}
```

## 理由

OpenType には横組み用と縦組み用の詰め機能が別々にあります。`palt` が調整するのは文字の送り幅（横幅）で、縦組みで送り方向になる高さを調整するのは `vpal` です。CSS Fonts 4 も「`palt`、縦組みでは `vpal`」と対で説明しています（[font-kerning](https://www.w3.org/TR/css-fonts-4/#font-kerning-prop)）。`vertical-rl` の段落に `palt` を指定しても詰まらないか、字が行の中心から横にずれます。

`halt`／`vhal`（半角幅）も同じ関係です。カーニング（`kern`／`vkrn`）は対象外です。`font-kerning: normal` を使えば、書字方向に合わせて `kern` か `vkrn` が選ばれます（CSS Fonts 4）。

`text-orientation: sideways` のときは、縦の行でも横組みを回転した形で組まれるため（[CSS Writing Modes 3 text-orientation](https://www.w3.org/TR/css-writing-modes-3/#text-orientation)）、横組み用の機能を期待します。`sideways-rl`・`sideways-lr` も同じ理由で横組みとして扱います。

`font-feature-settings` と**同じブロック**にある `writing-mode` だけを見ます。

## オプション

### `true`

問題とみなす例：

```css
.v { writing-mode: vertical-rl; font-feature-settings: "palt"; }
```

```css
.h { writing-mode: horizontal-tb; font-feature-settings: "vpal"; }
```

問題としない例：

```css
.v { writing-mode: vertical-rl; font-feature-settings: "vpal"; }
```

```css
.v { writing-mode: vertical-rl; text-orientation: sideways; font-feature-settings: "palt"; }
```

## 自動修正

`--fix` で修正できます。機能タグだけを置き換え（`"palt"` → `"vpal"`）、`1` などの値やほかの機能はそのまま残します。置き換え先のタグがすでにある場合は、報告だけして修正しません。
