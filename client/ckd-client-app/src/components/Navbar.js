import React from "react";
import { Nav, Navbar as BootstrapNavbar, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      window.location.href = '/login'; // Full page reload
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <BootstrapNavbar
      expand="lg"
      fixed="top"
      style={{
        backgroundColor: "#6f42c1",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}>
            KidneyCare AI
          </span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />

        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="mx-2"
              style={{
                fontWeight: "500",
                transition: "all 0.3s",
                borderRadius: "5px",
                color: "#fff",
              }}
              activeStyle={{ color: "#fff", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/detection"
              className="mx-2"
              style={{
                fontWeight: "500",
                transition: "all 0.3s",
                borderRadius: "5px",
                color: "#fff",
              }}
              activeStyle={{ color: "#fff", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              Detection
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/calculate-egfr"
              className="mx-2"
              style={{
                fontWeight: "500",
                transition: "all 0.3s",
                borderRadius: "5px",
                color: "#fff",
              }}
              activeStyle={{ color: "#fff", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              Calculate EGFR
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/inquiries"
              className="mx-2"
              style={{
                fontWeight: "500",
                transition: "all 0.3s",
                borderRadius: "5px",
                color: "#fff",
              }}
              activeStyle={{ color: "#fff", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              Inquiries
            </Nav.Link>
            
            <Button
              variant="outline-light"
              onClick={handleLogout}
              className="mx-2"
              style={{
                fontWeight: "500",
                borderRadius: "5px",
                padding: "5px 15px",
                color: "#fff",
                borderColor: "#fff",
              }}
            >
              Logout
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;