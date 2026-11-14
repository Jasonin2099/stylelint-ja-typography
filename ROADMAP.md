# Roadmap

Each item is meant to be one self-contained change (rule or improvement + tests + EN/JA docs). Before adding a rule, check the cited spec text and browser-compat-data, and note in the docs when a behaviour is browser-specific.

## 0.1.0 (done)

- [x] `no-palt-on-body-text`
- [x] `palt-vpal-match-writing-mode` (autofix)
- [x] `no-synthetic-italic`
- [x] `keep-all-needs-overflow-wrap`
- [x] `no-line-break-anywhere`
- [x] `prefer-font-variant-east-asian` (autofix)
- [x] `no-obsolete-writing-mode` (autofix)
- [x] `text-combine-upright-supported` (autofix)
- [x] `recommended` config

## Next rules

- [ ] `font-feature-settings-keep-inherited`: a child rule that sets `font-feature-settings` without `palt` silently drops an inherited `palt` (no merging in CSS Fonts 4). Report when the stylesheet enables `palt` on an ancestor-like selector and a descendant overrides the list.
- [ ] `prefer-font-kerning`: `"kern"` / `"vkrn"` in `font-feature-settings` → `font-kerning: normal` (CSS Fonts 4 replacement table). Autofix when they are the only features.
- [ ] `no-letter-spacing-on-body-text` (opt-in, not recommended): wide `letter-spacing` on Japanese running text breaks the em grid; allow on headings. Needs a sensible threshold option.
- [ ] `text-emphasis-needs-position`: `text-emphasis` in horizontal Japanese should usually be `over right`; check `text-emphasis-position` for `:lang(ja)` rules and vertical modes.
- [ ] `ruby-position-vertical`: `ruby-position: under` in vertical Japanese puts ruby on the left; flag unless intended.
- [ ] `no-text-orientation-upright-for-latin` (opt-in): `text-orientation: upright` on whole vertical paragraphs stacks Latin words letter by letter; suggest `mixed` plus `text-combine-upright` for short runs.
- [ ] `text-spacing-trim-value`: validate values against CSS Text 4 (`normal`, `space-all`, `space-first`, `trim-start`, …) and warn about values only in older drafts.
- [ ] `text-autospace-initial-value`: browsers currently ship `no-autospace` as the initial value (browser-compat-data notes); document and optionally require an explicit value on `:lang(ja)` roots.
- [ ] `word-break-auto-phrase-fallback`: `word-break: auto-phrase` is Chromium-only and Japanese-only; suggest `keep-all` + `overflow-wrap: anywhere` as the base and `@supports` for the enhancement.
- [ ] `no-break-all-on-mixed-text` (opt-in): `word-break: break-all` splits Latin words in mixed text; CSS Text 3 notes it is meant for mostly-CJK text, so make it configurable rather than recommended.
- [ ] `vertical-needs-text-orientation-mixed`: report `text-orientation: sideways-right` (obsolete alias of `sideways`) with autofix.
- [ ] `no-ms-ime-mode`: `ime-mode` is deprecated; Stylelint core may already cover it via `property-no-deprecated`; verify first and document instead if so.
- [ ] `font-family-japanese-localized-name`: families written only with their Japanese name (`"游ゴシック"`) or only with their English name; check how browsers match localized names and decide whether pairing both is needed.
- [ ] `yu-gothic-weight`: Yu Gothic Regular renders thin on Windows; suggest `"Yu Gothic Medium"` before `"Yu Gothic"` or `font-weight: 500`. Research current Windows 11 behaviour before shipping.
- [ ] `no-ms-gothic-first` (opt-in): bitmap-hinted MS Gothic/Mincho listed first.
- [ ] `hanging-punctuation-support`: `hanging-punctuation` is Safari-only; inform rather than fail.
- [ ] `line-height-japanese-minimum` (opt-in): body `line-height` below ~1.5 for Japanese paragraphs (JLREQ line-gap guidance); configurable threshold.
- [ ] `text-justify-inter-character`: `text-align: justify` on Japanese without `text-justify`; check current browser support (Firefox 55+, Chrome 145+) before recommending anything.
- [ ] `no-legacy-ruby-overhang`: `ruby-overhang` / `ruby-span` / `ruby-merge` support check against browser-compat-data.

## Infrastructure

- [ ] Fixture-based tests: run every rule against a small corpus of real-world Japanese CSS snippets to catch false positives.
- [ ] `assumeJapanese` as a shared setting (one place instead of per-rule options).
- [ ] Support `:lang(ja-JP)` / `:lang("ja")` / `[lang="ja-JP"]` variants in a shared test table.
- [ ] TypeScript type declarations (`index.d.ts`) for the plugin and options.
- [ ] Docs site generated from `docs/rules` with side-by-side rendered examples.
- [ ] Check docs links in CI.
- [ ] Release workflow (npm provenance) — only after the first release is approved.
- [ ] Test against the next Stylelint major in a scheduled CI job.

## Docs

- [ ] Japanese-first guide: “CSS for Japanese text checklist” linking each rule.
- [ ] Screenshots of before/after for `palt`, synthetic italic, `keep-all` overflow and tate-chu-yoko.
- [ ] Migration notes for sites moving from IE-era vertical text CSS.
