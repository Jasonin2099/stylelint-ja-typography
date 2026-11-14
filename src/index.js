import noPaltOnBodyText from './rules/no-palt-on-body-text.js';
import paltVpalMatchWritingMode from './rules/palt-vpal-match-writing-mode.js';

// Each rule module exports a Stylelint plugin created with createPlugin().
// See docs/rules/ for documentation.
const plugins = [noPaltOnBodyText, paltVpalMatchWritingMode];

export default plugins;
