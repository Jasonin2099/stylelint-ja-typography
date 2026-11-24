import { testRule } from './helpers.js';

const RULE = 'ja-typography/text-emphasis-position-japanese';

testRule({
  ruleName: RULE,
  config: true,
  accept: [
    { code: ':lang(ja) em { text-emphasis: sesame; text-emphasis-position: over right; }' },
    { code: ':lang(ja) em { text-emphasis-position: over; }', description: 'right is the default side' },
    { code: ':lang(ja) em { text-emphasis-position: right over; }', description: 'keywords in any order' },
    { code: ':lang(ja) em { text-emphasis-position: auto; }', description: 'Firefox auto picks over right for Japanese' },
    { code: ':lang(ja) em { text-emphasis-position: inherit; }' },
    { code: ':lang(ja) em { text-emphasis-position: var(--pos); }' },
    { code: ':lang(zh) em { text-emphasis-position: under right; }', description: 'Chinese text is out of scope' },
    { code: 'em { text-emphasis-position: under; }', description: 'no sign of Japanese text' },
    {
      code: ':lang(ja) .tate { writing-mode: vertical-rl; text-emphasis-position: under right; }',
      description: '"under" has no effect in vertical text',
    },
    {
      code: ':lang(ja) .yoko { writing-mode: horizontal-tb; text-emphasis-position: over left; }',
      description: '"left" has no effect in horizontal text',
    },
    {
      code: 'html { text-emphasis-position: under; } :lang(ja) em { text-emphasis: dot; text-emphasis-position: over right; }',
      description: 'Japanese rule overrides the inherited position',
    },
    {
      code: 'html { text-emphasis-position: under; } :lang(ja) { text-emphasis-position: over right; & em { text-emphasis: dot; } }',
      description: 'override in an enclosing block',
    },
    {
      code: 'html { text-emphasis-position: under; } :lang(ja) em { text-emphasis: none; }',
    },
    {
      code: '.zh { text-emphasis-position: under; } :lang(ja) em { text-emphasis: dot; }',
      description: 'only root-like selectors are treated as inherited by Japanese text',
    },
  ],
  reject: [
    {
      code: ':lang(ja) em { text-emphasis-position: under right; }',
      message:
        'Unexpected "under right" on Japanese text: "under" puts emphasis marks (圏点) below horizontal text. Japanese puts them above ("over right"). (ja-typography/text-emphasis-position-japanese)',
    },
    { code: '[lang="ja"] em { text-emphasis-position: UNDER; }' },
    { code: ':lang(ja) em { -webkit-text-emphasis-position: under right; }' },
    { code: ':lang(ja) em { text-emphasis-position: under !important; }' },
    { code: 'p { font-family: "Hiragino Mincho ProN", serif; } p { } .x { font-family: "游明朝"; text-emphasis-position: under; }' },
    {
      code: ':lang(ja) .tate { writing-mode: vertical-rl; text-emphasis-position: over left; }',
      message:
        'Unexpected "over left" on Japanese text: "left" puts emphasis marks (圏点) on the left of vertical text. Japanese puts them on the right ("over right"). (ja-typography/text-emphasis-position-japanese)',
    },
    { code: ':lang(ja) em { text-emphasis-position: under left; }', warnings: 2 },
    { code: ':lang(ja) { writing-mode: vertical-rl; & em { text-emphasis-position: left over; } }' },
    {
      code: 'html { text-emphasis-position: under right; } :lang(ja) em { text-emphasis: dot; }',
      message:
        'Japanese emphasis marks inherit "text-emphasis-position: under right" from "html". Set "text-emphasis-position: over right" here. (ja-typography/text-emphasis-position-japanese)',
    },
    { code: ':root { text-emphasis-position: under; } :lang(ja) em { -webkit-text-emphasis-style: sesame; }' },
    {
      code: 'body, * { text-emphasis-position: left; } :lang(ja) b { text-emphasis-style: filled circle; } :lang(ja) i { text-emphasis: open; }',
      warnings: 2,
    },
  ],
});

testRule({
  ruleName: RULE,
  config: [true, { assumeJapanese: true }],
  accept: [{ code: 'em { text-emphasis-position: over right; }' }],
  reject: [{ code: 'em { text-emphasis-position: under; }' }],
});

testRule({
  ruleName: RULE,
  config: [true, { ignoreSelectors: ['/kanbun/'] }],
  accept: [{ code: ':lang(ja) .kanbun em { text-emphasis-position: under; }' }],
  reject: [{ code: ':lang(ja) .other em { text-emphasis-position: under; }' }],
});
