import React from 'react';
import { RootProvider } from './src/context';

import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/command-line/prism-command-line.css';

export const wrapRootElement = ({ element }) => (
  <RootProvider>{element}</RootProvider>
);
