import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/authContext";
import { Spinner, Container } from "react-bootstrap";

const ProtectedRoute = () => {
  const { police, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return police ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
