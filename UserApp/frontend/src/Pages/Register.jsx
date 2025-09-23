import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Spinner } from "react-bootstrap";
import AuthContext from "../context/authContext";
import { useContext } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const { registerUser } = useContext(AuthContext);

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
    };

    const result = await registerUser(userData);

    if (result.success) {
        toast.success("Register successfully.");
        navigate("/");
      
    } else {
      toast.error("Registration failed.");
      setError(result.message || "Registration failed.");
    }

    setIsLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-5 home-container">
      <div className="card shadow-lg p-4 box" style={{ width: "28rem" }}>
        <div className="card-body">
          <h1 className="text-center" style={{color: "#721a06ff"}}>Sign Up</h1>
          <p className="text-center text-muted">Create a new account</p>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-3">

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="john sharma"
                className={`form-control box ${errors.name ? "is-invalid" : ""}`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className={`form-control box ${errors.email ? "is-invalid" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            {/* Phone Number */}
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                placeholder="1234567890"
                className={`form-control box ${errors.phoneNumber ? "is-invalid" : ""}`}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                })}
              />
              {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber.message}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="******"
                className={`form-control box ${errors.password ? "is-invalid" : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d).{6,}$/,
                    message: "Password must contain at least one uppercase letter and one number",
                  },
                })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                placeholder="******"
                className={`form-control box ${errors.confirmPassword ? "is-invalid" : ""}`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
            </div>
            {/* Submit Button */}
            <div className="d-grid">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-style gradient-text"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          {/* Login Redirect */}
          <p className="text-center mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none text-primary fw-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
