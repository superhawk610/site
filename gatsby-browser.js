import React from 'react';
import { RootProvider } from './src/context';

import 'prism-themes/themes/prism-shades-of-purple.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/command-line/prism-command-line.css';

export const wrapRootElement = ({ element }) => (
  <RootProvider>{element}</RootProvider>
);
