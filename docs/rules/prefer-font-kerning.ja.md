# ja-typography/prefer-font-kerning

[English](./prefer-font-kerning.md)

`font-feature-settings` の `"kern"` / `"vkrn"` の代わりに、`font-kerning` を使うよう求めます。

```css
p { font-feature-settings: "kern"; }
/**                         ↑
 * font-kerning: normal を使う */
```

## 理由

CSS Fonts 4 には、上位のプロパティがある機能を `font-feature-settings` で指定すべきではない、とあります。上位のプロパティは単独でカスケードし、フォントにその機能がなくても合成できることがあるためです（[font-feature-settings](https://www.w3.org/TR/css-fonts-4/#font-feature-settings-prop)）。カーニング関連の対応は次のとおりです。

| OpenType 機能 | 有効時の `font-kerning` | 無効時の `font-kerning` |
| --- | --- | --- |
| `kern`（カーニング） | `normal` | `none` |
| `vkrn`（縦書きのカーニング） | `normal` | `none` |

`font-kerning` は `writing-mode` に応じて `kern` か `vkrn` を有効にします（[§ 6.3 font-kerning](https://www.w3.org/TR/css-fonts-4/#font-kerning-prop)）。子要素で `font-feature-settings: "palt"` を指定すると、継承した `"kern"` は外れますが、`font-kerning: normal` なら残ります。

東アジア向けタグに対する `prefer-font-variant-east-asian` と同じ考え方です。`"palt"` / `"vpal"` はカーニングではなく字幅のメトリクスを変える機能なので、このルールの対象外です。

## オプション

### `true`

問題とみなす例：

```css
p { font-feature-settings: "kern"; }
```

```css
.v { font-feature-settings: "vkrn" on; }
```

```css
p { font-feature-settings: "kern" off; }
```

問題としない例：

```css
p { font-kerning: normal; }
```

```css
h1 { font-feature-settings: "palt"; }
```

## 自動修正

`--fix` で修正できます。リストが `"kern"` と `"vkrn"` だけであり、どちらも同じ向き（どちらも有効 → `normal`、どちらも無効 → `none`）のときです。

```css
/* 修正前 */
p { font-feature-settings: "kern"; }
/* 修正後 */
p { font-kerning: normal; }
```

他の機能が残っている場合（例：`"palt", "kern"`）、同じブロックにすでに `font-kerning` がある場合、`!important` 付きの場合、`"kern"` と `"vkrn"` の有効・無効が食い違う場合は修正しません。
