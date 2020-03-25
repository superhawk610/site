import { transparentize } from 'polished';

export const colors = {
  black: '#000',
  white: '#fff',
  offWhite: '#f7f7f7',
  gray: '#ccc',
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

export const themes: { [theme: string]: any } = {
  light: {
    text: colors.dark,
    textLight: colors.gray,
    background: colors.white,
    primary: colors.aqua,
    divider: colors.grayLight,
    warning: colors.yellowLight,
    warningText: colors.dark,
  },
  dark: {
    text: colors.offWhite,
    textLight: colors.grayLight,
    background: colors.black,
    primary: colors.purpleLight,
    divider: transparentize(0.8, colors.grayLight),
    warning: colors.yellowLight,
    warningText: colors.dark,
  },
};

declare module 'styled-components' {
  export interface DefaultTheme {
    text: string;
    textLight: string;
    background: string;
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
