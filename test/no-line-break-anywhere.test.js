import { testRule } from './helpers.js';

testRule({
  ruleName: 'ja-typography/no-line-break-anywhere',
  config: true,
  accept: [
    { code: 'p { line-break: strict; }' },
    { code: 'p { line-break: loose; }' },
    { code: 'p { line-break: normal; }' },
    { code: 'p { overflow-wrap: anywhere; }' },
  ],
  reject: [
    {
      code: 'p { line-break: anywhere; }',
      message:
        'Unexpected "line-break: anywhere". It ignores all line-breaking prohibitions (禁則処理), so 。、」 can start a line; use "loose", "normal" or "strict", and "overflow-wrap: anywhere" for long URLs. (ja-typography/no-line-break-anywhere)',
    },
    { code: 'p { -webkit-line-break: anywhere; }' },
    { code: 'p { line-break: ANYWHERE !important; }' },
  ],
});

testRule({
  ruleName: 'ja-typography/no-line-break-anywhere',
  config: [true, { ignoreSelectors: ['pre code'] }],
  accept: [{ code: 'pre code { line-break: anywhere; }' }],
  reject: [{ code: 'code { line-break: anywhere; }' }],
});
