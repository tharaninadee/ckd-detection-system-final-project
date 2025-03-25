import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Card, Spinner, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { FaCheck, FaTimes } from "react-icons/fa"; // Icons for Yes/No buttons

const DetectionPage = () => {
  const [formData, setFormData] = useState({
    age: "",
    blood_pressure: "",
    specific_gravity: "",
    albumin: "",
    blood_glucose_random: "",
    blood_urea: "",
    serum_creatinine: "",
    sodium: "",
    hemoglobin: "",
    packed_cell_volume: "",
    red_blood_cell_count: "",
    hypertension: 0, // 0 for No, 1 for Yes
    diabetes_mellitus: 0, // 0 for No, 1 for Yes
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleToggleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Convert all values to numbers
    const numericData = {
      ...formData,
      age: parseFloat(formData.age),
      blood_pressure: parseFloat(formData.blood_pressure),
      // ... repeat for all numeric fields
      hypertension: parseInt(formData.hypertension),
      diabetes_mellitus: parseInt(formData.diabetes_mellitus)
    };
  
    try {
      const response = await axios.post("/predict", numericData);
      setPredictionResult(response.data);
      setShowResultModal(true);
    } catch (error) {
      toast.error("Prediction failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
  };

  return (
    <Container className="my-5" style={{ paddingTop: "80px" }}> {/* Add padding to avoid navbar overlap */}
      <h2 className="text-center mb-4" style={{ color: "#6f42c1", fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
        Chronic Kidney Disease (CKD) Detection
      </h2>

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="age" className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="blood_pressure" className="mb-3">
                  <Form.Label>Blood Pressure</Form.Label>
                  <Form.Control
                    type="number"
                    name="blood_pressure"
                    value={formData.blood_pressure}
                    onChange={handleChange}
                    placeholder="Enter blood pressure (mm/Hg)"
                    min="50"
                    max="200"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="specific_gravity" className="mb-3">
                  <Form.Label>Specific Gravity</Form.Label>
                  <Form.Control
                    type="number"
                    name="specific_gravity"
                    value={formData.specific_gravity}
                    onChange={handleChange}
                    placeholder="Enter specific gravity"
                    min="1.000"
                    max="1.050"
                    step="0.001"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="albumin" className="mb-3">
                  <Form.Label>Albumin</Form.Label>
                  <Form.Control
                    type="number"
                    name="albumin"
                    value={formData.albumin}
                    onChange={handleChange}
                    placeholder="Enter albumin level"
                    min="0"
                    max="5"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="blood_glucose_random" className="mb-3">
                  <Form.Label>Blood Glucose Random</Form.Label>
                  <Form.Control
                    type="number"
                    name="blood_glucose_random"
                    value={formData.blood_glucose_random}
                    onChange={handleChange}
                    placeholder="Enter blood glucose level (mg/dL)"
                    min="50"
                    max="500"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="blood_urea" className="mb-3">
                  <Form.Label>Blood Urea</Form.Label>
                  <Form.Control
                    type="number"
                    name="blood_urea"
                    value={formData.blood_urea}
                    onChange={handleChange}
                    placeholder="Enter blood urea level (mg/dL)"
                    min="10"
                    max="200"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="serum_creatinine" className="mb-3">
                  <Form.Label>Serum Creatinine</Form.Label>
                  <Form.Control
                    type="number"
                    name="serum_creatinine"
                    value={formData.serum_creatinine}
                    onChange={handleChange}
                    placeholder="Enter serum creatinine level (mg/dL)"
                    min="0.5"
                    max="10"
                    step="0.1"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="sodium" className="mb-3">
                  <Form.Label>Sodium</Form.Label>
                  <Form.Control
                    type="number"
                    name="sodium"
                    value={formData.sodium}
                    onChange={handleChange}
                    placeholder="Enter sodium level (mEq/L)"
                    min="100"
                    max="160"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="hemoglobin" className="mb-3">
                  <Form.Label>Hemoglobin</Form.Label>
                  <Form.Control
                    type="number"
                    name="hemoglobin"
                    value={formData.hemoglobin}
                    onChange={handleChange}
                    placeholder="Enter hemoglobin level (g/dL)"
                    min="5"
                    max="20"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="packed_cell_volume" className="mb-3">
                  <Form.Label>Packed Cell Volume</Form.Label>
                  <Form.Control
                    type="number"
                    name="packed_cell_volume"
                    value={formData.packed_cell_volume}
                    onChange={handleChange}
                    placeholder="Enter packed cell volume (%)"
                    min="20"
                    max="60"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group controlId="red_blood_cell_count" className="mb-3">
                  <Form.Label>Red Blood Cell Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="red_blood_cell_count"
                    value={formData.red_blood_cell_count}
                    onChange={handleChange}
                    placeholder="Enter red blood cell count (millions/cmm)"
                    min="2"
                    max="8"
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="hypertension" className="mb-3">
                  <Form.Label>Hypertension</Form.Label>
                  <div className="d-flex">
                    <Button
                      variant={formData.hypertension === 0 ? "primary" : "outline-primary"}
                      onClick={() => handleToggleChange("hypertension", 0)}
                      className="me-2"
                      style={{ borderRadius: "10px", width: "100px" }}
                    >
                      <FaTimes className="me-1" /> No
                    </Button>
                    <Button
                      variant={formData.hypertension === 1 ? "primary" : "outline-primary"}
                      onClick={() => handleToggleChange("hypertension", 1)}
                      style={{ borderRadius: "10px", width: "100px" }}
                    >
                      <FaCheck className="me-1" /> Yes
                    </Button>
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="diabetes_mellitus" className="mb-3">
                  <Form.Label>Diabetes Mellitus</Form.Label>
                  <div className="d-flex">
                    <Button
                      variant={formData.diabetes_mellitus === 0 ? "primary" : "outline-primary"}
                      onClick={() => handleToggleChange("diabetes_mellitus", 0)}
                      className="me-2"
                      style={{ borderRadius: "10px", width: "100px" }}
                    >
                      <FaTimes className="me-1" /> No
                    </Button>
                    <Button
                      variant={formData.diabetes_mellitus === 1 ? "primary" : "outline-primary"}
                      onClick={() => handleToggleChange("diabetes_mellitus", 1)}
                      style={{ borderRadius: "10px", width: "100px" }}
                    >
                      <FaCheck className="me-1" /> Yes
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

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
                  Predicting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Result Popup Modal */}
      <Modal show={showResultModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
            Prediction Result
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h4
              className={`${
                predictionResult?.prediction === 1 ? "text-danger" : "text-success"
              }`}
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}
            >
              {predictionResult?.prediction === 1 ? "CKD Detected" : "No CKD Detected"}
            </h4>
            {predictionResult?.confidence && (
              <p className="mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                Confidence: {predictionResult.confidence.toFixed(2)}%
              </p>
            )}
            <p className="mt-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              {predictionResult?.prediction === 1
                ? "Please consult a doctor for further evaluation and treatment."
                : "Great news! Maintain your health with regular checkups and a healthy lifestyle."}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            style={{ borderRadius: "10px" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DetectionPage;