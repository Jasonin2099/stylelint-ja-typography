import assert from 'node:assert/strict';
import { test } from 'node:test';

import plugins from '../src/index.js';

test('plugin entry exports an array of plugins', () => {
  assert.ok(Array.isArray(plugins));
  for (const p of plugins) {
    assert.match(p.ruleName, /^ja-typography\//);
    assert.equal(typeof p.rule, 'function');
  }
});
