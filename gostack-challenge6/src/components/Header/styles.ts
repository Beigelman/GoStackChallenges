import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface ContainerProps {
  size?: 'small' | 'large';
}

interface LinkRouterProps {
  selected: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #5636d3;
  padding: 30px 0;

  header {
    width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: space-between;

    nav {
      a {
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        transition: opacity 0.2s;

        & + a {
          margin-left: 32px;
        }

        &:hover {
          opacity: 0.6;
        }
      }
    }
  }
`;

export const LinkRouter = styled(Link)<LinkRouterProps>`
  color: #ffffff;
  opacity: 0.8;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  ${props =>
    props.selected &&
    css`
      opacity: 1;
      border-bottom: 2px solid #ff872c;
      padding-bottom: 8px;
    `}
`;
