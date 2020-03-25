import * as path from 'path';
import { tags } from './constants';

type GatsbyCreatePagesArgs = any;

interface MarkdownNode {
  frontmatter: {
    path: string;
  };
}

const articleTemplate = path.resolve(`${__dirname}/templates/article.tsx`);
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

  // create article pages
  result.data.allMarkdownRemark.edges.forEach(
    ({ node }: { node: MarkdownNode }) =>
      createPage({
        path: node.frontmatter.path,
        component: articleTemplate,
        context: {},
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
