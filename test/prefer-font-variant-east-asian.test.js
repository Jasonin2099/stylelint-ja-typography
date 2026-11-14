import { testRule } from './helpers.js';

testRule({
  ruleName: 'ja-typography/prefer-font-variant-east-asian',
  config: true,
  fix: true,
  accept: [
    { code: 'p { font-variant-east-asian: proportional-width; }' },
    { code: 'h1 { font-feature-settings: "palt"; }' },
    { code: 'p { font-feature-settings: "pwid" 0; }', description: 'disabled feature' },
    { code: 'p { font-feature-settings: normal; }' },
  ],
  reject: [
    {
      code: 'p { font-feature-settings: "pwid"; }',
      fixed: 'p { font-variant-east-asian: proportional-width; }',
      message:
        'Expected "font-variant-east-asian: proportional-width" instead of "pwid" in font-feature-settings. (ja-typography/prefer-font-variant-east-asian)',
    },
    {
      code: 'p { font-feature-settings: "jp78" 1, "fwid"; }',
      fixed: 'p { font-variant-east-asian: jis78 full-width; }',
      warnings: 2,
    },
    {
      code: 'rt { font-feature-settings: "ruby" on; }',
      fixed: 'rt { font-variant-east-asian: ruby; }',
    },
    {
      code: 'h1 { font-feature-settings: "palt", "trad"; }',
      fixed: 'h1 { font-feature-settings: "palt"; font-variant-east-asian: traditional; }',
    },
    {
      code: 'p { font-feature-settings: "jp78", "jp90"; }',
      description: 'conflicting variants are reported but not fixed',
      warnings: 2,
    },
    {
      code: 'p { font-variant: small-caps; font-feature-settings: "smpl"; }',
      description: 'not fixed next to font-variant shorthand',
    },
    {
      code: 'p { font-feature-settings: "pwid" !important; }',
      description: 'not fixed with !important',
    },
  ],
});
