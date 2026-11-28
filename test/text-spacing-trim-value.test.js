import { testRule } from './helpers.js';

const R = 'ja-typography/text-spacing-trim-value';

testRule({
  ruleName: R,
  config: true,
  accept: [
    { code: 'p { text-spacing-trim: normal; }' },
    { code: 'p { text-spacing-trim: space-all; }' },
    { code: 'p { text-spacing-trim: space-first; }' },
    { code: 'p { text-spacing-trim: trim-start; }' },
    { code: 'p { text-spacing-trim: TRIM-START !important; }' },
    { code: 'p { text-spacing-trim: inherit; }' },
    { code: 'p { text-spacing-trim: revert-layer; }' },
    { code: 'p { text-spacing-trim: var(--trim); }' },
    { code: 'p { text-spacing-trim: $trim; }', description: 'preprocessor variable' },
    {
      code: 'p { text-spacing-trim: trim-start; text-spacing-trim: trim-both; }',
      description: 'unsupported value after a supported fallback',
    },
    {
      code: '@supports (text-spacing-trim: trim-both) { p { text-spacing-trim: trim-both; } }',
      description: 'inside @supports for the property',
    },
    { code: 'p { text-autospace: ideograph-alpha; }', description: 'other properties are ignored' },
  ],
  reject: [
    {
      code: 'p { text-spacing-trim: trim-both; }',
      message:
        '"text-spacing-trim: trim-both" is in CSS Text 4 but no browser supports it yet, so the declaration is dropped. Put a supported value (normal, space-all, space-first, trim-start) before it as a fallback. (ja-typography/text-spacing-trim-value)',
    },
    { code: 'p { text-spacing-trim: trim-all; }' },
    { code: 'p { text-spacing-trim: auto; }' },
    {
      code: 'p { text-spacing-trim: trim-both; text-spacing-trim: trim-start; }',
      description: 'a fallback must come first',
    },
    {
      code: '@supports (display: grid) { p { text-spacing-trim: trim-all; } }',
      description: '@supports for something else does not count',
    },
    {
      code: 'p { text-spacing-trim: trim-start allow-end; }',
      message:
        '"text-spacing-trim: trim-start allow-end" uses the per-position keywords of the CSS Text 4 Editor\'s Draft only; the Working Draft and the browser tests treat it as invalid and browsers drop it. Use normal, space-all, space-first, trim-start. (ja-typography/text-spacing-trim-value)',
    },
    { code: 'p { text-spacing-trim: allow-end; }' },
    { code: 'p { text-spacing-trim: space-first trim-adjacent trim-end; }' },
    {
      code: 'p { text-spacing-trim: none; }',
      message:
        'Invalid text-spacing-trim value "none" ("none" was in the 2019 text-spacing draft; use space-all). CSS Text 4 allows normal, space-all, space-first, trim-start, trim-both, trim-all or auto. (ja-typography/text-spacing-trim-value)',
    },
    {
      code: 'p { text-spacing-trim: ideograph-alpha; }',
      message:
        'Invalid text-spacing-trim value "ideograph-alpha" ("ideograph-alpha" belongs to text-autospace). CSS Text 4 allows normal, space-all, space-first, trim-start, trim-both, trim-all or auto. (ja-typography/text-spacing-trim-value)',
    },
    { code: 'p { text-spacing-trim: no-compress; }' },
    {
      code: 'p { text-spacing-trim: normal space-first; }',
      message:
        'Invalid text-spacing-trim value "normal space-first" (normal, space-all, trim-both, trim-all and auto stand alone). CSS Text 4 allows normal, space-all, space-first, trim-start, trim-both, trim-all or auto. (ja-typography/text-spacing-trim-value)',
    },
    { code: 'p { text-spacing-trim: auto space-all; }' },
    { code: 'p { text-spacing-trim: trim-start space-first; }', description: 'two start keywords' },
    { code: 'p { text-spacing-trim: trim-auto; }', description: 'typo' },
    {
      code: 'p { text-spacing-trim: trim-start; text-spacing-trim: none; }',
      description: 'invalid values are reported even after a fallback',
    },
  ],
});

testRule({
  ruleName: R,
  config: [true, { ignore: ['unsupported', 'draft'] }],
  accept: [
    { code: 'p { text-spacing-trim: trim-both; }' },
    { code: 'p { text-spacing-trim: trim-start allow-end; }' },
  ],
  reject: [{ code: 'p { text-spacing-trim: none; }' }],
});

testRule({
  ruleName: R,
  config: [true, { ignoreSelectors: ['/^\\.legacy/'] }],
  accept: [{ code: '.legacy p { text-spacing-trim: none; }' }],
  reject: [{ code: '.modern p { text-spacing-trim: none; }' }],
});

testRule({
  ruleName: R,
  config: [true, { ignore: ['invalid'] }],
  accept: [{ code: 'p { text-spacing-trim: none; }', description: 'left to declaration-property-value-no-unknown' }],
  reject: [{ code: 'p { text-spacing-trim: trim-all; }' }],
});
