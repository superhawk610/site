import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Tag from '../components/tag';

import { tags } from '../constants';
import { Link } from 'gatsby';

const Tags = () => (
  <Layout>
    <SEO title="Tags" />
    <Link to="/">&lt; back home</Link>
    <h1>Tags</h1>
    {tags.map(tag => (
      <Tag key={tag} name={tag} />
    ))}
  </Layout>
);

export default Tags;
