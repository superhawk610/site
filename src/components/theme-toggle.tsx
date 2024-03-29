import React, { useContext } from 'react';
import { AppContext } from '../context';
import styled from 'styled-components';

import Sun from '../svgs/sun.svg';
import Moon from '../svgs/moon.svg';

const ThemeToggle = () => {
  const ctx = useContext(AppContext);

  // don't try to SSR anything, otherwise we'll get a weird
  // half-version of the light SVG until themes are switched
  if (typeof window === 'undefined') return null;

  return (
    <Container onClick={ctx.toggleTheme}>
      {ctx.theme === 'light' ? <Sun /> : <Moon />}
    </Container>
  );
};

const Container = styled.button`
  background: transparent;
  border: 0;
  outline: 0;
  cursor: pointer;

  > svg {
    width: 60px;
    height: 60px;
  }

  transition: transform 250ms ease-out;
  &:hover {
    transform: scale(1.05);
  }
`;

export default ThemeToggle;
