# stylelint-ja-typography

[日本語](./README.ja.md)

[![CI](https://github.com/Jasonin2099/stylelint-ja-typography/actions/workflows/ci.yml/badge.svg)](https://github.com/Jasonin2099/stylelint-ja-typography/actions/workflows/ci.yml)

[Stylelint](https://stylelint.io/) rules that catch common mistakes in CSS for **Japanese** text: proportional metrics on body copy, skewed “italic” kanji, `keep-all` overflow, kinsoku-breaking `line-break: anywhere`, obsolete `tb-rl` vertical text, and more.

Every rule links to the CSS specification or JLREQ text it is based on. Several rules can fix the problem for you.

## Install

```sh
npm install --save-dev stylelint stylelint-ja-typography
```

Requires Node.js 22+ and Stylelint 16.17+, 17 or 18.

> Not on npm yet. Until the first release, install from GitHub:
> `npm install --save-dev github:Jasonin2099/stylelint-ja-typography`

## Usage

Use the recommended config:

```json
{
  "extends": ["stylelint-ja-typography/recommended"]
}
```

Or pick rules yourself:

```json
{
  "plugins": ["stylelint-ja-typography"],
  "rules": {
    "ja-typography/no-palt-on-body-text": true,
    "ja-typography/no-synthetic-italic": [true, { "assumeJapanese": true }]
  }
}
```

## Rules

🔧 = fixable with `stylelint --fix`. ✅ = enabled in `recommended`.

| Rule | Description | |
| --- | --- | --- |
| [font-feature-settings-keep-inherited](docs/rules/font-feature-settings-keep-inherited.md) | Report `font-feature-settings` lists (or `font` shorthands) that drop an inherited `palt` / `vpal` …, since the property is not merged | ✅ |
| [keep-all-needs-overflow-wrap](docs/rules/keep-all-needs-overflow-wrap.md) | `word-break: keep-all` must come with `overflow-wrap: anywhere` so unspaced Japanese can still wrap | ✅ |
| [no-line-break-anywhere](docs/rules/no-line-break-anywhere.md) | Disallow `line-break: anywhere`, which turns off kinsoku (禁則処理) | ✅ |
| [no-obsolete-writing-mode](docs/rules/no-obsolete-writing-mode.md) | Replace `tb-rl`, `lr-tb` and other SVG 1.1 values with `vertical-rl` / `horizontal-tb` | ✅ 🔧 |
| [no-palt-on-body-text](docs/rules/no-palt-on-body-text.md) | Disallow `palt`/`pkna` on body text; Japanese running text is set solid (ベタ組み) | ✅ |
| [no-synthetic-italic](docs/rules/no-synthetic-italic.md) | Disallow italic/oblique on Japanese text, which the browser fakes by skewing glyphs | ✅ |
| [palt-vpal-match-writing-mode](docs/rules/palt-vpal-match-writing-mode.md) | Use `vpal`/`vhal` in vertical text and `palt`/`halt` in horizontal text | ✅ 🔧 |
| [prefer-font-kerning](docs/rules/prefer-font-kerning.md) | Use `font-kerning` instead of `"kern"` / `"vkrn"` in `font-feature-settings` | ✅ 🔧 |
| [prefer-font-variant-east-asian](docs/rules/prefer-font-variant-east-asian.md) | Use `font-variant-east-asian` instead of `"pwid"`, `"jp78"`, `"ruby"` … in `font-feature-settings` | ✅ 🔧 |
| [ruby-position-vertical](docs/rules/ruby-position-vertical.md) | Disallow `ruby-position: under` in vertical text, where it puts ruby on the left of the base characters | ✅ |
| [text-combine-upright-supported](docs/rules/text-combine-upright-supported.md) | Report unsupported `text-combine-upright: digits` and legacy `-webkit-text-combine` | ✅ 🔧 |
| [text-emphasis-position-japanese](docs/rules/text-emphasis-position-japanese.md) | Disallow `text-emphasis-position: under` / `left` on Japanese text, which puts emphasis marks (圏点) below or on the left | ✅ |
| [text-spacing-trim-value](docs/rules/text-spacing-trim-value.md) | Report `text-spacing-trim` values browsers drop: not yet implemented (`trim-both`, `trim-all`, `auto`) without a fallback, Editor's-Draft-only per-position keywords, removed or misplaced values | ✅ |

## Stylelint core rules worth enabling

Some old Japanese-text CSS is already caught by Stylelint itself, so this plugin does not duplicate it. Both rules below are on in `stylelint-config-recommended` 19 (and so in `stylelint-config-standard` 41). If you do not extend either, turn them on next to this plugin's `recommended`:

| Core rule | Catches |
| --- | --- |
| `declaration-property-value-keyword-no-deprecated` | `text-orientation: sideways-right` (→ `sideways`), `text-justify: distribute` (→ `inter-character`), `word-break: break-word` |
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

## How “Japanese text” is detected

CSS does not know the language of the page. Rules that only make sense for Japanese text (such as `no-synthetic-italic`) treat a declaration as Japanese when:

- its selector uses `:lang(ja)` or a `[lang=ja]` attribute selector, or
- the same block (or an enclosing nested block) sets a Japanese font first in `font-family` / `font`, or
- the rule's `assumeJapanese` option is `true`.

Adding `:lang(ja)` to your Japanese-specific selectors is good practice anyway: browsers also use the language for font selection and line breaking.

## Related projects

This plugin **checks** CSS. It does not ship styles. It is meant to sit next to projects that give you good defaults:

- [jp-typeset](https://github.com/P4suta/jp-typeset): CSS presets for Japanese typography. Use it for the styles, use this plugin to keep later overrides from undoing them.
- [kiso.css](https://github.com/tak-dcxi/kiso.css): a reset CSS designed with Japanese sites in mind.
- [BudouX](https://github.com/google/budoux): phrase-based line breaking for Japanese. Pairs with `word-break: keep-all`; see [keep-all-needs-overflow-wrap](docs/rules/keep-all-needs-overflow-wrap.md).
- [YakuHanJP](https://github.com/qrac/yakuhanjp): fonts with half-width punctuation (約物半角). An alternative to `palt` when you only want punctuation tightened.
- [mojikumi](https://github.com/houkanshan/mojikumi): punctuation compression (約物の詰め) via OpenType kerning.
- [textlint](https://textlint.github.io/) with Japanese rule presets: lints the *text* itself, which this plugin does not do.

## Contributing

Ideas and rule proposals are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [ROADMAP](ROADMAP.md) for planned rules.

## License

[MIT](LICENSE)
