import { testRule } from './helpers.js';

const RULE = 'ja-typography/font-feature-settings-keep-inherited';

testRule({
  ruleName: RULE,
  config: true,
  accept: [
    { code: '.article { font-feature-settings: "palt"; } .article h2 { font-feature-settings: "palt", "tnum"; }' },
    {
      code: '.article { font-feature-settings: "palt"; } .article pre { font-feature-settings: "palt" 0, "tnum"; }',
      description: 'turning the feature off explicitly is a decision, not a loss',
    },
    {
      code: '.article { font-feature-settings: "palt"; } .article pre { font-feature-settings: normal; }',
      description: 'normal resets everything on purpose',
    },
    {
      code: '.article { font-feature-settings: "palt"; } .article-footer { font-feature-settings: "tnum"; }',
      description: 'a longer class name is not a descendant',
    },
    {
      code: '.a { font-feature-settings: "palt"; } .a + .b { font-feature-settings: "tnum"; } .a ~ .c { font-feature-settings: "tnum"; }',
      description: 'siblings do not inherit',
    },
    {
      code: '.a { font-feature-settings: "palt"; } .a { font-feature-settings: "tnum"; }',
      description: 'the same selector again is a plain override',
    },
    {
      code: '.a { font-feature-settings: "liga" 0; } .a b { font-feature-settings: "tnum"; }',
      description: 'only Japanese-relevant features are watched by default',
    },
    {
      code: '.a { font-feature-settings: "palt"; } .a b { font-feature-settings: var(--ffs); }',
      description: 'variables cannot be read',
    },
    {
      code: '.a { font-feature-settings: "palt"; } .a b { font: inherit; }',
      description: 'font: inherit keeps the inherited settings',
    },
    {
      code: '@media print { .a { font-feature-settings: "palt"; } } .a b { font-feature-settings: "tnum"; }',
      description: 'a provider inside @media does not always apply',
    },
    {
      code: 'html { font-feature-settings: "palt"; } body { font-feature-settings: "palt", "tnum"; }',
    },
    {
      code: 'html { font-feature-settings: "palt"; } body { font-feature-settings: "tnum"; }',
      description: 'root-like rules are not checked against each other',
    },
  ],
  reject: [
    {
      code: '.article { font-feature-settings: "palt"; } .article h2 { font-feature-settings: "tnum"; }',
      message: `font-feature-settings here replaces the list set on ".article" and drops "palt" (the property is not merged). Repeat it in this list. (${RULE})`,
    },
    {
      code: '.a { font-feature-settings: "palt", "pkna"; } .a > b { font-feature-settings: "tnum"; }',
      message: `font-feature-settings here replaces the list set on ".a" and drops "palt", "pkna" (the property is not merged). Repeat them in this list. (${RULE})`,
    },
    {
      code: '.btn { font-feature-settings: "palt"; } .btn:hover { font-feature-settings: "ss01"; }',
      description: 'same element, more specific selector',
    },
    {
      code: '.a { font-feature-settings: "palt"; } .a .b { font-feature-settings: "palt", "tnum"; } .a .b em { font-feature-settings: "tnum"; }',
      description: 'checked against the closest provider',
      message: `font-feature-settings here replaces the list set on ".a .b" and drops "palt" (the property is not merged). Repeat it in this list. (${RULE})`,
    },
    {
      code: '.a { font-feature-settings: "palt"; &:hover { font-feature-settings: "tnum"; } }',
      description: 'nested rule',
    },
    {
      code: '.a { font-feature-settings: "palt"; .b & { font-feature-settings: "tnum"; } }',
      description: 'nested rule with & later',
    },
    {
      code: 'body { font-feature-settings: "palt"; } .price { font-feature-settings: "tnum"; }',
      description: 'root-like provider applies to every rule',
    },
    {
      code: '.a { font-feature-settings: "palt"; } @media (min-width: 40em) { .a b { font-feature-settings: "tnum"; } }',
      description: 'a top-level provider applies inside @media',
    },
    {
      code: '.a { font-feature-settings: "vpal"; } .a b { font: 1em/1.8 serif; }',
      message: `The "font" shorthand resets font-feature-settings to "normal", dropping "vpal" set on ".a". Set font-feature-settings again after it, or use the longhands. (${RULE})`,
    },
    {
      code: '.a, .b { font-feature-settings: "palt"; } .x, .b span { font-feature-settings: "tnum"; }',
      description: 'selector lists',
    },
  ],
});

testRule({
  ruleName: RULE,
  config: [true, { features: ['liga'] }],
  accept: [{ code: '.a { font-feature-settings: "palt"; } .a b { font-feature-settings: "tnum"; }' }],
  reject: [{ code: '.a { font-feature-settings: "liga" 0; } .a b { font-feature-settings: "tnum"; }' }],
});

testRule({
  ruleName: RULE,
  config: [true, { ignoreSelectors: ['/^\\.a b$/'] }],
  accept: [{ code: '.a { font-feature-settings: "palt"; } .a b { font-feature-settings: "tnum"; }' }],
});
