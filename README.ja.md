# stylelint-ja-typography

[English](./README.md)

[![CI](https://github.com/Jasonin2099/stylelint-ja-typography/actions/workflows/ci.yml/badge.svg)](https://github.com/Jasonin2099/stylelint-ja-typography/actions/workflows/ci.yml)

**日本語**の文字組みに関する CSS のよくある間違いを見つける [Stylelint](https://stylelint.io/) のルール集です。本文への `palt`、漢字が傾く「斜体」、`keep-all` によるはみ出し、禁則処理が効かなくなる `line-break: anywhere`、古い `tb-rl` の縦書き指定などを検出します。

各ルールのドキュメントには、根拠となる CSS の仕様や JLREQ（日本語組版処理の要件）へのリンクがあります。自動修正に対応したルールもあります。

## インストール

```sh
npm install --save-dev stylelint stylelint-ja-typography
```

Node.js 22 以上と、Stylelint 16.17 以上・17・18 に対応しています。

> まだ npm には公開していません。最初のリリースまでは GitHub からインストールしてください。
> `npm install --save-dev github:Jasonin2099/stylelint-ja-typography`

## 使い方

推奨設定を使う場合：

```json
{
  "extends": ["stylelint-ja-typography/recommended"]
}
```

ルールを個別に選ぶ場合：

```json
{
  "plugins": ["stylelint-ja-typography"],
  "rules": {
    "ja-typography/no-palt-on-body-text": true,
    "ja-typography/no-synthetic-italic": [true, { "assumeJapanese": true }]
  }
}
```

## ルール一覧

🔧 = `stylelint --fix` で修正できる。✅ = `recommended` で有効。

| ルール | 内容 | |
| --- | --- | --- |
| [font-feature-settings-keep-inherited](docs/rules/font-feature-settings-keep-inherited.ja.md) | 継承した `palt` / `vpal` などを打ち消す `font-feature-settings`（または `font` 一括指定）を報告（このプロパティはマージされない） | ✅ |
| [keep-all-needs-overflow-wrap](docs/rules/keep-all-needs-overflow-wrap.ja.md) | `word-break: keep-all` には `overflow-wrap: anywhere` を付け、スペースのない日本語でも改行できるようにする | ✅ |
| [no-line-break-anywhere](docs/rules/no-line-break-anywhere.ja.md) | 禁則処理が効かなくなる `line-break: anywhere` を禁止 | ✅ |
| [no-obsolete-writing-mode](docs/rules/no-obsolete-writing-mode.ja.md) | `tb-rl`・`lr-tb` などの古い値を `vertical-rl`・`horizontal-tb` に置き換える | ✅ 🔧 |
| [no-palt-on-body-text](docs/rules/no-palt-on-body-text.ja.md) | 本文への `palt`・`pkna` を禁止（本文はベタ組みが原則） | ✅ |
| [no-synthetic-italic](docs/rules/no-synthetic-italic.ja.md) | 字形を傾けて合成される日本語の斜体を禁止 | ✅ |
| [palt-vpal-match-writing-mode](docs/rules/palt-vpal-match-writing-mode.ja.md) | 縦書きでは `vpal`・`vhal`、横書きでは `palt`・`halt` を使う | ✅ 🔧 |
| [prefer-font-kerning](docs/rules/prefer-font-kerning.ja.md) | `font-feature-settings` の `"kern"`・`"vkrn"` の代わりに `font-kerning` を使う | ✅ 🔧 |
| [prefer-font-variant-east-asian](docs/rules/prefer-font-variant-east-asian.ja.md) | `font-feature-settings` の `"pwid"`・`"jp78"`・`"ruby"` などの代わりに `font-variant-east-asian` を使う | ✅ 🔧 |
| [ruby-position-vertical](docs/rules/ruby-position-vertical.ja.md) | 縦書きでルビを親文字の左側に付けてしまう `ruby-position: under` を禁止 | ✅ |
| [text-combine-upright-supported](docs/rules/text-combine-upright-supported.ja.md) | 未対応の `text-combine-upright: digits` や古い `-webkit-text-combine` を報告 | ✅ 🔧 |
| [text-emphasis-position-japanese](docs/rules/text-emphasis-position-japanese.ja.md) | 日本語の圏点を下（横組）や左（縦組）に付けてしまう `text-emphasis-position: under` / `left` を禁止 | ✅ |

## あわせて有効にしたい Stylelint 本体のルール

日本語向けの古い CSS の一部は Stylelint 本体がすでに検出するので、このプラグインでは重ねて扱いません。下の2つは `stylelint-config-recommended` 19（したがって `stylelint-config-standard` 41）で有効になっています。どちらも使っていない場合は、このプラグインの `recommended` と並べて有効にしてください。

| 本体のルール | 検出するもの |
| --- | --- |
| `declaration-property-value-keyword-no-deprecated` | `text-orientation: sideways-right`（→ `sideways`）、`text-justify: distribute`（→ `inter-character`）、`word-break: break-word` |
| `property-no-deprecated` | `ime-mode` |

```json
{
  "extends": ["stylelint-ja-typography/recommended"],
  "rules": {
    "declaration-property-value-keyword-no-deprecated": true,
    "property-no-deprecated": true
  }
}
```

## 「日本語のテキスト」の判定

CSS だけではページの言語はわかりません。日本語にだけ当てはまるルール（`no-synthetic-italic` など）は、次のどれかに当てはまる宣言を日本語として扱います。

- セレクターに `:lang(ja)` か `[lang=ja]` などの属性セレクターがある
- 同じブロック（または入れ子の外側のブロック）で、`font-family`／`font` の最初のフォントが日本語フォント
- ルールの `assumeJapanese` オプションが `true`

日本語向けのセレクターに `:lang(ja)` を付けておくことは、それ自体よい習慣です。ブラウザーもフォントの選択や改行の判断に言語を使います。

## 関連プロジェクト

このプラグインは CSS を**検査する**だけで、スタイルは提供しません。よい初期値を提供する次のプロジェクトと組み合わせて使うことを想定しています。

- [jp-typeset](https://github.com/P4suta/jp-typeset)：日本語組版向けの CSS プリセット。スタイルはこちらで用意し、あとから書いた上書きでそれを崩していないかをこのプラグインで確認できます。
- [kiso.css](https://github.com/tak-dcxi/kiso.css)：日本のサイトを想定したリセット CSS。
- [BudouX](https://github.com/google/budoux)：日本語の文節改行。`word-break: keep-all` と組み合わせて使います（[keep-all-needs-overflow-wrap](docs/rules/keep-all-needs-overflow-wrap.ja.md) 参照）。
- [YakuHanJP](https://github.com/qrac/yakuhanjp)：約物を半角にしたフォント。約物だけを詰めたい場合の `palt` の代わりになります。
- [mojikumi](https://github.com/houkanshan/mojikumi)：OpenType のカーニングで約物を詰める実装。
- [textlint](https://textlint.github.io/) と日本語向けのルールプリセット：文章そのものを検査します。このプラグインは文章は検査しません。

## コントリビュート

アイデアやルールの提案を歓迎します。[CONTRIBUTING.md](CONTRIBUTING.md) と、予定しているルールをまとめた [ROADMAP](ROADMAP.md) をご覧ください。

## ライセンス

[MIT](LICENSE)
