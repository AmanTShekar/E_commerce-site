import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login"); // Navigate to login page
  };

  const navItems = [
    { name: "Products", path: "/admin/ProductManager" },
    { name: "Categories", path: "/admin/CategoryManager" },
    { name: "Offers", path: "/admin/OfferManager" },
    { name: "Orders", path: "/admin/OrderManager" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg" style={{ minHeight: "80px" }}>
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4" to="/admin/products">
          Admin Panel
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {navItems.map((item) => (
              <li className="nav-item mx-1" key={item.name}>
                <NavLink
                  className={({ isActive }) =>
                    "nav-link px-3 py-2 rounded" + (isActive ? " bg-primary text-white" : " text-light")
                  }
                  to={item.path}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            className="btn btn-danger ms-lg-3 rounded-pill px-4 py-2 shadow-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
