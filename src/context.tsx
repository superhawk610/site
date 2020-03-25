import React, { useState, useLayoutEffect, createContext } from 'react';
import { ThemeProvider } from 'styled-components';
import { themes, defaultTheme } from './constants';

export interface Context {
  theme: string;
  toggleTheme: () => void;
}

export const AppContext = createContext<Context>({} as Context);

export const RootProvider = ({ children }: { children?: any }) => {
  const [theme, setTheme] = useState(defaultTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  useLayoutEffect(() => {
    const persistedTheme = window.localStorage.getItem('theme');
    const systemTheme = window.matchMedia(`(prefers-color-scheme: dark)`)
      .matches
      ? 'dark'
      : 'light';
    setTheme(persistedTheme || systemTheme || defaultTheme);
  }, []);

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={{ mode: theme, ...themes[theme] }}>
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};
