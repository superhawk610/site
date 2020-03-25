import React from 'react';
import styled from 'styled-components';

import { colors } from '../constants';

interface Props {
  time: number;
}

const ReadingTime = ({ time }: Props) => (
  <Container>you just wasted {time} minutes of your life, probably</Container>
);

const Container = styled.div`
  color: ${colors.textLight};
  margin-top: 3rem;
  text-align: right;
`;

export default ReadingTime;
