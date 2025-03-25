import React, { useEffect, useState } from "react";
import { Container, Accordion, Card, Row, Col } from "react-bootstrap";
import axios from "axios";

const HomePage = () => {
  const [generalInfo, setGeneralInfo] = useState([]);

  useEffect(() => {
    const fetchGeneralInfo = async () => {
      try {
        const response = await axios.get("/view-general-info");
        setGeneralInfo(response.data);
      } catch (error) {
        console.error("Error fetching general info", error);
      }
    };
    fetchGeneralInfo();
  }, []);

  return (
    <div>
      {/* Header with Image and Caption */}
      <div
          style={{
            backgroundImage: `url(/image/1.jpg)`, // Correct path
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
        {/* Transparent Black Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black
          }}
        ></div>

        {/* Caption */}
        <h1
          style={{
            color: "white",
            zIndex: 1,
            textAlign: "center",
            fontSize: "3rem",
            fontWeight: "bold",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Welcome to KidneyCare
        </h1>
      </div>

      {/* Introduction Section */}
      <Container className="my-5">
        <h2
          className="text-center mb-4"
          style={{ color: "#28a745", fontFamily: "Poppins, sans-serif" }}
        >
          Introduction
        </h2>
        <p
          className="text-center"
          style={{ fontSize: "1.1rem", fontFamily: "Poppins, sans-serif" }}
        >
          Chronic Kidney Disease (CKD) is a serious condition that affects millions of people worldwide. Early detection and management are crucial to prevent complications and improve quality of life. This app provides tools and information to help you understand and manage CKD effectively.
        </p>
      </Container>

      {/* About Section */}
      <Container className="my-5">
        <h2
          className="text-center mb-4"
          style={{ color: "#28a745", fontFamily: "Poppins, sans-serif" }}
        >
          About Kidney Health
        </h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title
                  style={{ color: "#28a745", fontFamily: "Poppins, sans-serif" }}
                >
                  The Role of Kidneys
                </Card.Title>
                <Card.Text style={{ fontFamily: "Poppins, sans-serif" }}>
                  Kidneys play a vital role in filtering waste and excess fluids from the blood. Keeping them healthy is essential for overall well-being.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title
                  style={{ color: "#28a745", fontFamily: "Poppins, sans-serif" }}
                >
                  Diabetes and Hypertension
                </Card.Title>
                <Card.Text style={{ fontFamily: "Poppins, sans-serif" }}>
                  Diabetes and hypertension are leading causes of kidney damage. Managing these conditions can help protect your kidneys.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title
                  style={{ color: "#28a745", fontFamily: "Poppins, sans-serif" }}
                >
                  Regular Checkups
                </Card.Title>
                <Card.Text style={{ fontFamily: "Poppins, sans-serif" }}>
                  Regular checkups and early intervention are key to preventing severe kidney complications.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* General Information as Accordion */}
      <Container className="my-5">
        <h2
          className="text-center mb-4"
          style={{ color: "#28a745", fontFamily: "Poppins, sans-serif" }}
        >
          General CKD Information
        </h2>
        <Accordion>
          {generalInfo.map((item) => (
            <Accordion.Item key={item.id} eventKey={item.id}>
              <Accordion.Header
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}
              >
                {item.title}
              </Accordion.Header>
              <Accordion.Body style={{ fontFamily: "Poppins, sans-serif" }}>
                <p>{item.content}</p>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </div>
  );
};

export default HomePage;