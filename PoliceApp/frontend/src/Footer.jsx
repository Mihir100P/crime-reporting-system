import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
  <Container>
    <Row className="align-items-center">
      {/* Links Section */}
      <Col className="d-flex flex-wrap justify-content-center text-center">
        <Link
          to="/about"
          className="text-light mx-3 text-decoration-none fw-semibold fs-5 footerlink"
        >
          About
        </Link>
        <Link
          to="/privacy"
          className="text-light mx-3 text-decoration-none fw-semibold fs-5 footerlink"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="text-light mx-3 text-decoration-none fw-semibold fs-5 footerlink"
        >
          Terms of Service
        </Link>
        <Link
          to="/contact"
          className="text-light mx-3 text-decoration-none fw-semibold fs-5 footerlink"
        >
          Contact
        </Link>
      </Col>
    </Row>

    {/* Copyright Section */}
    <Row className="mt-3">
      <Col className="text-center">
        <p className="text-white fs-5 m-0">
          &copy; {new Date().getFullYear()} Copyright All Rights Reserved by
          <span className="fw-bold ms-1">Jatayu</span>
        </p>
      </Col>
    </Row>
  </Container>
</footer>

  );
};

export default Footer;