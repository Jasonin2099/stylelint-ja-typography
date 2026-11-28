# ja-typography/text-autospace-initial-value

[日本語](./text-autospace-initial-value.ja.md)

Report `text-autospace: initial` / `revert`, which depend on the initial value of `text-autospace`, and (with `requireOnRoot`) stylesheets that set up Japanese text on the root but never choose a `text-autospace` value. Opt-in: not in `recommended`.

```css
:lang(ja) p {
  text-autospace: initial;
  /**             ↑
   * "normal" in the spec, "no-autospace" in every browser */
}
```

## Why

`text-autospace` adds a small space (1/8 of the CJK advance, 0.125ic) between kanji and adjoining Latin letters or digits, so that `日本語ABC123` is not set tight ([CSS Text 4 § 8.4](https://drafts.csswg.org/css-text-4/#text-autospace-property)).

The spec and the browsers disagree about the initial value:

- The CSS Text 4 Working Draft (14 August 2026) gives it as `normal`, which is `ideograph-alpha ideograph-numeric`: the space is on by default. The CSS Working Group [resolved on 10 December 2025](https://github.com/w3c/csswg-drafts/issues/12386) to keep `normal` as the initial value.
- Chrome 140, Firefox 145 and Safari 18.4 (and the browsers built on them) ship `no-autospace`: the space is off by default. MDN browser-compat-data notes this for every engine; Firefox developers say in the same issue that they ship `no-autospace` for compatibility with the other browsers and would like all engines to follow the spec.

So a page that says nothing gets no spacing today, but the spec says it should, and the default may change. A reset such as `text-autospace: initial` (or `revert`, since the user-agent sheet does not set the property) lands on that moving value. Writing `normal` or `no-autospace` gives the same result in every engine and every version.

Most Japanese pages already type an ASCII space between kanji and Latin text. `text-autospace: normal` does not remove it, so you would see both; `replace` swaps it for the automatic space. That is why the right value depends on how the text is written, and why this rule only asks you to choose.

## What is reported

Only declarations that look like Japanese text are checked (the same detection as the other rules): a `:lang(ja)` / `[lang="ja"]` selector, a Japanese font first in `font-family` / `font` on the same or an enclosing block, or `assumeJapanese: true`.

- `text-autospace: initial` and `text-autospace: revert`.
- With `requireOnRoot: true`: when a Japanese rule for `html`, `body`, `:root`, `*`, `:lang(ja)` or `[lang|="ja"]` exists (for example `html:lang(ja) { font-family: "Noto Sans JP"; }`) and no such root rule sets `text-autospace`. Reported once per file, on the first Japanese root rule.

`inherit` and `unset` follow the parent, so they are left alone, as are variables and every concrete value (`normal`, `no-autospace`, `ideograph-alpha`, `auto` …).

Browser support: `text-autospace` with `normal` and `no-autospace` is in Chrome 140, Firefox 145 and Safari 18.4; `auto`, `ideograph-alpha`, `ideograph-numeric` and `insert` are in Firefox 145 only (MDN browser-compat-data 8.1.11).

## Options

### `true`

The following patterns are considered problems:

```css
:lang(ja) p { text-autospace: initial; }
```

```css
[lang="ja"] .note { text-autospace: revert; }
```

The following patterns are *not* considered problems:

```css
:lang(ja) p { text-autospace: normal; }
```

```css
:lang(ja) p { text-autospace: no-autospace; }
```

```css
p { text-autospace: initial; } /* not Japanese text */
```

### `assumeJapanese: true`

Treat every declaration as Japanese text (for stylesheets used only on Japanese pages).

### `requireOnRoot: true`

Also require a `text-autospace` value on a root rule when the stylesheet sets up Japanese text there:

```css
/* problem: Japanese root, no text-autospace anywhere on a root rule */
html:lang(ja) { font-family: "Noto Sans JP", sans-serif; }
```

```css
/* ok */
html:lang(ja) { font-family: "Noto Sans JP", sans-serif; text-autospace: normal; }
```

Use it on the stylesheet that holds your base typography. A component stylesheet that never touches the root will not be reported either way.

### `ignoreSelectors: ["/regex/", "string"]`

Selectors to skip (matched against the whole selector):

```json
{ "ja-typography/text-autospace-initial-value": [true, { "ignoreSelectors": ["/\\.reset$/"] }] }
```

## Autofix

Not fixable: whether the space should be on depends on how the text is written (see above), so the rule does not pick a value.
