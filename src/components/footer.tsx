import React from 'react';
import styled from 'styled-components';

import Divider from './divider';
import Thinker from '../svgs/thinker.svg';

const QUIPS = [
  'the early worm skirts the bird',
  "i've never met a compiler i didn't like",
  "at the end of it all, we're more alike than we are different",
  'do you think computers dreams of mice?',
  'calculating, calculating, one sec, please hold..',
  'my favorite number is 87',
];

const quip =
  typeof window === 'undefined'
    ? QUIPS[0]
    : ((window as any).selectedQuip =
        (window as any).selectedQuip ||
        QUIPS[Math.floor(Math.random() * QUIPS.length)]);

const Footer = () => (
  <Container>
    <Divider style={{ marginBottom: '2rem' }} />
    <div>
      <em>ramblings by</em> <code>Aaron Ross</code>,{' '}
      <em>otherwise known as </em>
      <code>superhawk610</code>
    </div>
    <div id="quip">
      &gt; {quip}
      <Thinker height={90} />
    </div>
    <div>© {new Date().getFullYear()} all rights reserved</div>
    <div>
      built with <a href="https://www.gatsbyjs.org">Gatsby</a>
    </div>
  </Container>
);

const Container = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.8rem;
  color: ${props => props.theme.textLight};
  padding-bottom: 2rem;

  > div {
    margin-bottom: 0.25rem;
  }

  #quip {
    font-weight: 700;
    font-style: italic;
    margin: 1rem 0 0.7rem;
    color: var(--color-primary);

    position: relative;
    > svg {
      position: absolute;
      left: calc(100% - 4px);
      top: calc(100% + 6px);
      opacity: 0.2;
      > path {
        stroke: var(--color-text-light);
      }
    }
  }
`;

export default Footer;
