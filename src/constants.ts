import { createGlobalStyle } from 'styled-components';
import { transparentize } from 'polished';

export const colors = {
  black: '#111',
  offBlack: '#171717',
  white: '#fff',
  offWhite: '#f7f7f7',
  gray: '#aaa',
  grayLight: '#eee',
  yellow: 'yellow',
  yellowLight: '#ffff9c',
  red: 'red',
  blue: 'blue',
  cyan: 'cyan',
  purple: 'purple',
  purpleLight: '#ab27fb',
  orange: 'orange',
  green: 'green',
  lime: 'limegreen',
  dark: '#333',
  aqua: '#4476c3',
};

export const CSSColors = createGlobalStyle`
  :root {
    --color-black: ${colors.black};
    --color-off-black: ${colors.offBlack};
    --color-white: ${colors.white};
    --color-off-white: ${colors.offWhite};
    --color-gray: ${colors.gray};
    --color-gray-light: ${colors.grayLight};
    --color-yellow: ${colors.yellow};
    --color-yellow-light: ${colors.yellowLight};
    --color-red: ${colors.red};
    --color-blue: ${colors.blue};
    --color-cyan: ${colors.cyan};
    --color-purple: ${colors.purple};
    --color-purple-light: ${colors.purpleLight};
    --color-orange: ${colors.orange};
    --color-green: ${colors.green};
    --color-lime: ${colors.lime};
    --color-dark: ${colors.dark};
    --color-aqua: ${colors.aqua};

    /* light mode */
    --color-invert: var(--color-black);
    --color-text: var(--color-dark);
    --color-text-light: var(--color-gray);
    --color-background: var(--color-white);
    --color-off-background: var(--color-off-white);
    --color-primary: var(--color-aqua);
    --color-divider: var(--color-gray-light);
    --color-warning: var(--color-yellow-light);
    --color-warning-text: var(--color-dark);
  }

  /* dark mode */
  .dark {
    --color-invert: var(--color-white);
    --color-text: var(--color-off-white);
    --color-text-light: var(--color-gray);
    --color-background: var(--color-black);
    --color-off-background: var(--color-off-black);
    --color-primary: var(--color-purple-light);
    --color-divider: ${transparentize(0.8, colors.grayLight)};
    --color-warning: var(--color-yellow-light);
    --color-warning-text: var(--color-dark);
  }
`;

export const themes: { [theme: string]: any } = {
  light: {
    invert: 'var(--color-invert)',
    text: 'var(--color-text)',
    textLight: 'var(--color-text-light)',
    background: 'var(--color-background)',
    offBackground: 'var(--color-off-background)',
    primary: 'var(--color-primary)',
    divider: 'var(--color-divider)',
    warning: 'var(--color-warning)',
    warningText: 'var(--color-warning-text)',
  },
  dark: {
    invert: 'var(--color-invert)',
    text: 'var(--color-text)',
    textLight: 'var(--color-text-light)',
    background: 'var(--color-background)',
    offBackground: 'var(--color-off-background)',
    primary: 'var(--color-primary)',
    divider: 'var(--color-divider)',
    warning: 'var(--color-warning)',
    warningText: 'var(--color-warning-text)',
  },
};

declare module 'styled-components' {
  export interface DefaultTheme {
    invert: string;
    text: string;
    textLight: string;
    background: string;
    offBackground: string;
    primary: string;
    divider: string;
    warning: string;
    warningText: string;
  }
}

export const defaultTheme = 'light';

export const breakpoints = {
  tablet: '870px',
  mobile: '600px',
};

export const tags = [
  'javascript',
  'fp',
  'react',
  'angular',
  'rxjs',
  'python',
  'dev-tools',
  'abcs',
  'computer-science',
];
