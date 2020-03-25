import React from 'react';
import { RootProvider } from './src/context';

export const wrapRootElement = ({ element }) => (
  <RootProvider>{element}</RootProvider>
);
