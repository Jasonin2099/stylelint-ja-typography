# ja-typography/font-feature-settings-keep-inherited

[English](./font-feature-settings-keep-inherited.md)

祖先に当たるルールで指定した `palt` などの日本語向け OpenType 機能を、子孫の `font-feature-settings`（または `font` 一括指定）が黙って打ち消している箇所を報告します。

```css
.headline { font-feature-settings: "palt"; }
.headline .date { font-feature-settings: "tnum"; }
/**                                     ↑
 * 日付から "palt" が外れる。このリストが .headline のリストを置き換えるため */
```

## 理由

`font-feature-settings` はマージされません。CSS Fonts 4 には「プロパティの値全体が一度に設定される。font-variant 系プロパティと違い、継承された値に個々の機能を追加・削除する方法はない」とあります（[CSS Fonts 4, 6.12 `font-feature-settings`](https://drafts.csswg.org/css-fonts-4/#font-feature-settings-prop)）。そのため、等幅数字（`tnum`）だけを足したつもりの子要素では、継承していたプロポーショナル詰め（`palt`）も切れ、その部分だけ字間が開いて見えます。

`font` 一括指定も同じです。`font-feature-settings` は `font` の「暗黙にリセットされる」サブプロパティなので、`font: 1em/1.8 serif` で `normal` に戻ります（[CSS Fonts 4, 2.7 `font`](https://drafts.csswg.org/css-fonts-4/#font-prop)）。

`font-variant-*` 系（例：`"tnum"` の代わりに `font-variant-numeric: tabular-nums`）は個別にカスケードするので、この問題は起きません。対応するプロパティがあればそちらを使ってください（[`prefer-font-variant-east-asian`](./prefer-font-variant-east-asian.ja.md) も参照）。`palt`・`vpal`・`halt`・`pkna` には `font-variant` 版がありません。

## 検査内容

フォント機能の最後の指定が `font-feature-settings` のリストまたは `font` 一括指定であるルールごとに、最も近い「提供元」（監視対象の機能をオン／オフしている別のルール）を探し、提供元が指定していて、このリストに（オンでもオフでも）書かれていない機能を報告します。

1. 外側のルール（CSS ネスト）。なければ
2. このセレクタが下に位置する、最も長いセレクタのルール：子孫（`.a .b`、`.a > .b`）、または条件を足した同じ要素（`.a:hover`、`.a.is-active`、`.a::before`）。`.a + .b`、`.a ~ .b`、`.a-b` は対象外。検査対象のルールが入っていないアットルール（`@media`、`@supports`、`@layer`）の中の提供元も対象外。なければ
3. ルート相当のルール（`html`、`:root`、`body`、`*`）。ルート相当どうしは検査しません。

セレクタは書かれた文字列で比べます。HTML は見ないので、提供元を見落とすことはあっても、存在しない提供元をでっち上げることはありません。`font-feature-settings: normal` / `initial`、`font: inherit`、変数を含む値は対象外で、`-webkit-font-feature-settings` は読みません。同じブロック内で `font-feature-settings` の後に `font` 一括指定がある場合は、コアルール [`declaration-block-no-shorthand-property-overrides`](https://stylelint.io/user-guide/rules/declaration-block-no-shorthand-property-overrides/) がすでに報告します。

既定の監視対象：`palt`、`vpal`、`halt`、`vhal`、`pkna`、`hkna`、`vkna`、`pwid`、`fwid`、`hwid`、`twid`、`qwid`、`jp78`、`jp83`、`jp90`、`jp04`、`nlck`、`expt`、`trad`、`hojo`、`ruby`、`vert`、`vrt2`、`ital`（`kern` は [`prefer-font-kerning`](./prefer-font-kerning.ja.md) に任せます）。

## オプション

### `true`

以下は問題として報告されます：

```css
.headline { font-feature-settings: "palt"; }
.headline .date { font-feature-settings: "tnum"; }
```

```css
.btn { font-feature-settings: "palt"; }
.btn:hover { font-feature-settings: "ss01"; }
```

```css
.tate { font-feature-settings: "vpal"; }
.tate .note { font: 0.8em/1.6 serif; }
```

以下は問題として*報告されません*：

```css
.headline { font-feature-settings: "palt"; }
.headline .date { font-feature-settings: "palt", "tnum"; }
```

```css
/* 意図してオフにしている */
.headline { font-feature-settings: "palt"; }
.headline code { font-feature-settings: "palt" 0, "zero"; }
```

```css
.headline { font-feature-settings: "palt"; }
.headline .date { font-variant-numeric: tabular-nums; }
```

### `features: ["palt", "liga", …]`

監視する機能の一覧を置き換えます（OpenType タグ。書かれたとおりに比較）。

### `ignoreSelectors: ["/regex/", "string"]`

検査しない*上書き側*のルールのセレクタ。

## 自動修正

なし。提供元はセレクタの文字列で探すため実際の文書とずれることがあり、直し方（機能を書き足す、オフにする、`font-variant-*` に切り替える）も意図によって変わるためです。
