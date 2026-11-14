import { testRule } from './helpers.js';

const ruleName = 'ja-typography/no-palt-on-body-text';

testRule({
  ruleName,
  config: true,
  accept: [
    { code: 'h1, h2 { font-feature-settings: "palt"; }', description: 'headings' },
    { code: ':where(h1, h2, h3):lang(ja) { font-feature-settings: "palt"; }' },
    { code: '.c-button { font-feature-settings: "palt"; }', description: 'class' },
    { code: 'p.lead { font-feature-settings: "palt"; }', description: 'qualified paragraph' },
    { code: 'body { font-feature-settings: "palt" 0; }', description: 'disabled' },
    { code: 'body { font-feature-settings: "palt" off; }', description: 'off keyword' },
    { code: 'body { font-feature-settings: "tnum"; }', description: 'unrelated feature' },
    { code: 'body { font-feature-settings: var(--ff); }', description: 'variable' },
    { code: 'body p span { font-feature-settings: "palt"; }', description: 'subject is span' },
  ],
  reject: [
    {
      code: 'body { font-feature-settings: "palt"; }',
      message:
        'Unexpected "palt" on body text selector "body". Japanese running text is set solid (ベタ組み); apply "palt" to headings or short UI labels instead. (ja-typography/no-palt-on-body-text)',
    },
    { code: 'html { font-feature-settings: "palt" 1; }' },
    { code: ':root { font-feature-settings: "palt" on; }' },
    { code: '* { font-feature-settings: "pkna"; }' },
    { code: 'article p { font-feature-settings: "palt", "tnum"; }' },
    { code: 'p:lang(ja) { font-feature-settings: "palt"; }' },
    { code: ':where(p, li) { font-feature-settings: "palt"; }' },
    { code: 'body { font-feature-settings: "palt", "pkna"; }', warnings: 2 },
  ],
});

testRule({
  ruleName,
  config: [true, { bodyElements: ['p'], ignoreSelectors: ['/^\\.prose/'] }],
  accept: [
    { code: 'body { font-feature-settings: "palt"; }' },
    { code: '.prose p { font-feature-settings: "palt"; }' },
  ],
  reject: [{ code: 'main p { font-feature-settings: "palt"; }' }],
});
