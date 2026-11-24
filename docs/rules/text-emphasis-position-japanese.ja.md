# ja-typography/text-emphasis-position-japanese

[English](./text-emphasis-position-japanese.md)

日本語の圏点（傍点）を逆側に付けてしまう `text-emphasis-position` の値を禁止します。`under`（横組で下）と `left`（縦組で左）です。`html`、`:root`、`body`、`*` に指定したこれらの値を日本語の圏点が継承している場合も報告します。

```css
:lang(ja) em {
  text-emphasis: sesame;
  text-emphasis-position: under right;
  /**                     ↑
   * 圏点が行の下に付く。日本語の横組では上 */
}
```

## 理由

JLREQ は「圏点は，縦組では親文字の右側に，横組では親文字の上側に付ける」としています（[JLREQ 3.3.9 圏点の処理](https://www.w3.org/TR/jlreq/#composition_of_emphasis_dots)）。

CSS Text Decoration 3 の `text-emphasis-position` は、横組用の `over` / `under` と縦組用の `right` / `left` の2つのキーワードで位置を決めます。注記では、好ましい位置は言語によって異なり、日本語は `over right`、中国語は `under right` とされています（[CSS Text Decoration 3, 3.4 `text-emphasis-position`](https://www.w3.org/TR/css-text-decor-3/#text-emphasis-position-property)）。

初期値は `over right` なので、何も書かなければ日本語は正しい位置になります。問題になるのは、中国語向けの CSS（`under right`）を書いた・流用した場合です。このプロパティは継承されるので、多言語サイトで `html { text-emphasis-position: under; }` と書くと、日本語の `em` の圏点もすべて下に移ります。

## 報告する内容

日本語のテキストと判断できる宣言だけを調べます（ほかのルールと同じ判定）。`:lang(ja)` / `[lang="ja"]` のセレクター、同じブロックか外側のブロックで `font-family` / `font` の先頭が日本語フォント、または `assumeJapanese: true` のときです。

- 日本語の規則の `under`。ただし、同じブロックか外側のブロックが縦書きの `writing-mode` を指定している場合（`under` が効かない）は除きます。
- 日本語の規則の `left`。ただし、同じブロックか外側のブロックが `writing-mode: horizontal-tb` を指定している場合（`left` が効かない）は除きます。
- 日本語の規則の `text-emphasis` / `text-emphasis-style` で、そのブロックにも外側のブロックにも `text-emphasis-position` がなく、同じファイルの日本語でないトップレベルの `html`、`:root`、`body`、`*` の規則が `under` か `left` を指定している場合。`assumeJapanese` のときは、ルートの規則自体が日本語扱いで直接報告されるので、この判定はしません。

`-webkit-text-emphasis-position` と `-webkit-text-emphasis(-style)` も同じに扱います。`auto`（CSS Text Decoration 4。Firefox 132 以降のみ）、変数、グローバルキーワードは対象外です。

対応状況：接頭辞なしの `text-emphasis-position` は Chrome 99、Firefox 46、Safari 7 から使えます。`right` / `left` を省いた `over` / `under` だけの指定は Chrome 99、Firefox 108 からです（MDN browser-compat-data）。

## オプション

### `true`

問題とみなす例：

```css
:lang(ja) em { text-emphasis-position: under right; }
```

```css
:lang(ja) .tategaki { writing-mode: vertical-rl; text-emphasis-position: over left; }
```

```css
html { text-emphasis-position: under right; }
:lang(ja) em { text-emphasis: dot; }
```

問題としない例：

```css
:lang(ja) em { text-emphasis: sesame; text-emphasis-position: over right; }
```

```css
:lang(zh) em { text-emphasis: dot; text-emphasis-position: under right; }
```

```css
html { text-emphasis-position: under right; }
:lang(ja) em { text-emphasis: dot; text-emphasis-position: over right; }
```

### `assumeJapanese: true`

すべての宣言を日本語のテキストとして扱います（日本語のページだけで使うスタイルシート向け）。

### `ignoreSelectors: ["/regex/", "string"]`

対象外にするセレクター。たとえば漢文で意図的に左に付ける圏点：

```json
{ "ja-typography/text-emphasis-position-japanese": [true, { "ignoreSelectors": ["/kanbun/"] }] }
```

## 自動修正

できません。逆側が意図的なこともあり、要素が最終的にどちらの書字方向になるかもスタイルシートだけでは分からないため、値は書き換えません。
