# ja-typography/keep-all-needs-overflow-wrap

[English](./keep-all-needs-overflow-wrap.md)

`word-break: keep-all` を指定したブロックに、`overflow-wrap: anywhere`（または `break-word`）も指定するよう求めます。

```css
h1 { word-break: keep-all; }
/**              ↑
 * 行より長い文節がはみ出す */
```

## 理由

`word-break: keep-all` は、CJK の文字と文字のあいだの改行位置をなくします。仕様にも「このスタイルでは、CJK の文字の連続は改行されない」と書かれています（[CSS Text 3 word-break](https://www.w3.org/TR/css-text-3/#valdef-word-break-keep-all)）。日本語は単語をスペースで区切らないため、改行できるのは句読点・スペース・`<wbr>` の位置だけになり、長い見出しはスマートフォンで枠からはみ出します。

それでも `keep-all` は便利です。[BudouX](https://github.com/google/budoux) で文節ごとに `<wbr>` を入れると、文節単位の自然な改行になります。ただし一つの文節が枠より長い場合もあるので、保険を付けます。

```css
h1 {
  word-break: keep-all;
  overflow-wrap: anywhere;
}
```

`overflow-wrap` は、ほかに収める方法がないときだけ単語の途中で改行します（[CSS Text 3 overflow-wrap](https://www.w3.org/TR/css-text-3/#overflow-wrap-property)）。`anywhere` は flex や grid の子要素の最小幅も縮められる点が `break-word` と異なります。

Chromium には、BudouX と同じような文節改行をブラウザーが行う `word-break: auto-phrase`（Chrome 119 以降、日本語のみ）もあります。このルールでは報告しません。

## オプション

### `true`

問題とみなす例：

```css
h1 { word-break: keep-all; }
```

```css
h1 { word-break: keep-all; overflow-wrap: normal; }
```

問題としない例：

```css
h1 { word-break: keep-all; overflow-wrap: anywhere; }
```

```css
h1 { word-break: keep-all; word-wrap: break-word; }
```

## 追加オプション

### `ignoreSelectors: ["string", "/regex/"]`

一致するセレクターを無視します。スペースで単語を区切る韓国語だけのブロックなどに使います。例：`{ "ignoreSelectors": ["/:lang\\(ko\\)/"] }`

## 自動修正

対象外です。`anywhere` と `break-word` のどちらが適切かはレイアウト（flex や grid の最小幅）によるためです。
