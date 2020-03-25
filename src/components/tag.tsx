import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { darken } from 'polished';

import { colors } from '../constants';

interface Theme {
  background: string;
  color: string;
}

const themes: { [name: string]: Theme } = {
  javascript: {
    background: colors.yellow,
    color: colors.dark,
  },
  fp: {
    background: colors.red,
    color: colors.white,
  },
  react: {
    background: colors.blue,
    color: colors.white,
  },
  angular: {
    background: colors.lime,
    color: colors.white,
  },
  rxjs: {
    background: colors.purple,
    color: colors.white,
  },
  python: {
    background: colors.cyan,
    color: colors.dark,
  },
  'dev-tools': {
    background: colors.orange,
    color: colors.dark,
  },
  abcs: {
    background: colors.green,
    color: colors.white,
  },
  'computer-science': {
    background: colors.yellow,
    color: colors.dark,
  },
};

interface Props {
  name: string;
}

const Tag = ({ name }: Props) => (
  <Container to={`/tags/${name}`} name={name}>
    #{name}
  </Container>
);

const Container = styled(props => <Link {...props} />)`
  display: inline-block;
  margin: 0 5px 5px 0;
  padding: 4px 10px 3px;

  background: ${props => themes[props.name].background};
  color: ${props => themes[props.name].color};

  transition: all 250ms ease-out;
  &:hover {
    background: ${props => darken(0.05, themes[props.name].background)};
    border-bottom-color: ${props => themes[props.name].color};
  }
`;

export default Tag;
