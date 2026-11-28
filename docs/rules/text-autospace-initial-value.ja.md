# ja-typography/text-autospace-initial-value

[English](./text-autospace-initial-value.md)

`text-autospace` の初期値に頼る `text-autospace: initial` / `revert` を報告します。`requireOnRoot` を付けると、ルートで日本語の設定をしているのに `text-autospace` の値を選んでいないスタイルシートも報告します。オプトイン（`recommended` には入っていません）。

```css
:lang(ja) p {
  text-autospace: initial;
  /**             ↑
   * 仕様では "normal"、実際のブラウザーはすべて "no-autospace" */
}
```

## 理由

`text-autospace` は、漢字と隣り合うラテン文字・数字のあいだに小さな空き（和字の送り幅の 1/8、0.125ic）を入れ、`日本語ABC123` が詰まらないようにします（[CSS Text 4, 8.4](https://drafts.csswg.org/css-text-4/#text-autospace-property)）。

初期値は、仕様とブラウザーで食い違っています。

- CSS Text 4 の作業草案（2026年8月14日）は初期値を `normal`（`ideograph-alpha ideograph-numeric` と同じ）としていて、既定で空きが入ります。CSS Working Group は[2025年12月10日に](https://github.com/w3c/csswg-drafts/issues/12386)、初期値を `normal` のままにすると決めました。
- Chrome 140、Firefox 145、Safari 18.4（とそれらをもとにしたブラウザー）は `no-autospace` で出荷していて、既定では空きが入りません。MDN の browser-compat-data がすべてのエンジンについて注記しています。同じ issue で Firefox の開発者は、他のブラウザーとの互換のために `no-autospace` で出荷していて、全エンジンが仕様に合わせるのが望ましいと述べています。

つまり、何も書かないページは今は空きなしですが、仕様はあり（on）としており、既定が変わるかもしれません。`text-autospace: initial`（や `revert`。ユーザーエージェントのスタイルシートはこのプロパティを設定していません）のようなリセットは、この動く初期値に行き着きます。`normal` か `no-autospace` と書けば、どのエンジンでもどの版でも同じ結果になります。

日本語のページの多くは、すでに漢字とラテン文字のあいだに半角スペースを入力しています。`text-autospace: normal` はそれを消さないので、両方が見えます。自動の空きに置き換えるのは `replace` です。どの値が正しいかは文章の書き方によるので、このルールは「選んでください」と求めるだけです。

## 報告する内容

日本語の文字列に見える宣言だけを調べます（他のルールと同じ判定です）。`:lang(ja)` / `[lang="ja"]` のセレクター、同じブロックか外側のブロックで先頭に日本語フォントを指定した `font-family` / `font`、または `assumeJapanese: true` です。

- `text-autospace: initial` と `text-autospace: revert`。
- `requireOnRoot: true` のとき：`html`・`body`・`:root`・`*`・`:lang(ja)`・`[lang|="ja"]` に対する日本語のルール（例：`html:lang(ja) { font-family: "Noto Sans JP"; }`）があり、そのようなルートのルールのどれも `text-autospace` を設定していない場合。1ファイルにつき1回、最初の日本語のルートのルールに対して報告します。

`inherit` と `unset` は親に従うので対象外です。変数と具体的な値（`normal`・`no-autospace`・`ideograph-alpha`・`auto` など）も対象外です。

ブラウザー対応：`normal` と `no-autospace` の `text-autospace` は Chrome 140・Firefox 145・Safari 18.4 にあります。`auto`・`ideograph-alpha`・`ideograph-numeric`・`insert` は Firefox 145 だけです（MDN browser-compat-data 8.1.11）。

## オプション

### `true`

次のパターンは問題として報告されます。

```css
:lang(ja) p { text-autospace: initial; }
```

```css
[lang="ja"] .note { text-autospace: revert; }
```

次のパターンは問題になりません。

```css
:lang(ja) p { text-autospace: normal; }
```

```css
:lang(ja) p { text-autospace: no-autospace; }
```

```css
p { text-autospace: initial; } /* 日本語の文字列ではない */
```

### `assumeJapanese: true`

すべての宣言を日本語の文字列として扱います（日本語のページだけで使うスタイルシート向け）。

### `requireOnRoot: true`

スタイルシートがルートで日本語の設定をしているときは、ルートのルールに `text-autospace` の値も求めます。

```css
/* 問題：日本語のルートなのに、ルートのルールのどこにも text-autospace がない */
html:lang(ja) { font-family: "Noto Sans JP", sans-serif; }
```

```css
/* OK */
html:lang(ja) { font-family: "Noto Sans JP", sans-serif; text-autospace: normal; }
```

基本の組版を書いたスタイルシートに使ってください。ルートに触れないコンポーネント用のスタイルシートは、どちらの場合も報告されません。

### `ignoreSelectors: ["/regex/", "string"]`

対象外にするセレクター（セレクター全体と照合します）。

```json
{ "ja-typography/text-autospace-initial-value": [true, { "ignoreSelectors": ["/\\.reset$/"] }] }
```

## 自動修正

修正はできません。空きを入れるべきかは文章の書き方によるため（上記）、ルールは値を選びません。
