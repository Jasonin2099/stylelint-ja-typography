import { testRule } from './helpers.js';

const R = 'ja-typography/text-autospace-initial-value';

testRule({
  ruleName: R,
  config: true,
  accept: [
    { code: ':lang(ja) p { text-autospace: normal; }' },
    { code: ':lang(ja) p { text-autospace: no-autospace; }' },
    { code: ':lang(ja) p { text-autospace: ideograph-alpha replace; }' },
    { code: ':lang(ja) p { text-autospace: inherit; }' },
    { code: ':lang(ja) p { text-autospace: unset; }', description: 'unset follows the parent for an inherited property' },
    { code: ':lang(ja) p { text-autospace: var(--autospace); }' },
    { code: 'p { text-autospace: initial; }', description: 'not Japanese text' },
    { code: 'p { text-spacing-trim: initial; }', description: 'other properties are ignored' },
    { code: ':lang(ja) p { font-feature-settings: initial; }' },
    {
      code: 'html:lang(ja) { font-family: "Noto Sans JP"; }',
      description: 'requireOnRoot is off by default',
    },
  ],
  reject: [
    {
      code: ':lang(ja) p { text-autospace: initial; }',
      message:
        '"text-autospace: initial" falls back to the initial value. CSS Text 4 gives text-autospace the initial value "normal" (space between kanji and Latin letters or digits), but Chrome 140+, Firefox 145+ and Safari 18.4+ all ship "no-autospace" (no space), so this gives different results by browser and may change later. Write "normal" or "no-autospace". (ja-typography/text-autospace-initial-value)',
    },
    { code: ':lang(ja) p { text-autospace: INITIAL !important; }' },
    { code: '[lang="ja"] p { text-autospace: revert; }' },
    { code: 'p { font-family: "Hiragino Sans"; text-autospace: initial; }', description: 'Japanese font in the block' },
    {
      code: '@media print { :lang(ja) p { text-autospace: initial; } }',
      description: 'inside an at-rule',
    },
  ],
});

testRule({
  ruleName: R,
  config: [true, { assumeJapanese: true }],
  accept: [{ code: 'p { text-autospace: normal; }' }],
  reject: [{ code: 'p { text-autospace: initial; }' }],
});

testRule({
  ruleName: R,
  config: [true, { ignoreSelectors: ['/\\.reset$/'] }],
  accept: [{ code: ':lang(ja) .reset { text-autospace: initial; }' }],
  reject: [{ code: ':lang(ja) .other { text-autospace: initial; }' }],
});

testRule({
  ruleName: R,
  config: [true, { requireOnRoot: true }],
  accept: [
    { code: 'html:lang(ja) { font-family: "Noto Sans JP"; text-autospace: normal; }' },
    { code: ':root { text-autospace: no-autospace; } :lang(ja) p { margin: 0; }' },
    { code: 'body { font-family: "Yu Gothic"; } html { text-autospace: normal; }', description: 'set on another root rule' },
    { code: 'p { margin: 0; }', description: 'no Japanese root rule' },
    { code: '.hero:lang(ja) { color: red; }', description: 'not a root selector' },
    { code: 'html { font-family: Arial; }', description: 'root is not Japanese' },
  ],
  reject: [
    {
      code: 'html:lang(ja) { font-family: "Noto Sans JP"; }',
      message:
        'This stylesheet sets Japanese text up on the root but never sets text-autospace. CSS Text 4 gives text-autospace the initial value "normal" (space between kanji and Latin letters or digits), but Chrome 140+, Firefox 145+ and Safari 18.4+ all ship "no-autospace" (no space). Set "normal" or "no-autospace" on the root so the result is the same everywhere. (ja-typography/text-autospace-initial-value)',
    },
    { code: ':lang(ja) { line-height: 1.8; }' },
    { code: 'body { font-family: "Hiragino Sans", sans-serif; }' },
    { code: 'html:lang(ja) { color: #222; } :lang(ja) p { text-autospace: normal; }', description: 'only set on a non-root rule' },
    {
      code: 'html:lang(ja) { color: #222; } body:lang(ja) { margin: 0; }',
      warnings: 1,
      description: 'reported once per file',
    },
    {
      code: ':lang(ja) p { text-autospace: initial; } html:lang(ja) { color: #222; }',
      warnings: 2,
      description: 'both parts',
    },
  ],
});
