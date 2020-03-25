import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import Sidebar from './sidebar';
import Footer from './footer';

import 'normalize.css';
import './layout.css';
import './prism.css';

import { breakpoints } from '../constants';

interface Props {
  children?: any;
}

const Layout = ({ children }: Props) => (
  <>
    <GlobalStyles />
    <Container>
      <Sidebar />
      <Content>
        <main>{children}</main>
        <Footer />
      </Content>
    </Container>
  </>
);

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

const GlobalStyles = createGlobalStyle`
  body {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: background 250ms ease-out, color 250ms ease-out;
  }

  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    padding-bottom: 2px;
    border-bottom: 2px solid transparent;

    transition: border-color 250ms ease-out;
    &:hover {
      border-bottom-color: ${props => props.theme.primary};
    }
  }

  pre {
    width: 100%;
    overflow-x: auto;
  }
`;

export default Layout;
