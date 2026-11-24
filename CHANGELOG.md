# Changelog

## Unreleased (0.1.0)

- `text-emphasis-position-japanese`: report `text-emphasis-position: under` / `left` on Japanese text, and Japanese emphasis that inherits them from `html` / `:root` / `body` / `*` (JLREQ puts 圏点 above horizontal and right of vertical text).
- `ruby-position-vertical`: report `ruby-position: under` / `-webkit-ruby-position: after` in vertical text (ruby on the left; JLREQ puts it on the right).
- `prefer-font-kerning`: use `font-kerning` instead of `"kern"` / `"vkrn"` in `font-feature-settings` (autofix when they are the only features).
- First set of rules: `keep-all-needs-overflow-wrap`, `no-line-break-anywhere`, `no-obsolete-writing-mode`, `no-palt-on-body-text`, `no-synthetic-italic`, `palt-vpal-match-writing-mode`, `prefer-font-variant-east-asian`, `text-combine-upright-supported`.
- `recommended` config.
