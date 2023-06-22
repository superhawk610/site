import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

interface Milestone {
  date: string;
  description: string;
}

// map from article path to milestone following it
const MILESTONES: Record<string, Milestone> = {
  '/articles/big-o-notation': {
    date: '4 years &middot; May 2019 &mdash; June 2023',
    description:
      "short break, writer's block, COVID-19 pandemic, etc.<br />(totally normal stuff, i swear)",
  },
};

interface Props {
  nodes: ArticleNode[];
  showMilestones?: boolean;
}

export interface ArticleNode {
  excerpt: string;
  fields: {
    readingTime: {
      text: string;
    };
  };
  frontmatter: {
    path: string;
    dateFromNow: string;
    date: string;
    title: string;
    peek: string;
  };
}

const ArticleList = ({ nodes, showMilestones }: Props) => (
  <>
    {nodes.length === 0 ? (
      <div>there's nothing here 🙁</div>
    ) : (
      nodes.map(node => (
        <>
          {showMilestones && MILESTONES[node.frontmatter.path] && (
            <MilestoneMarker>
              <div
                dangerouslySetInnerHTML={{
                  __html: MILESTONES[node.frontmatter.path].date,
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: MILESTONES[node.frontmatter.path].description,
                }}
              />
            </MilestoneMarker>
          )}
          <Article key={node.frontmatter.path}>
            <div className="heading">
              <h1>
                <Link to={node.frontmatter.path}>{node.frontmatter.title}</Link>
              </h1>
              <span>
                <span style={{ fontSize: '0.8em', opacity: 0.7 }}>
                  {node.fields.readingTime.text}
                </span>
                <br />
                published {node.frontmatter.dateFromNow} &middot;{' '}
                {node.frontmatter.date}
              </span>
            </div>
            <p>{node.frontmatter.peek || node.excerpt}</p>
            <p>
              <Link to={node.frontmatter.path}>Read more...</Link>
            </p>
          </Article>
        </>
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

const MilestoneMarker = styled.div`
  color: ${props => props.theme.textLight};
  font-size: 0.9rem;
  margin: 3rem 4rem;

  > div {
    margin-bottom: 0.3rem;
    opacity: 0.7;
  }

  > p {
    margin: 0;
  }
`;

export default ArticleList;
