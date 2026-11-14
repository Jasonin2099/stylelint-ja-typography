import { testRule } from './helpers.js';

testRule({
  ruleName: 'ja-typography/text-combine-upright-supported',
  config: true,
  fix: true,
  accept: [
    { code: '.tcy { text-combine-upright: all; }' },
    { code: '.tcy { text-combine-upright: none; }' },
    { code: '.tcy { -webkit-text-combine: horizontal; text-combine-upright: all; }' },
  ],
  reject: [
    {
      code: '.v { text-combine-upright: digits 2; }',
      message:
        'Unexpected "text-combine-upright: digits". No major browser supports it; wrap the digits in an element and use "text-combine-upright: all". (ja-typography/text-combine-upright-supported)',
    },
    { code: '.v { text-combine-upright: digits; }' },
    { code: '.v { -webkit-text-combine-upright: digits 3; }' },
    {
      code: '.tcy { -webkit-text-combine: horizontal; }',
      fixed: '.tcy { -webkit-text-combine: horizontal; text-combine-upright: all; }',
      message:
        'Expected "text-combine-upright: all" next to "-webkit-text-combine: horizontal". (ja-typography/text-combine-upright-supported)',
    },
    {
      code: '.tcy { -webkit-text-combine: none; }',
      fixed: '.tcy { -webkit-text-combine: none; text-combine-upright: none; }',
    },
  ],
});
