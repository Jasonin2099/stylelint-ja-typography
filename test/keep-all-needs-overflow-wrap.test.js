import { testRule } from './helpers.js';

testRule({
  ruleName: 'ja-typography/keep-all-needs-overflow-wrap',
  config: true,
  accept: [
    { code: 'h1 { word-break: keep-all; overflow-wrap: anywhere; }' },
    { code: 'h1 { overflow-wrap: break-word; word-break: keep-all; }' },
    { code: 'h1 { word-break: keep-all; word-wrap: break-word; }', description: 'legacy alias' },
    { code: 'h1 { word-break: normal; }' },
    { code: 'h1 { word-break: auto-phrase; }' },
  ],
  reject: [
    {
      code: 'h1 { word-break: keep-all; }',
      message:
        'Expected "overflow-wrap: anywhere" (or "break-word") next to "word-break: keep-all". Japanese has no spaces, so keep-all makes whole sentences unbreakable and they overflow narrow screens. (ja-typography/keep-all-needs-overflow-wrap)',
    },
    { code: 'h1 { word-break: keep-all; overflow-wrap: normal; }' },
    { code: 'h1 { overflow-wrap: anywhere; word-break: keep-all; overflow-wrap: normal; }' },
    { code: 'h1 { word-break: KEEP-ALL !important; }' },
  ],
});

testRule({
  ruleName: 'ja-typography/keep-all-needs-overflow-wrap',
  config: [true, { ignoreSelectors: ['/^\\.ko/'] }],
  accept: [{ code: '.ko-text { word-break: keep-all; }' }],
  reject: [{ code: '.ja-text { word-break: keep-all; }' }],
});
