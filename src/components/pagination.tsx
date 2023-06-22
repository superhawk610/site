import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

export interface Props {
  pages: number;
  current: number;
}

const Pagination = ({ pages, current }: Props) => (
  <Container>
    <div>more articles</div>
    {Array.from({ length: pages }).map((_, i) => (
      <Link
        key={i}
        to={i === 0 ? '/' : `/blog/${i + 1}`}
        className={i + 1 === current ? 'current' : ''}
      >
        {i + 1}
      </Link>
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  > div {
    margin-right: 1rem;
  }

  > a {
    display: block;
    padding: 5px 12px 4px;
    background: ${props => props.theme.offBackground};

    &.current {
      background: ${props => props.theme.primary};
      color: ${props => props.theme.offBackground};
    }
  }
`;

export default Pagination;
