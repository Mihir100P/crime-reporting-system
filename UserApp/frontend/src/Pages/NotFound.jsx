import React from "react";
import { Link } from "react-router-dom";

const NotFound = ({handleSOS}) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      {/* Emergency SOS Button */}
      <button
        onClick={handleSOS}
        className="btn btn-danger p-3 rounded sos-btn"
      >
        <i className="fa-solid fa-bell"></i> Emergency SOS
      </button>
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <p className="fs-4 text-muted">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-style gradient-text btn-lg mt-3">
        <i className="bi bi-house-door"></i> Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
