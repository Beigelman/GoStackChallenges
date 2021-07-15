import React from 'react';

import { useHistory } from 'react-router-dom';
import { Container, LinkRouter } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => {
  const history = useHistory();
  return (
    <Container size={size}>
      <header>
        <img src={Logo} alt="GoFinances" />
        <nav>
          <LinkRouter to="/" selected={history.location.pathname === '/'}>
            Listagem
          </LinkRouter>
          <LinkRouter
            to="/import"
            selected={history.location.pathname === '/import'}
          >
            Importar
          </LinkRouter>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
