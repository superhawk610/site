import React from 'react';
import { Link } from 'gatsby';
import { formatRelative } from 'date-fns';
import styled from 'styled-components';

interface Props {
  nodes: ArticleNode[];
}

export interface ArticleNode {
  excerpt: string;
  frontmatter: {
    path: string;
    dateFromNow: string;
    date: string;
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
          <div className="heading">
            <h1>
              <Link to={node.frontmatter.path}>{node.frontmatter.title}</Link>
            </h1>
            <span>
              published {node.frontmatter.dateFromNow} &middot;{' '}
              {node.frontmatter.date}
            </span>
          </div>
          <p>{node.frontmatter.peek || node.excerpt}</p>
          <p>
            <Link to={node.frontmatter.path}>Read more...</Link>
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

  > .heading {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    > h1 {
      display: inline-block;
      border-radius: 8px;
      font-size: 22px;

      background: var(--color-off-background);
      padding: 0.3rem 0.75rem;
      margin: 0;

      > a {
        color: ${props => props.theme.text};
      }
    }

    > span {
      font-size: 0.9rem;
      padding-left: 1rem;
      color: ${props => props.theme.textLight};
    }
  }

  > p {
    margin: 0.5rem 0 0;
    padding: 0 1rem;
    color: ${props => props.theme.text};
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 300;
    font-size: 18px;
    line-height: 1.5;
  }
`;

export default ArticleList;
