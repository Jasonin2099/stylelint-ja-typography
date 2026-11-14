import { testRule } from './helpers.js';

testRule({
  ruleName: 'ja-typography/no-obsolete-writing-mode',
  config: true,
  fix: true,
  accept: [
    { code: '.v { writing-mode: vertical-rl; }' },
    { code: '.v { writing-mode: vertical-lr; }' },
    { code: '.h { writing-mode: horizontal-tb; }' },
    { code: '.s { writing-mode: sideways-rl; }' },
    { code: '.v { -ms-writing-mode: tb-rl; }', description: 'IE-only prefixed property is out of scope' },
  ],
  reject: [
    {
      code: '.v { writing-mode: tb-rl; }',
      fixed: '.v { writing-mode: vertical-rl; }',
      message:
        'Unexpected obsolete writing-mode value "tb-rl"; use "vertical-rl". (ja-typography/no-obsolete-writing-mode)',
    },
    { code: '.v { writing-mode: tb; }', fixed: '.v { writing-mode: vertical-rl; }' },
    { code: '.v { writing-mode: tb-lr; }', fixed: '.v { writing-mode: vertical-lr; }' },
    { code: '.h { writing-mode: lr-tb; }', fixed: '.h { writing-mode: horizontal-tb; }' },
    { code: '.h { writing-mode: rl; }', fixed: '.h { writing-mode: horizontal-tb; }' },
    { code: '.v { -webkit-writing-mode: TB-RL; }', fixed: '.v { -webkit-writing-mode: vertical-rl; }' },
    {
      code: '.v { writing-mode: tb-rl !important; }',
      fixed: '.v { writing-mode: vertical-rl !important; }',
    },
  ],
});
