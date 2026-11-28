# ja-typography/text-spacing-trim-value

[English](./text-spacing-trim-value.md)

ブラウザーが無視してしまう `text-spacing-trim` の値を報告します。仕様にはあるがまだ実装されていない値、編集者草案（Editor's Draft）にしかない位置別のキーワード、もともと無効な値や削除された値が対象です。

```css
p { text-spacing-trim: trim-both; }
/**                    ↑
 * 仕様にはあるが、まだどのブラウザーも未対応 */
```

## 理由

`text-spacing-trim` は、`「` `」` `、` `。` などの全角約物を、行頭・行末・約物どうしが隣り合うところで全角（アキあり）にするか半角（アキなし）にするかを決めるプロパティです（[CSS Text 4 § 8.6](https://drafts.csswg.org/css-text-4/#text-spacing-trim-property)）。JLREQ の約物のアキの規則を CSS で指定するものです。

このプロパティの仕様はまだ動いています。ブラウザーは知らない値を含む宣言をまるごと捨てるので、指定したつもりでも継承値や初期値のまま組まれます。

- **実装済み**：`normal`・`space-all`・`space-first`・`trim-start`。Chrome / Edge 123 以降。Firefox と Safari はプロパティ自体が未対応です（[MDN browser-compat-data](https://github.com/mdn/browser-compat-data/blob/main/css/properties/text-spacing-trim.json)）。
- **仕様にはあるが未実装**：`trim-both`・`trim-all`・`auto`。[作業草案（2026-08-14）](https://www.w3.org/TR/css-text-4/#text-spacing-trim-property) は `<spacing-trim> = space-all | normal | space-first | trim-start | trim-both | trim-all` と `auto` を定めていて、[web-platform-tests](https://github.com/web-platform-tests/wpt/blob/master/css/css-text/parsing/text-spacing-trim-valid.html) もこの 7 つを有効な値として扱います。後ろの 3 つはどのブラウザーも出荷していません。
- **編集者草案のみ**：`[ trim-start | space-start | space-first ] || [ trim-adjacent | space-adjacent ] || [ trim-end | space-end | allow-end ]`（例：`trim-start allow-end`）。最新の[編集者草案](https://drafts.csswg.org/css-text-4/#text-spacing-trim-property)では位置ごとに指定できますが、作業草案とブラウザーのテストでは `allow-end` や組み合わせはまだ無効です。
- **無効・削除済み**：`none` と `no-compress` は 2019 年の `text-spacing` 草案の値です（詰めない指定は `space-all`）。`ideograph-alpha`・`ideograph-numeric`・`punctuation`・`no-autospace`・`insert`・`replace` は `text-autospace` の値です。`normal` と `auto` はほかのキーワードと組み合わせられません。

未実装の値を使うときは、先に対応済みの値を書いておくと、新しい値を知らないブラウザーでもそちらが使われます。

```css
p {
  text-spacing-trim: trim-start; /* Chrome 123 以降 */
  text-spacing-trim: trim-both;  /* ブラウザーが対応したら */
}
```

または `@supports (text-spacing-trim: trim-both)` の中に書きます。

Stylelint 本体の [`declaration-property-value-no-unknown`](https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown)（`stylelint-config-recommended` で有効）も無効な値を報告しますが、ヒントは出ません。`trim-both`・`trim-all`・`auto` は仕様にあるので通します。併用するときは `ignore: ["invalid"]` で二重の報告を避けられます。

## オプション

### `true`

問題とみなす例：

```css
p { text-spacing-trim: trim-both; }
```

```css
p { text-spacing-trim: trim-start allow-end; }
```

```css
p { text-spacing-trim: none; }
```

```css
p { text-spacing-trim: ideograph-alpha; }
```

問題としない例：

```css
p { text-spacing-trim: trim-start; }
```

```css
p { text-spacing-trim: trim-start; text-spacing-trim: trim-both; }
```

```css
@supports (text-spacing-trim: trim-all) {
  .compact { text-spacing-trim: trim-all; }
}
```

### `ignore: ["unsupported", "draft", "invalid"]`

指定した種類の報告を出しません。`unsupported`（`trim-both`・`trim-all`・`auto`）、`draft`（編集者草案の位置別キーワード）、`invalid`（それ以外の無効な値）。

```json
{ "ja-typography/text-spacing-trim-value": [true, { "ignore": ["invalid"] }] }
```

### `ignoreSelectors: ["/regex/", "string"]`

対象外にするセレクター。

## 自動修正

できません。たとえば `trim-both` の代わりに `trim-start` と `space-first` のどちらがよいかは文章によって違うためです。
