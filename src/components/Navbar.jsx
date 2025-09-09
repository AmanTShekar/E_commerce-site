// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducer/authSlice";

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#111" }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          🛍️ MyShop
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {["Home", "Product", "Contact", "Cart"].map((item) => (
              <li className="nav-item mx-2" key={item}>
                <Link
                  className="nav-link fw-bold btn btn-dark btn-lg px-4 py-2 rounded-pill text-light"
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  style={{
                    transition: "all 0.3s",
                    backgroundColor: "#1a1a1a",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
                >
                  {item}
                </Link>
              </li>
            ))}

            {!auth.isLoggedIn ? (
              <li className="nav-item mx-2">
                <Link
                  className="btn btn-warning btn-lg px-4 py-2 rounded-pill fw-bold text-dark"
                  to="/login"
                  style={{
                    background: "linear-gradient(135deg, #ffb347, #ffcc33)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#ffb347")}
                  onMouseLeave={(e) =>
                    (e.target.style.background = "linear-gradient(135deg, #ffb347, #ffcc33)")
                  }
                >
                  Login
                </Link>
              </li>
            ) : (
              <li className="nav-item dropdown ms-lg-3">
                <span
                  className="nav-link dropdown-toggle btn btn-dark btn-lg px-4 py-2 rounded-pill d-flex align-items-center text-light"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#1a1a1a",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
                >
                  👤 {auth.user?.name || "User"}
                </span>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span
                      className="dropdown-item"
                      onClick={() => navigate("/profile")}
                      style={{ cursor: "pointer" }}
                    >
                      Profile
                    </span>
                  </li>
                  <li>
                    <span
                      className="dropdown-item"
                      onClick={() => navigate("/orders")}
                      style={{ cursor: "pointer" }}
                    >
                      My Orders
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <span
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </span>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
