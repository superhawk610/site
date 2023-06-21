import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ArticleList, { ArticleNode } from '../components/article-list';

interface ArticlesQuery {
  allMarkdownRemark: {
    nodes: ArticleNode[];
  };
}

// TODO: implement pagination
// ref: https://www.gatsbyjs.org/docs/adding-pagination/
const IndexPage = () => {
  const data: ArticlesQuery = useStaticQuery(graphql`
    query {
      allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
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
  `);
  const { allMarkdownRemark } = data;
  const { nodes } = allMarkdownRemark;

  return (
    <Layout contentWidth={600}>
      <SEO title="Home" />
      <ArticleList nodes={nodes} />
    </Layout>
  );
};

export default IndexPage;
