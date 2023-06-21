import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { CSSColors } from '../constants';

import Sidebar from './sidebar';
import Footer from './footer';

import 'normalize.css';
import './layout.css';
import './prism.css';

import { breakpoints } from '../constants';

interface Props {
  contentWidth?: number;
  children?: any;
}

const Layout = ({ contentWidth, children }: Props) => {
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);

  // transitions aren't enabled by default so that the initial render
  // is allowed to immediately set the background/text color, and
  // transitions are only used for toggles at runtime
  useEffect(() => {
    const timeout = setTimeout(() => setTransitionsEnabled(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <CSSColors />
      {transitionsEnabled && <CSSTransitions />}
      <Container>
        <Sidebar />
        <Content>
          <main style={contentWidth ? { maxWidth: `${contentWidth}px` } : {}}>
            {children}
          </main>
          <Footer />
        </Content>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;

  margin: 0 auto;
  max-width: 1200px;
  padding: 2rem;

  @media screen and (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: hidden;

  @media screen and (max-width: ${breakpoints.mobile}) {
    padding: 0;
  }
`;

const CSSTransitions = createGlobalStyle`
  body {
    transition: background 250ms ease-out, color 250ms ease-out;
  }

  a {
    transition: border-color 250ms ease-out;
  }
`;

export default Layout;
