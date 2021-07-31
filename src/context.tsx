import React, { useState, createContext, useLayoutEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { themes, defaultTheme } from './constants';

export interface Context {
  theme: string;
  toggleTheme: () => void;
}

export const AppContext = createContext<Context>({} as Context);

export const RootProvider = ({ children }: { children?: any }) => {
  const [theme, setTheme] = useState(() =>
    typeof window === 'undefined'
      ? defaultTheme
      : window.localStorage.getItem('theme') || defaultTheme,
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem('theme', newTheme);
    window.document.documentElement.classList.toggle('dark');
    setTheme(newTheme);
  };

  // if we're hydrating from SSR, the initial value for the theme
  // won't match the true value, so check it again
  useLayoutEffect(() => {
    setTheme(window.localStorage.getItem('theme') || defaultTheme);
  }, []);

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={{ mode: theme, ...themes[theme] }}>
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};
