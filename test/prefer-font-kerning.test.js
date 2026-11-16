import { testRule } from './helpers.js';

testRule({
  ruleName: 'ja-typography/prefer-font-kerning',
  config: true,
  fix: true,
  accept: [
    { code: 'p { font-kerning: normal; }' },
    { code: 'p { font-kerning: none; }' },
    { code: 'h1 { font-feature-settings: "palt"; }' },
    { code: 'p { font-feature-settings: normal; }' },
    { code: 'p { font-feature-settings: "liga"; }' },
  ],
  reject: [
    {
      code: 'p { font-feature-settings: "kern"; }',
      fixed: 'p { font-kerning: normal; }',
      message:
        'Expected "font-kerning: normal" instead of "kern" in font-feature-settings. (ja-typography/prefer-font-kerning)',
    },
    {
      code: 'p { font-feature-settings: "kern" on; }',
      fixed: 'p { font-kerning: normal; }',
    },
    {
      code: 'p { font-feature-settings: "kern" 1; }',
      fixed: 'p { font-kerning: normal; }',
    },
    {
      code: 'p { font-feature-settings: "kern" off; }',
      fixed: 'p { font-kerning: none; }',
    },
    {
      code: 'p { font-feature-settings: "kern" 0; }',
      fixed: 'p { font-kerning: none; }',
    },
    {
      code: '.v { font-feature-settings: "vkrn"; }',
      fixed: '.v { font-kerning: normal; }',
    },
    {
      code: 'p { font-feature-settings: "kern", "vkrn"; }',
      fixed: 'p { font-kerning: normal; }',
      warnings: 2,
    },
    {
      code: 'p { font-feature-settings: "kern", "vkrn" 0; }',
      description: 'kern on and vkrn off are reported but not fixed',
      warnings: 2,
    },
    {
      code: 'h1 { font-feature-settings: "palt", "kern"; }',
      description: 'not fixed when other features remain',
    },
    {
      code: 'p { font-kerning: auto; font-feature-settings: "kern"; }',
      description: 'not fixed next to an existing font-kerning declaration',
    },
    {
      code: 'p { font-feature-settings: "kern" !important; }',
      description: 'not fixed with !important',
    },
  ],
});
