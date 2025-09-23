import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import AuthContext from "../context/authContext";
import { toast } from "react-toastify";

const PoliceLogin = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginPolice } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setError("");

    const result = await loginPolice(formData.StationName, formData.password);

    if (result.success) {
        toast.success("Login successfully.")
        navigate("/");
    } else {
      toast.error("failed to login");
      setError(result.message || "Login failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg border-0 p-4 box" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h1 className="text-center fw-bold" style={{color: "#721a06ff"}}>Sign In</h1>
          <p className="text-muted text-center">Access your account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            {/* stationName Field */}
           <Form.Group controlId="StationName" className="mb-3">
                <Form.Label>Station Name</Form.Label>
                <Form.Control
                    type="text"
                    className="box"
                    placeholder="station name"
                    {...register("StationName", {
                    required: "Station name is required",
                    minLength: {
                        value: 3,
                        message: "Station name must be at least 3 characters",
                    },
                    })}
                    isInvalid={!!errors.stationName}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.stationName?.message}
                </Form.Control.Feedback>
            </Form.Group>


            {/* Password Field */}
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                className="box"
                placeholder="******"
                {...register("password", { required: "Password is required" })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Submit Button */}
            <Button type="submit" className="w-100 btn-style gradient-text" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}
            </Button>
          </Form>

          {/* Register Link */}
          <div className="text-center mt-3">
            <p className="text-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none text-primary fw-bold">
                Sign up
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PoliceLogin;
