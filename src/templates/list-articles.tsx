import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ArticleList, { ArticleNode } from '../components/article-list';
import Pagination from '../components/pagination';

interface ArticlesQuery {
  allMarkdownRemark: {
    nodes: ArticleNode[];
  };
}

interface PathContext {
  limit: number;
  skip: number;
  numPages: number;
  currentPage: number;
}

interface Props {
  data: ArticlesQuery;
  pathContext: PathContext;
}

const IndexPage = ({ data, pathContext: ctx }: Props) => {
  const { allMarkdownRemark } = data;
  const { nodes } = allMarkdownRemark;

  return (
    <Layout contentWidth={600}>
      <SEO title="Home" />
      <ArticleList nodes={nodes} />
      <Pagination pages={ctx.numPages} current={ctx.currentPage} />
    </Layout>
  );
};

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        excerpt(pruneLength: 250)
        frontmatter {
          path
          date: date(formatString: "MMM DD, YYYY")
          dateFromNow: date(fromNow: true)
          title
          peek
        }
      }
    }
  }
`;

export default IndexPage;
