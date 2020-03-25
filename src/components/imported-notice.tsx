import React from 'react';
import styled from 'styled-components';

const ImportedNotice = () => (
  <Container>
    This article was originally published on{' '}
    <a href="https://github.com/superhawk610/dev-a-day">#dev-a-day</a>.
  </Container>
);

const Container = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.warning};
  color: ${props => props.theme.warningText};
`;

export default ImportedNotice;
