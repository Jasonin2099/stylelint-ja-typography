import { testRule } from './helpers.js';

testRule({
  ruleName: 'ja-typography/ruby-position-vertical',
  config: true,
  accept: [
    { code: '.v { writing-mode: vertical-rl; ruby-position: over; }' },
    { code: '.v { writing-mode: vertical-rl; ruby-position: alternate; }' },
    { code: '.h { ruby-position: under; }', description: 'horizontal text is out of scope' },
    { code: '.h { writing-mode: horizontal-tb; ruby-position: under; }' },
    { code: '.v { writing-mode: vertical-rl; writing-mode: horizontal-tb; ruby-position: under; }', description: 'last writing-mode wins' },
    { code: '.v { writing-mode: vertical-rl; ruby-position: inter-character; }' },
    { code: '.v { writing-mode: vertical-rl; -webkit-ruby-position: before; }' },
    { code: '.tate { writing-mode: vertical-rl; } .other rt { ruby-position: under; }' },
    { code: '.tate { writing-mode: vertical-rl; } .tatex rt { ruby-position: under; }', description: 'class name prefix is not a match' },
    { code: '.tate { writing-mode: vertical-rl; } .yoko .tate-note rt { ruby-position: under; }' },
  ],
  reject: [
    {
      code: '.v { writing-mode: vertical-rl; ruby-position: under; }',
      message:
        'Unexpected "under" in vertical writing mode: it puts ruby on the left of the base text. Japanese vertical text puts ruby on the right ("over"). (ja-typography/ruby-position-vertical)',
    },
    { code: '.v { writing-mode: vertical-lr; ruby-position: UNDER; }' },
    { code: '.v { -webkit-writing-mode: tb-rl; ruby-position: alternate under; }' },
    { code: '.v { writing-mode: vertical-rl; ruby-position: under !important; }' },
    {
      code: '.v { writing-mode: vertical-rl; -webkit-ruby-position: after; }',
      message:
        'Unexpected "after" in vertical writing mode: it puts ruby on the left of the base text. Japanese vertical text puts ruby on the right ("over"). (ja-typography/ruby-position-vertical)',
    },
    { code: '.v { writing-mode: vertical-rl; & rt { ruby-position: under; } }', description: 'nested rule inside a vertical block' },
    { code: '.tate { writing-mode: vertical-rl; } .tate rt { ruby-position: under; }', description: 'descendant of a vertical selector' },
    { code: '.tate { writing-mode: vertical-rl; } .tate > ruby > rt { ruby-position: under; }' },
    { code: '.a, .tate { writing-mode: vertical-rl; } .x rt, .tate rt { ruby-position: under; }' },
    {
      code: '.v { writing-mode: vertical-rl; ruby-position: under; -webkit-ruby-position: after; }',
      warnings: 2,
    },
  ],
});

testRule({
  ruleName: 'ja-typography/ruby-position-vertical',
  config: [true, { ignoreSelectors: ['.tate rtc', '/hidari/'] }],
  accept: [
    { code: '.tate { writing-mode: vertical-rl; } .tate rtc { ruby-position: under; }' },
    { code: '.tate { writing-mode: vertical-rl; } .tate .hidari-ruby { ruby-position: under; }' },
  ],
  reject: [{ code: '.tate { writing-mode: vertical-rl; } .tate rt { ruby-position: under; }' }],
});
