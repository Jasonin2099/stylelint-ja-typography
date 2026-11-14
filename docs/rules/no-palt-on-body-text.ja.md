# ja-typography/no-palt-on-body-text

[English](./no-palt-on-body-text.md)

本文を対象とするセレクターで、`font-feature-settings` によるプロポーショナルメトリクス（`palt`・`pkna`・`vpal`・`vkna`）を有効にすることを禁止します。

```css
body { font-feature-settings: "palt"; }
/**                            ↑
 * 本文にプロポーショナル詰め */
```

## 理由

日本語の本文は、原則として文字の外枠を密着させて並べるベタ組みにします（[JLREQ「漢字及び仮名の配置の原則」](https://www.w3.org/TR/jlreq/#principles_of_arrangement_of_kanji_and_kana_characters)）。`palt` は仮名や約物をプロポーショナル幅に詰める機能です（CSS Fonts 4 の [font-kerning](https://www.w3.org/TR/css-fonts-4/#font-kerning-prop) の説明で、`palt`／縦組みの `vpal` として言及されています）。見出しや短いラベルには効果的ですが、長い段落に使うと字面がそろわず読みにくくなります。

そのため一般的なガイドでは、`:where(h1, h2, h3):lang(ja) { font-feature-settings: "palt"; }` のように見出しだけに指定します。

また、`font-feature-settings` は親子で足し合わされません。子要素で別の機能を指定すると、継承した `palt` は外れます（CSS Fonts 4 [font-feature-settings](https://www.w3.org/TR/css-fonts-4/#font-feature-settings-prop)）。`body` に指定しても結果は一定になりにくいです。

## 本文とみなす範囲

各セレクターの一番右の複合セレクターを見ます。それが `*`、`:root`、または下の要素名で、クラス・ID・属性（`lang` 以外）・`&` で絞り込まれていない場合に報告します。

既定の要素：`html`、`body`、`main`、`article`、`section`、`p`、`li`、`dd`、`dt`、`td`、`th`、`blockquote`、`figcaption`、`div`

`.c-button`、`p.lead`、`h1` は許可し、`body`、`article p`、`:where(p, li)` は報告します。

## オプション

### `true`

問題とみなす例：

```css
body { font-feature-settings: "palt"; }
```

```css
article p { font-feature-settings: "palt", "tnum"; }
```

問題としない例：

```css
:where(h1, h2, h3):lang(ja) { font-feature-settings: "palt"; }
```

```css
.c-button { font-feature-settings: "palt"; }
```

## 追加オプション

### `bodyElements: ["string"]`

本文とみなす要素名のリストを置き換えます。

### `ignoreSelectors: ["string", "/regex/"]`

一致するセレクターを無視します。例：`{ "ignoreSelectors": ["/^\\.prose/"] }`

## 自動修正

対象外です。本文かどうかはデザイン上の判断のためです。
