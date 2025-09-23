import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <p className="fs-4 text-muted">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary btn-lg mt-3">
        <i className="bi bi-house-door"></i> Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
