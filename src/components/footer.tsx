import React from 'react';
import styled from 'styled-components';

import Divider from './divider';

const Footer = () => (
  <Container>
    <Divider />
    <div>
      © {new Date().getFullYear()}, Built with{' '}
      <a href="https://www.gatsbyjs.org">Gatsby</a>
    </div>
  </Container>
);

const Container = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  padding: 1.5rem;
  color: #bbb;
`;

export default Footer;
