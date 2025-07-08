import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const navigate = useNavigate();
  const access = localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    navigate('/login');
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      style={{
        backgroundColor: '#1a1a2e',
        boxShadow: 'none',
        borderBottom: '1px solid #333',
      }}
    >
      <Container fluid className="px-5">
        <Navbar.Brand
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', color: '#c8c8ff' }}
        >
          RentWise
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate('/')} style={{ color: '#c8c8ff' }}>
              Dashboard
            </Nav.Link>

            {access && (
              <Nav.Link
                onClick={() => navigate('/properties/add')}
                style={{ color: '#c8ffc8' }}
              >
                Add Property
              </Nav.Link>
            )}

            <Nav.Link onClick={handleLogout} style={{ color: '#ff6b6b' }}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
