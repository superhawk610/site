import styled from 'styled-components';

const Divider = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  height: 2px;
  width: 100%;
  background: ${props => props.theme.divider};
`;

export default Divider;
