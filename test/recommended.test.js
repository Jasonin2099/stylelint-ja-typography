import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';

import plugins from '../src/index.js';
import recommended from '../src/configs/recommended.js';

const RECOMMENDED = fileURLToPath(new URL('../src/configs/recommended.js', import.meta.url));
// Rules that are documented and exported but deliberately left out of `recommended`.
const OPT_IN = new Set(['text-autospace-initial-value']);
const ruleFiles = readdirSync(new URL('../src/rules/', import.meta.url)).map((f) => f.replace(/\.js$/, ''));

test('every rule is exported, documented in both languages and enabled in recommended (except opt-in rules)', () => {
  const names = plugins.map((p) => p.ruleName.replace('ja-typography/', '')).sort();
  assert.deepEqual(names, ruleFiles.sort());
  const docs = readdirSync(new URL('../docs/rules/', import.meta.url));
  for (const name of names) {
    assert.ok(docs.includes(`${name}.md`), `${name}.md`);
    assert.ok(docs.includes(`${name}.ja.md`), `${name}.ja.md`);
    assert.equal(recommended.rules[`ja-typography/${name}`], OPT_IN.has(name) ? undefined : true, name);
  }
});

test('every rule exposes meta.url pointing at its docs', () => {
  for (const p of plugins) {
    const name = p.ruleName.replace('ja-typography/', '');
    assert.match(p.rule.meta.url, new RegExp(`/docs/rules/${name}\\.md$`));
  }
});

test('recommended config works through extends', async () => {
  const code = `
body { font-feature-settings: "palt"; }
.v { writing-mode: tb-rl; font-feature-settings: "palt"; }
h1 { word-break: keep-all; }
:lang(ja) em { font-style: italic; }
`;
  const { results } = await stylelint.lint({
    code,
    config: { extends: [RECOMMENDED] },
  });
  const rules = results[0].warnings.map((w) => w.rule).sort();
  assert.deepEqual(rules, [
    'ja-typography/keep-all-needs-overflow-wrap',
    'ja-typography/no-obsolete-writing-mode',
    'ja-typography/no-palt-on-body-text',
    'ja-typography/no-synthetic-italic',
    'ja-typography/palt-vpal-match-writing-mode',
  ]);
});

test('recommended fixes are stable when applied together', async () => {
  const code = '.v { writing-mode: tb-rl; font-feature-settings: "palt", "pwid"; }';
  const config = { extends: [RECOMMENDED] };
  const fixed = await stylelint.lint({ code, config, fix: true });
  assert.equal(
    fixed.code,
    '.v { writing-mode: vertical-rl; font-feature-settings: "vpal"; font-variant-east-asian: proportional-width; }',
  );
  const again = await stylelint.lint({ code: fixed.code, config });
  assert.deepEqual(again.results[0].warnings, []);
});

test('package exports resolve', async () => {
  const main = await import('stylelint-ja-typography');
  const rec = await import('stylelint-ja-typography/recommended');
  assert.equal(main.default.length, plugins.length);
  assert.ok(rec.default.rules);
});
