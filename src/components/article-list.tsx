import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

interface Props {
  nodes: ArticleNode[];
}

export interface ArticleNode {
  excerpt: string;
  frontmatter: {
    path: string;
    title: string;
    peek: string;
  };
}

const ArticleList = ({ nodes }: Props) => (
  <>
    {nodes.length === 0 ? (
      <div>there's nothing here 🙁</div>
    ) : (
      nodes.map(node => (
        <Article key={node.frontmatter.path}>
          <h1>
            <Link to={node.frontmatter.path}>{node.frontmatter.title}</Link>
          </h1>
          <p>
            {node.frontmatter.peek || node.excerpt}
            &nbsp;<Link to={node.frontmatter.path}>Read more...</Link>
          </p>
        </Article>
      ))
    )}
  </>
);

const Article = styled.div`
  display: block;
  margin-bottom: 3rem;
  border: 0;

  > h1 {
    display: inline-block;
    margin: 0;
    font-size: 22px;

    > a {
      color: ${props => props.theme.text};
    }
  }

  > p {
    margin: 0;
    margin-top: 0.5rem;
    color: ${props => props.theme.text};
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 300;
    font-size: 18px;
    line-height: 1.5;
  }
`;

export default ArticleList;
