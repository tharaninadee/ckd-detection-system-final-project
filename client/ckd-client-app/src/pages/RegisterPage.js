import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation to ensure fields are not empty
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }
    try {
      const response = await axios.post("/register", formData);
      console.log("Registration successful:", response.data); // Log response to console
      setSuccess("Registration successful!");
      setError(""); // Clear any previous error messages
      // Redirect to login page after successful registration
      setTimeout(() => {
        window.location.href = "/login"; // Redirect to login page
      }, 2000); // Redirect after 2 seconds to show the success message
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong!");
      setSuccess(""); // Clear any previous success messages
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
            md={8}
            lg={6}
            xl={5}
            className="mx-auto p-4 border rounded shadow-sm bg-white"
            style={{
              borderRadius: "15px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-center mb-4" style={{ color: "#6f42c1" }}>
              Register for an Account
            </h2>

            {/* Display error message */}
            {error && (
              <Alert
                variant="danger"
                className="text-center"
                style={{ borderRadius: "10px" }}
              >
                {error}
              </Alert>
            )}

            {/* Display success message */}
            {success && (
              <Alert
                variant="success"
                className="text-center"
                style={{ borderRadius: "10px" }}
              >
                {success}
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

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
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
                  placeholder="Create a password"
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
                style={{
                  backgroundColor: "#6f42c1",
                  borderColor: "#6f42c1",
                  borderRadius: "10px",
                  padding: "10px",
                  transition: "all 0.3s",
                  fontSize: "16px",
                }}
              >
                Register
              </Button>
            </Form>

            <p className="text-center" style={{ color: "#6f42c1" }}>
              Already have an account?{" "}
              <a
                href="/login"
                style={{
                  color: "#6f42c1",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Login here
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;