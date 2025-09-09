import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/reducer/authSlice";
import { API_BASE } from "../utils/config";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (auth?.isLoggedIn) {
      navigate(auth.userType === "admin" ? "/admin" : "/");
    }
  }, [auth, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      const payload = { user: { username: data.username }, userType: data.role };

      dispatch(loginSuccess(payload));
      localStorage.setItem(
        "auth",
        JSON.stringify({ isLoggedIn: true, user: { username: data.username }, userType: data.role })
      );
      navigate(data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: "linear-gradient(135deg, #1a1a1a, #111111)", fontFamily: "Montserrat, sans-serif" }}>
      <div className="p-5" style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(15px)", borderRadius: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.7)", width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center text-white mb-4 fw-bold">Welcome Back</h2>
        <form onSubmit={handleLogin}>
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
            <button type="submit" className="btn btn-dark btn-lg rounded-pill fw-bold" style={{ background: "linear-gradient(90deg, #4b6cb7, #182848)", border: "none", transition: "all 0.3s ease" }}>
              Login
            </button>
          </div>
        </form>
        <p className="text-center text-white-50">
          Don't have an account?{" "}
          <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
