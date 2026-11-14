# ja-typography/no-synthetic-italic

[English](./no-synthetic-italic.md)

斜体の合成を止めていない限り、日本語のテキストに `font-style: italic`／`oblique` を指定することを禁止します。

```css
:lang(ja) em { font-style: italic; }
/**                         ↑
 * 漢字や仮名が機械的に傾けられる */
```

## 理由

CSS Fonts 4 には「中国語・日本語・韓国語のフォントは、ほぼ例外なくイタリック体や斜体を持たない」とあります（[font-synthesis](https://www.w3.org/TR/css-fonts-4/#font-synthesis)）。イタリックを指定してもその書体がなければ、ブラウザーは通常の字形を傾けた斜体を合成します。傾いた漢字は崩れて見え、日本語の組版の慣習でもありません。

W3C 国際化の記事 [Using `<b>` and `<i>` elements](https://www.w3.org/International/questions/qa-b-and-i-tags) では、日本語での代わりとして傍点（CSS の `text-emphasis`）や、書名を示すかぎ括弧などが挙げられています。

置き換えの例：

```css
:lang(ja) em { font-style: normal; text-emphasis: filled sesame; }
:lang(ja) em { font-style: normal; font-weight: bold; }
```

日本語の段落の中の欧文だけを斜体にしたい場合は、`font-style: italic` に `font-synthesis-style: none`（または `font-synthesis: weight`）を加えます。欧文は欧文フォントの本物のイタリック体になり、和文は正体のまま残ります。このルールはこの書き方を許可します。

## 「日本語のテキスト」の判定

CSS だけでは HTML の言語がわからないため、次の手がかりを使います。

- セレクター（入れ子の場合は外側のセレクターも）に `:lang(ja)`、`[lang="ja"]`、`[lang|=ja]`、`[lang^=ja]` がある
- 同じブロック、または入れ子の外側のブロックで、`font-family`（または `font` 一括指定）の**最初**のフォントが日本語フォント（ヒラギノ、游ゴシック、メイリオ、Noto Sans JP、BIZ UD、仮名や漢字を含む名前など）
- `assumeJapanese` オプションが有効

## オプション

### `true`

問題とみなす例：

```css
:lang(ja) em { font-style: italic; }
```

```css
.note { font: italic 16px/1.8 "Noto Sans JP", sans-serif; }
```

問題としない例：

```css
em { font-style: italic; }
```

```css
:lang(ja) em { font-style: italic; font-synthesis-style: none; }
```

## 追加オプション

### `assumeJapanese: boolean`

すべてのルールを日本語のテキストとして扱います。日本語だけのサイト向けです。

### `ignoreSelectors: ["string", "/regex/"]`

一致するセレクターを無視します。

## 自動修正

対象外です。傍点・太字・別の書体のどれにするかはデザイン上の判断のためです。
