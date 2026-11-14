import noPaltOnBodyText from './rules/no-palt-on-body-text.js';
import noSyntheticItalic from './rules/no-synthetic-italic.js';
import paltVpalMatchWritingMode from './rules/palt-vpal-match-writing-mode.js';

// Each rule module exports a Stylelint plugin created with createPlugin().
// See docs/rules/ for documentation.
const plugins = [noPaltOnBodyText, noSyntheticItalic, paltVpalMatchWritingMode];

export default plugins;
