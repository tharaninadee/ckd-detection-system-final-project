import React, { useState, useRef } from "react";
import { Button, Form, Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaFilePdf, FaCalculator } from "react-icons/fa";

// CKD Reference Table Component
const CkdStagesTable = () => {
  const stages = [
    { stage: 'Stage 1', description: 'Normal or high eGFR (≥90)', color: '#4CAF50' },
    { stage: 'Stage 2', description: 'Mildly decreased eGFR (60-89)', color: '#8BC34A' },
    { stage: 'Stage 3', description: 'Moderately decreased eGFR (30-59)', color: '#FFC107' },
    { stage: 'Stage 4', description: 'Severely decreased eGFR (15-29)', color: '#FF9800' },
    { stage: 'Stage 5', description: 'Kidney failure (eGFR <15)', color: '#F44336' },
  ];

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h5 className="text-center mb-3" style={{ color: "#6f42c1", fontFamily: "Poppins, sans-serif" }}>
          CKD Stages Reference
        </h5>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Stage</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((item, index) => (
                <tr key={index} style={{ backgroundColor: item.color, color: 'white' }}>
                  <td>{item.stage}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
};

const CalculateEgfrPage = () => {
  const [formData, setFormData] = useState({
    age: "",
    serum_creatinine: "",
    gender: "male",
  });

  const [egfrResult, setEgfrResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultsRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/calculate-egfr", formData);
      setEgfrResult(response.data);
      toast.success("eGFR calculated successfully!");
    } catch (error) {
      toast.error("Error calculating eGFR: " + error.message);
      setEgfrResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;
    
    setIsDownloading(true);
    try {
      const element = resultsRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`eGFR_Results_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success("Results downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error downloading results: " + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
  };

  return (
    <Container className="my-5" style={{ paddingTop: "80px" }}> {/* Add padding to avoid navbar overlap */}
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4" style={{ color: "#6f42c1", fontFamily: "Poppins, sans-serif" }}>
                <FaCalculator className="me-2" />
                Calculate eGFR
              </h2>
              <p className="text-center mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                eGFR (estimated Glomerular Filtration Rate) is a measure of kidney function. Enter your details below to calculate your eGFR.
              </p>
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
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="serum_creatinine" className="mb-3">
                      <Form.Label>Serum Creatinine (mg/dL)</Form.Label>
                      <Form.Control
                        type="number"
                        name="serum_creatinine"
                        value={formData.serum_creatinine}
                        onChange={handleChange}
                        placeholder="Enter serum creatinine level"
                        min="0.1"
                        max="10"
                        step="0.1"
                        required
                        style={{ borderRadius: "10px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="gender" className="mb-4">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{ borderRadius: "10px" }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Control>
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
                      Calculating...
                    </>
                  ) : (
                    "Calculate eGFR"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {egfrResult && (
            <>
              <div ref={resultsRef}>
                <Card className="mt-4 shadow-sm">
                  <Card.Header className="bg-light text-center">
                    <h3 style={{ color: "#6f42c1", fontFamily: "Poppins, sans-serif" }}>
                      eGFR Result Report
                    </h3>
                    <p className="mb-0">Generated on: {formatDate()}</p>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={6}>
                        <h6>Patient Information:</h6>
                        <p>Age: {formData.age}</p>
                        <p>Gender: {formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}</p>
                        <p>Serum Creatinine: {formData.serum_creatinine} mg/dL</p>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex flex-column align-items-center justify-content-center h-100">
                          <h4
                            className={`text-center ${
                              egfrResult.egfr >= 60 ? "text-success" : "text-danger"
                            }`}
                            style={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}
                          >
                            eGFR: {egfrResult.egfr} mL/min/1.73m²
                          </h4>
                          <p className="text-center mt-2" style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.2rem" }}>
                            Stage: {egfrResult.stage}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    
                    {/* CKD Stages Reference Table */}
                    <CkdStagesTable />
                    
                    <div className="mt-3">
                      <h5 style={{ fontFamily: "Poppins, sans-serif", color: "#6f42c1" }}>Recommendations:</h5>
                      <ul style={{ fontFamily: "Poppins, sans-serif" }}>
                        <li><strong>Lifestyle:</strong> {egfrResult.recommendations.lifestyle}</li>
                        <li><strong>Diet:</strong> {egfrResult.recommendations.diet}</li>
                        <li><strong>Medical:</strong> {egfrResult.recommendations.medical}</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4 pt-3 border-top text-center small">
                      <p>Disclaimer: This calculation is based on the CKD-EPI equation and is for informational purposes only. 
                      Always consult with a healthcare professional for proper medical advice.</p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              
              <div className="text-center mt-3 mb-5">
                <Button
                  variant="success"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="px-4 py-2"
                  style={{
                    borderRadius: "10px",
                    fontSize: "1rem",
                  }}
                >
                  {isDownloading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FaFilePdf className="me-2" />
                      Download Results as PDF
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CalculateEgfrPage;