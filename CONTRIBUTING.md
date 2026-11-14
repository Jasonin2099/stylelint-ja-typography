# Contributing

Thanks for helping. Issues and pull requests in English or Japanese are both fine.
日本語でも英語でも、Issue やプルリクエストを歓迎します。

## Setup

```sh
npm ci
npm test
```

Tests use Node's built-in test runner and the public `stylelint.lint()` API. `test/helpers.js` provides a small `testRule()` helper (accept / reject / fixed cases).

## Adding a rule

1. **Check the facts first.** Find the spec text (CSS Text, CSS Fonts, CSS Writing Modes, JLREQ) or browser-compat-data entry that backs the rule. If the behaviour is browser-specific, say so in the docs.
2. Check that Stylelint core or a popular plugin does not already cover it.
3. Add `src/rules/<rule-name>.js` (use an existing rule as a template), register it in `src/index.js`, and add it to `src/configs/recommended.js` only if almost every report is a real mistake.
4. Add `test/<rule-name>.test.js` with accept and reject cases, including the edge cases you thought about. Autofix rules must test the `fixed` output.
5. Add `docs/rules/<rule-name>.md` and `docs/rules/<rule-name>.ja.md` with: what is reported, why (with links), examples, options, and autofix behaviour.
6. Add the rule to the tables in both READMEs and tick it in `ROADMAP.md`.

`test/recommended.test.js` fails if a rule is missing from the index, the recommended config or either docs page.

## Autofix

Only fix when the result is equivalent or clearly what the author meant. When in doubt, report without fixing.

## Commit messages

Short imperative subject, a body that explains *why*. One rule per pull request.
