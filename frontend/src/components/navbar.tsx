import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const navigate = useNavigate();
  const access = localStorage.getItem('access');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
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
      <Container fluid className="px-5 d-flex align-items-center justify-content-between">
        <div
          style={{ cursor: 'pointer', color: '#c8c8ff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          onClick={() => navigate('/')}
        >
          <Navbar.Brand style={{ margin: 0, padding: 0 }}>RentWise</Navbar.Brand>
          {username && (
            <span style={{ fontSize: '0.9rem', color: '#a0a0ff', userSelect: 'none' }}>
              Logged as: <strong>{username}</strong>
            </span>
          )}
        </div>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto" style={{ alignItems: 'center' }}>
            {access ? (
              <>
                <Nav.Link onClick={() => navigate('/')} style={{ color: '#c8c8ff' }}>
                  Dashboard
                </Nav.Link>

                <Nav.Link
                  onClick={() => navigate('/properties/add')}
                  style={{ color: '#c8ffc8' }}
                >
                  Add Property
                </Nav.Link>

                <Nav.Link onClick={handleLogout} style={{ color: '#ff6b6b' }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={() => navigate('/login')} style={{ color: '#6bc8ff' }}>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
