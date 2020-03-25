import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

import Logo from '../svgs/portrait.svg';
import ThemeToggle from '../components/theme-toggle';
import Spacer from './spacer';
import { breakpoints } from '../constants';

const Sidebar = () => (
  <Container>
    <Logo />

    <Link to="/">home</Link>
    <a href="https://github.com/superhawk610">github</a>
    <a href="https://twitter.com/superhawk610">twitter</a>
    <a href="mailto:hello@aaronross.tech">inquiries</a>
    {/* <Link to="/resume">resume</Link> */}
    {/* <Link to="/portfolio">portfolio</Link> */}

    {/* TODO: add hamburger menu on mobile */}

    <Spacer />
    <ThemeToggle />
  </Container>
);

const Container = styled.section`
  position: sticky;
  top: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  flex: 0 0 250px;
  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 1.5rem;
    right: 0;
    width: 2px;
    height: 400px;
    background: ${props => props.theme.divider};
  }

  > svg {
    margin: 30px 0;
    width: 100px;
    stroke-width: 4px;

    > path {
      stroke: ${props => props.theme.text};
    }
  }

  > a {
    margin-bottom: 5px;
  }

  @media screen and (max-width: ${breakpoints.tablet}) {
    position: relative;
    top: auto;
    padding: 0 2rem;

    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > svg {
      margin: 0;
      width: 60px;
      height: 60px;
    }

    &::after {
      display: none;
    }

    > a {
      display: none;
    }
  }

  @media screen and (max-width: ${breakpoints.mobile}) {
    padding: 0;
    padding-bottom: 2rem;
  }
`;

export default Sidebar;
