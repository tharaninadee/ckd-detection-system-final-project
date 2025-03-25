// src/components/Navbar.js
import axios from 'axios';
import { Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const CustomNavbar = ({ user, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { 
        withCredentials: true 
      });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#2E1A47', // Dark purple
        padding: '20px',
        color: '#FFFFFF',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <h3 style={{ marginBottom: '30px', color: '#FFFFFF' }}>
        Admin Dashboard
      </h3>

      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/" 
          style={{ color: '#FFFFFF', marginBottom: '10px' }}
        >
          Dashboard
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/users" 
          style={{ color: '#FFFFFF', marginBottom: '10px' }}
        >
          Users
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/inquiries" 
          style={{ color: '#FFFFFF', marginBottom: '10px' }}
        >
          Inquiries
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/general-info" 
          style={{ color: '#FFFFFF', marginBottom: '10px' }}
        >
          General Info
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/recommendations" 
          style={{ color: '#FFFFFF', marginBottom: '10px' }}
        >
          Recommendations
        </Nav.Link>
      </Nav>

      <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
        <Button 
          variant="outline-light" 
          onClick={handleLogout}
          style={{ width: '100%' }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default CustomNavbar;