import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/Homepage'; 
import DetectionPage from './pages/DetectionPage';
import CalculateEgfrPage from './pages/CalculateEgfrPage';
import InquiriesPage from './pages/InquiriesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const Layout = ({ children, setIsAuthenticated }) => {
  return (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      {children}
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <RegisterPage />
            )
          } 
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/detection"
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <DetectionPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/calculate-egfr"
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <CalculateEgfrPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/inquiries"
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <InquiriesPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect all other paths to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;