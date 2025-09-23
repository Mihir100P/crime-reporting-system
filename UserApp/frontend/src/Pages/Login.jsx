import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import AuthContext from "../context/authContext";
import { toast } from "react-toastify";

const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setError("");

    const result = await loginUser(formData.email, formData.password);

    if (result.success) {
        toast.success("Login successfully.");
        navigate("/");
    } else {
      toast.error("Login failed. Please try again.");
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
            {/* Email Field */}
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                className="box"
                placeholder="example@gmail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
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
            <Button type="submit" className="btn btn-style gradient-text w-100" disabled={isLoading}>
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

export default Login;
