import { testRule } from './helpers.js';

const ruleName = 'ja-typography/no-synthetic-italic';

testRule({
  ruleName,
  config: true,
  accept: [
    { code: 'em { font-style: italic; }', description: 'no Japanese context' },
    { code: ':lang(ja) em { font-style: normal; font-weight: bold; }' },
    { code: ':lang(ja) em { font-style: italic; font-synthesis-style: none; }' },
    { code: ':lang(ja) em { font-style: italic; font-synthesis: weight; }' },
    { code: '.en { font-family: "Inter", sans-serif; font-style: italic; }' },
    { code: ':lang(en) cite { font-style: italic; }' },
    {
      code: 'body { font-family: "Yu Gothic", sans-serif; } .x { font-style: italic; }',
      description: 'context is not inferred across separate rules',
    },
  ],
  reject: [
    {
      code: ':lang(ja) em { font-style: italic; }',
      message:
        'Unexpected "italic" on Japanese text. Japanese fonts have no italic face, so the browser slants glyphs synthetically; use text-emphasis, font-weight or another typeface, or add "font-synthesis-style: none". (ja-typography/no-synthetic-italic)',
    },
    { code: '[lang="ja"] i { font-style: oblique 10deg; }' },
    { code: '[lang|=ja] i { font-style: oblique; }' },
    { code: '.note { font-family: "Hiragino Sans", sans-serif; font-style: italic; }' },
    { code: '.note { font-family: "游ゴシック", sans-serif; font-style: italic; }' },
    { code: '.note { font: italic 16px/1.8 "Noto Sans JP", sans-serif; }' },
    {
      code: 'body { font-family: "Yu Gothic", sans-serif; .x { font-style: italic; } }',
      description: 'nested CSS',
    },
    { code: ':lang(ja) em { font-style: italic; font-synthesis: weight style; }' },
  ],
});

testRule({
  ruleName,
  config: [true, { assumeJapanese: true, ignoreSelectors: ['.latin'] }],
  accept: [{ code: '.latin { font-style: italic; }' }],
  reject: [{ code: 'em { font-style: italic; }' }],
});
