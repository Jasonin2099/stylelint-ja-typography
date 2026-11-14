import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import stylelint from 'stylelint';

import plugins from '../src/index.js';

/**
 * Minimal port of jest-preset-stylelint's testRule() for node:test.
 * accept: [{ code, description }]
 * reject: [{ code, message?, warnings?, fixed?, description? }]
 */
export function testRule({ ruleName, config, accept = [], reject = [], fix = false }) {
  const lintConfig = { plugins, rules: { [ruleName]: config } };

  describe(`${ruleName} ${JSON.stringify(config)}`, () => {
    for (const c of accept) {
      it(`accepts: ${c.description ?? c.code}`, async () => {
        const { results } = await stylelint.lint({ code: c.code, config: lintConfig });
        const [r] = results;
        assert.deepEqual(r.invalidOptionWarnings, []);
        assert.deepEqual(r.warnings.map((w) => w.text), []);
      });
    }
    for (const c of reject) {
      it(`rejects: ${c.description ?? c.code}`, async () => {
        const { results } = await stylelint.lint({ code: c.code, config: lintConfig });
        const [r] = results;
        assert.deepEqual(r.invalidOptionWarnings, []);
        const count = c.warnings ?? 1;
        assert.equal(r.warnings.length, count, r.warnings.map((w) => w.text).join('\n'));
        for (const w of r.warnings) assert.equal(w.rule, ruleName);
        if (c.message) assert.equal(r.warnings[0].text, c.message);
        if (fix) {
          const out = await stylelint.lint({ code: c.code, config: lintConfig, fix: true });
          assert.equal(out.code, c.fixed ?? c.code);
        }
      });
    }
  });
}
