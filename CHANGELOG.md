# Changelog

## Unreleased (0.1.0)

- `text-autospace-initial-value` (opt-in, not in `recommended`): report `text-autospace: initial` / `revert` on Japanese text, which end up on an initial value that CSS Text 4 (`normal`) and Chrome 140 / Firefox 145 / Safari 18.4 (`no-autospace`) disagree about; option `requireOnRoot` also asks a Japanese root rule to set a value.
- `text-spacing-trim-value`: report `text-spacing-trim` values that browsers drop — `trim-both` / `trim-all` / `auto` (in CSS Text 4, implemented nowhere yet) unless a supported value comes first or `@supports` guards them, the Editor's Draft per-position keywords (`trim-start allow-end`), and invalid values with hints (`none`, `no-compress` from the 2019 `text-spacing` draft; `text-autospace` keywords). Option `ignore: ["unsupported", "draft", "invalid"]`.
- `font-feature-settings-keep-inherited`: report a `font-feature-settings` list or `font` shorthand that drops a Japanese OpenType feature (`palt`, `vpal`, `pkna`, …) set on an enclosing, ancestor or root rule — the property is replaced, not merged (CSS Fonts 4 § 6.12).
- `text-emphasis-position-japanese`: report `text-emphasis-position: under` / `left` on Japanese text, and Japanese emphasis that inherits them from `html` / `:root` / `body` / `*` (JLREQ puts 圏点 above horizontal and right of vertical text).
- `ruby-position-vertical`: report `ruby-position: under` / `-webkit-ruby-position: after` in vertical text (ruby on the left; JLREQ puts it on the right).
- `prefer-font-kerning`: use `font-kerning` instead of `"kern"` / `"vkrn"` in `font-feature-settings` (autofix when they are the only features).
- First set of rules: `keep-all-needs-overflow-wrap`, `no-line-break-anywhere`, `no-obsolete-writing-mode`, `no-palt-on-body-text`, `no-synthetic-italic`, `palt-vpal-match-writing-mode`, `prefer-font-variant-east-asian`, `text-combine-upright-supported`.
- `recommended` config.
