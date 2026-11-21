import plugins from '../index.js';

/**
 * Recommended config: every rule whose problems are almost always real
 * mistakes. Use it with `extends: ["stylelint-ja-typography/recommended"]`.
 */
export default {
  plugins,
  rules: {
    'ja-typography/keep-all-needs-overflow-wrap': true,
    'ja-typography/no-line-break-anywhere': true,
    'ja-typography/no-obsolete-writing-mode': true,
    'ja-typography/no-palt-on-body-text': true,
    'ja-typography/no-synthetic-italic': true,
    'ja-typography/palt-vpal-match-writing-mode': true,
    'ja-typography/prefer-font-kerning': true,
    'ja-typography/prefer-font-variant-east-asian': true,
    'ja-typography/ruby-position-vertical': true,
    'ja-typography/text-combine-upright-supported': true,
  },
};
