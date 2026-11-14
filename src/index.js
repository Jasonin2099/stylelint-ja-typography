import keepAllNeedsOverflowWrap from './rules/keep-all-needs-overflow-wrap.js';
import noLineBreakAnywhere from './rules/no-line-break-anywhere.js';
import noPaltOnBodyText from './rules/no-palt-on-body-text.js';
import noSyntheticItalic from './rules/no-synthetic-italic.js';
import paltVpalMatchWritingMode from './rules/palt-vpal-match-writing-mode.js';
import preferFontVariantEastAsian from './rules/prefer-font-variant-east-asian.js';

// Each rule module exports a Stylelint plugin created with createPlugin().
// See docs/rules/ for documentation.
const plugins = [
  keepAllNeedsOverflowWrap,
  noLineBreakAnywhere,
  noPaltOnBodyText,
  noSyntheticItalic,
  paltVpalMatchWritingMode,
  preferFontVariantEastAsian,
];

export default plugins;
