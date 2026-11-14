import { testRule } from './helpers.js';

testRule({
  ruleName: 'ja-typography/palt-vpal-match-writing-mode',
  config: true,
  fix: true,
  accept: [
    { code: '.v { writing-mode: vertical-rl; font-feature-settings: "vpal"; }' },
    { code: 'h1 { font-feature-settings: "palt"; }', description: 'no writing-mode in block' },
    { code: '.h { writing-mode: horizontal-tb; font-feature-settings: "palt"; }' },
    {
      code: '.v { writing-mode: vertical-rl; text-orientation: sideways; font-feature-settings: "palt"; }',
      description: 'sideways orientation uses horizontal features',
    },
    { code: '.v { writing-mode: vertical-rl; font-feature-settings: "palt" 0; }' },
    { code: '.v { writing-mode: vertical-rl; font-feature-settings: var(--ff); }' },
  ],
  reject: [
    {
      code: '.v { writing-mode: vertical-rl; font-feature-settings: "palt"; }',
      fixed: '.v { writing-mode: vertical-rl; font-feature-settings: "vpal"; }',
      message:
        'Expected "vpal" instead of "palt" in vertical writing mode. (ja-typography/palt-vpal-match-writing-mode)',
    },
    {
      code: '.v { font-feature-settings: \'palt\' 1, "tnum"; writing-mode: vertical-lr; }',
      fixed: '.v { font-feature-settings: \'vpal\' 1, "tnum"; writing-mode: vertical-lr; }',
    },
    {
      code: '.v { writing-mode: vertical-rl; font-feature-settings: "halt"; }',
      fixed: '.v { writing-mode: vertical-rl; font-feature-settings: "vhal"; }',
    },
    {
      code: '.h { writing-mode: horizontal-tb; font-feature-settings: "vpal"; }',
      fixed: '.h { writing-mode: horizontal-tb; font-feature-settings: "palt"; }',
    },
    {
      code: '.s { writing-mode: sideways-rl; font-feature-settings: "vpal"; }',
      fixed: '.s { writing-mode: sideways-rl; font-feature-settings: "palt"; }',
    },
    {
      code: '.v { writing-mode: vertical-rl; font-feature-settings: "palt", "vpal"; }',
      description: 'not fixable when the replacement already exists',
    },
    {
      code: '.v { writing-mode: tb-rl; font-feature-settings: "palt"; }',
      fixed: '.v { writing-mode: tb-rl; font-feature-settings: "vpal"; }',
    },
  ],
});
