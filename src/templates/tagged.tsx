import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ArticleList, { ArticleNode } from '../components/article-list';

interface Props {
  data: {
    allMarkdownRemark: {
      nodes: ArticleNode[];
    };
  };
  pageContext: {
    tag: string;
  };
}

export default ({ data, pageContext: ctx }: Props) => (
  <Layout>
    <SEO title={'fixme'} />
    <Link to="/tags">&lt; all tags</Link>
    <h1 style={{ marginBottom: '3rem' }}>
      tagged <code>#{ctx.tag}</code>
    </h1>
    <ArticleList nodes={data.allMarkdownRemark.nodes} />
  </Layout>
);

export const pageQuery = graphql`
  query($tag: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$tag] } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        excerpt(pruneLength: 250)
        frontmatter {
          path
          title
          peek
        }
      }
    }
  }
`;
