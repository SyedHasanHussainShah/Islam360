import React, { useState } from "react";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPray,
  FaQuran,
  FaMosque,
  FaHands,
  FaCompass,
  FaCalendarAlt,
  FaStar,
  FaHeart,
  FaUser,
} from "react-icons/fa";

const Navbar = ({ theme, userProfile }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    setExpanded(false); // close navbar after click
  };

  return (
    <BootstrapNavbar
      expand="lg"
      className="custom-navbar"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
          onClick={handleNavClick}
        >
          <FaMosque className="me-2" />
          Islam360
        </BootstrapNavbar.Brand>

        {/* Profile picture in the header (visible when navbar is collapsed) */}
        {userProfile.profilePicture && (
          <div className="d-lg-none ms-auto me-3">
            <img
              src={userProfile.profilePicture}
              alt="Profile"
              className="profile-pic-sm"
            />
          </div>
        )}

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100">
            <Nav.Link
              as={Link}
              to="/"
              className={isActive("/") ? "active" : ""}
              onClick={handleNavClick}
            >
              <FaHome className="me-1" />
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/ibadyat"
              className={isActive("/ibadyat") ? "active" : ""}
              onClick={handleNavClick}
            >
              <FaPray className="me-1" />
              Ibadyat
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/quran"
              className={isActive("/quran") ? "active" : ""}
              onClick={handleNavClick}
            >
              <FaQuran className="me-1" />
              Quran
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/dua"
              className={isActive("/dua") ? "active" : ""}
              onClick={handleNavClick}
            >
              <FaHands className="me-1" />
              Duas
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/tasbih"
              className={isActive("/tasbih") ? "active" : ""}
              onClick={handleNavClick}
            >
              <FaStar className="me-1" />
              Tasbih
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/qibla"
              className={isActive("/qibla") ? "active" : ""}
              onClick={handleNavClick}
            >
              <FaCompass className="me-1" />
              Qibla
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/calendar"
              className={isActive("/calendar") ? "active" : ""}
              onClick={handleNavClick}
            >
              <FaCalendarAlt className="me-1" />
              Calendar
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/names"
              className={isActive("/names") ? "active" : ""}
              onClick={handleNavClick}
            >
              <FaHeart className="me-1" />
              Names
            </Nav.Link>
            

          </Nav>
        </BootstrapNavbar.Collapse>

        {/* Profile picture (visible on desktop only) */}
        <div className="d-none d-lg-block ms-3">
          {userProfile.profilePicture ? (
            <img
              src={userProfile.profilePicture}
              alt="Profile"
              className="profile-pic"
            />
          ) : (
            <FaUser />
          )}
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;