import React from 'react';
import { RootProvider } from './src/context';

export const wrapRootElement = ({ element }) => (
  <RootProvider>{element}</RootProvider>
);

export const onRenderBody = ({ setPreBodyComponents }) =>
  setPreBodyComponents([
    React.createElement('script', {
      key: 'dark-mode-avoid-fouc',
      dangerouslySetInnerHTML: {
        __html: `
          const persistedTheme = window.localStorage.getItem('theme');
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          const defaultTheme = 'light';
          const theme = persistedTheme || systemTheme || defaultTheme;

          if (theme === 'dark') {
            window.localStorage.setItem('theme', 'dark');
            window.document.documentElement.classList.add('dark');
          }
        `,
      },
    }),
  ]);
