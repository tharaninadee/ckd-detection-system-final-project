import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const LoginPage = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.username || !formData.password) {
      setError("Please fill in both username and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/login", formData, {
        withCredentials: true
      });
      
      // Set authentication state and redirect
      setIsAuthenticated(true);
      navigate("/"); // Use navigate instead of window.location
      
    } catch (error) {
      setError(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6f42c1, #a15ad7)",
        padding: "20px 0",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          <Col
            md={6}
            lg={4}
            className="mx-auto p-4 border rounded shadow-sm bg-white"
            style={{
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
            }}
          >
            <div className="text-center mb-4">
              <img
                src="/image/10607.jpg"
                alt="Vector Illustration"
                style={{ width: "200px", height: "150px" }}
              />
            </div>

            <h2 className="text-center mb-4" style={{ color: "#6f42c1" }}>
              Login to Your Account
            </h2>

            {error && (
              <Alert variant="danger" className="text-center" style={{ borderRadius: "10px" }}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  style={{
                    borderRadius: "10px",
                    borderColor: "#6f42c1",
                    transition: "all 0.3s",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    borderRadius: "10px",
                    borderColor: "#6f42c1",
                    transition: "all 0.3s",
                  }}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={isLoading}
                style={{
                  backgroundColor: "#6f42c1",
                  borderColor: "#6f42c1",
                  borderRadius: "10px",
                  padding: "10px",
                  transition: "all 0.3s",
                  fontSize: "16px",
                }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </Form>

            <p className="text-center" style={{ color: "#6f42c1" }}>
              Don't have an account?{" "}
              <a
                href="/register"
                style={{
                  color: "#6f42c1",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Sign up here
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;