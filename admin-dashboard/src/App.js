// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Inquiries from './pages/Inquiries';
import GeneralInfo from './pages/GeneralInfo';
import Recommendations from './pages/Recommendations';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      {isAuthenticated && (
        <Navbar 
          user={user} 
          setIsAuthenticated={setIsAuthenticated} 
          setUser={setUser} 
        />
      )}
      <Container fluid>
        {authError && (
          <Alert variant="danger" onClose={() => setAuthError('')} dismissible>
            {authError}
          </Alert>
        )}

        <Routes>
          {/* Login Route */}
          <Route path="/login" element={
            !isAuthenticated ? (
              <Login 
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
                setAuthError={setAuthError}
              />
            ) : <Navigate to="/" replace />
          } />

          {/* Protected Admin Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />

          <Route path="/inquiries" element={
            <ProtectedRoute>
              <Inquiries />
            </ProtectedRoute>
          } />

          <Route path="/general-info" element={
            <ProtectedRoute>
              <GeneralInfo />
            </ProtectedRoute>
          } />

          <Route path="/recommendations" element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;