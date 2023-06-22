import * as path from 'path';
import { tags } from './constants';

type GatsbyCreatePagesArgs = any;

interface MarkdownNode {
  frontmatter: {
    path: string;
  };
}

const articleTemplate = path.resolve(`${__dirname}/templates/article.tsx`);
const articleListTemplate = path.resolve(
  `${__dirname}/templates/list-articles.tsx`,
);
const taggedTemplate = path.resolve(`${__dirname}/templates/tagged.tsx`);

export async function createPages({
  actions,
  graphql,
  reporter,
}: GatsbyCreatePagesArgs) {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `);

  // handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const articles = result.data.allMarkdownRemark.edges;
  const articlesPerPage = 6;
  const numPages = Math.ceil(articles.length / articlesPerPage);

  // create article pages
  articles.forEach(({ node }: { node: MarkdownNode }, i: number) =>
    createPage({
      path: node.frontmatter.path,
      component: articleTemplate,
      context: {
        currentPage: Math.floor(i / articlesPerPage) + 1,
      },
    }),
  );

  // create index pages
  Array.from({ length: numPages }).forEach((_, i) =>
    createPage({
      path: i === 0 ? '/' : `/blog/${i + 1}`,
      component: articleListTemplate,
      context: {
        limit: articlesPerPage,
        skip: i * articlesPerPage,
        numPages,
        currentPage: i + 1,
      },
    }),
  );

  // create tagged pages
  tags.forEach(tag =>
    createPage({
      path: `/tags/${tag}`,
      component: taggedTemplate,
      context: { tag },
    }),
  );
}
