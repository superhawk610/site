import React from 'react';
import { Link, graphql } from 'gatsby';
import styled, { createGlobalStyle } from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ImportedNotice from '../components/imported-notice';
import Tag from '../components/tag';

import { colors } from '../constants';

interface Props {
  data: {
    markdownRemark: {
      html: string;
      excerpt: string;
      timeToRead: number;
      frontmatter: Frontmatter;
    };
  };
}

interface Frontmatter {
  date: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  imported?: boolean;
}

export default ({ data }: Props) => {
  const { markdownRemark } = data;
  const { frontmatter: meta, html, excerpt } = markdownRemark;
  const tags = meta.tags || [];

  return (
    <Layout>
      <ArticleStyles />
      <SEO title={meta.title} description={excerpt} />
      <Link to="/">&lt; back home</Link>
      <Heading>{meta.title}</Heading>
      {meta.subtitle && <Subheading>{meta.subtitle}</Subheading>}
      <Timestamp>{meta.date}</Timestamp>
      <Tags>
        {tags.map(tag => (
          <Tag key={tag} name={tag} />
        ))}
      </Tags>
      {meta.imported && <ImportedNotice />}
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  );
};

const Heading = styled.h1`
  margin: 0;
  margin-top: 1rem;
`;

const Subheading = styled.h2`
  margin: 0;
`;

const Timestamp = styled.h2`
  font-size: 18px;
  margin: 0;
  margin-top: 0.5rem;
  color: ${props => props.theme.textLight};
`;

const Tags = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 1rem 0;
`;

const ArticleStyles = createGlobalStyle`
  article {
    line-height: 1.5;

    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 300;
    color: ${props => props.theme.text};

    h1, h2, h3 {
      margin-top: 4rem;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Fira Sans', sans-serif;
      margin-bottom: 0.5rem;
    }

    h6 {
      margin-bottom: -4px;
      font-size: 12px;
    }

    > p > img {
      width: 100%;
    }
  }

  blockquote {
    position: relative;
    margin: 1rem;

    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: -1rem;
      width: 2px;
      height: 100%;
      background: ${props => props.theme.divider};
    }
  }
  
  table {
    width: 100%;
    border-collapse: collapse;

    > thead > tr > th {
      padding: 0.4em;
      text-align: left;
    }

    > tbody > tr > td {
      padding: 0.4em;
    }

    > tbody > tr:nth-child(odd) {
      background: ${colors.offWhite};
    }
  }

  .gatsby-resp-image-link {
    overflow: hidden;
  }

  .gatsby-resp-image-background-image {
    filter: blur(15px);
    transform: scale(1.05);
  }
`;

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt
      timeToRead
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        subtitle
        tags
        imported
      }
    }
  }
`;
