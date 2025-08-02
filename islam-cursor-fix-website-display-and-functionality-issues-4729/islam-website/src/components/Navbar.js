import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaPray, 
  FaQuran, 
  FaCog, 
  FaMosque, 
  FaHands, 
  FaCompass, 
  FaCalendarAlt,
  FaStar,
  FaClock,
  FaBook,
  FaHeart
} from 'react-icons/fa';

const Navbar = ({ theme, userProfile }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <BootstrapNavbar expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaMosque className="me-2" />
          Islam360
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              <FaHome className="me-1" />
              Home
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/ibadyat" 
              className={isActive('/ibadyat') ? 'active' : ''}
            >
              <FaPray className="me-1" />
              Ibadyat
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/quran" 
              className={isActive('/quran') ? 'active' : ''}
            >
              <FaQuran className="me-1" />
              Quran
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/dua" 
              className={isActive('/dua') ? 'active' : ''}
            >
              <FaHands className="me-1" />
              Duas
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/tasbih" 
              className={isActive('/tasbih') ? 'active' : ''}
            >
              <FaStar className="me-1" />
              Tasbih
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/qibla" 
              className={isActive('/qibla') ? 'active' : ''}
            >
              <FaCompass className="me-1" />
              Qibla
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/calendar" 
              className={isActive('/calendar') ? 'active' : ''}
            >
              <FaCalendarAlt className="me-1" />
              Calendar
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/names" 
              className={isActive('/names') ? 'active' : ''}
            >
              <FaHeart className="me-1" />
              Names
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/times" 
              className={isActive('/times') ? 'active' : ''}
            >
              <FaClock className="me-1" />
              Prayer Times
            </Nav.Link>
          </Nav>
          
          <Nav>
            {userProfile.profilePicture && (
              <img 
                src={userProfile.profilePicture} 
                alt="Profile" 
                className="profile-pic"
              />
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;