import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const InquiriesPage = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure message is not empty
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      // Make the API call
      await axios.post("/submit-inquiry", { message });

      // Show success toast and clear the message
      toast.success("Inquiry submitted successfully!");
      setMessage(""); // Clear the form after submission
    } catch (error) {
      toast.error("Error submitting inquiry: " + (error.response ? error.response.data : error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ paddingTop: "80px" }}> {/* Add padding to avoid navbar overlap */}
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4" style={{ color: "#6f42c1", fontFamily: "Poppins, sans-serif" }}>
                Contact Us
              </h2>
              <p className="text-center mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Our team will respond to your inquiry within <strong>24 hours</strong>.
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="message" className="mb-4">
                  <Form.Label>Your Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your concerns or questions here..."
                    style={{ borderRadius: "10px" }}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isLoading}
                  style={{
                    backgroundColor: "#6f42c1",
                    borderColor: "#6f42c1",
                    borderRadius: "10px",
                    padding: "10px",
                    fontSize: "1.1rem",
                    fontWeight: "500",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Inquiry"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InquiriesPage;