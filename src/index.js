import fontFeatureSettingsKeepInherited from './rules/font-feature-settings-keep-inherited.js';
import keepAllNeedsOverflowWrap from './rules/keep-all-needs-overflow-wrap.js';
import noLineBreakAnywhere from './rules/no-line-break-anywhere.js';
import noObsoleteWritingMode from './rules/no-obsolete-writing-mode.js';
import noPaltOnBodyText from './rules/no-palt-on-body-text.js';
import noSyntheticItalic from './rules/no-synthetic-italic.js';
import paltVpalMatchWritingMode from './rules/palt-vpal-match-writing-mode.js';
import preferFontKerning from './rules/prefer-font-kerning.js';
import preferFontVariantEastAsian from './rules/prefer-font-variant-east-asian.js';
import rubyPositionVertical from './rules/ruby-position-vertical.js';
import textCombineUprightSupported from './rules/text-combine-upright-supported.js';
import textEmphasisPositionJapanese from './rules/text-emphasis-position-japanese.js';

// Each rule module exports a Stylelint plugin created with createPlugin().
// See docs/rules/ for documentation.
const plugins = [
  fontFeatureSettingsKeepInherited,
  keepAllNeedsOverflowWrap,
  noLineBreakAnywhere,
  noObsoleteWritingMode,
  noPaltOnBodyText,
  noSyntheticItalic,
  paltVpalMatchWritingMode,
  preferFontKerning,
  preferFontVariantEastAsian,
  rubyPositionVertical,
  textCombineUprightSupported,
  textEmphasisPositionJapanese,
];

export default plugins;
