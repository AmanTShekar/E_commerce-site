import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here
    alert("Registration feature coming soon!");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #1a1a1a, #111111)",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div
        className="p-5"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(15px)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 className="text-center text-white mb-4 fw-bold">Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label text-white fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control rounded-pill px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
              required
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white fw-semibold">Email</label>
            <input
              type="email"
              className="form-control rounded-pill px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-white fw-semibold">Password</label>
            <input
              type="password"
              className="form-control rounded-pill px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            />
          </div>

          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn btn-dark btn-lg rounded-pill fw-bold"
              style={{
                background: "linear-gradient(90deg, #4b6cb7, #182848)",
                border: "none",
                transition: "all 0.3s ease",
              }}
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-center text-white-50">
          Already have an account?{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
