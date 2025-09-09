// App.jsx
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  Home,
  Product,
  Products,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
} from './pages';

import AdminPanel from './pages/AdminPanel';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminNavbar from './components/admin/AdminNavbar';

const App = () => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  const isAdmin = auth?.isLoggedIn && auth?.userType === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin');

  // =========================
  // PrivateRoute Wrappers
  // =========================
  const AdminRoute = ({ children }) => {
    return isAdmin ? children : <PageNotFound />;
  };

  const UserRoute = ({ children }) => {
    return auth?.isLoggedIn && auth?.userType !== 'admin' ? children : <Navigate to="/login" />;
  };

  // Redirect logged-in users from login/register pages
  const RedirectIfLoggedIn = ({ children }) => {
    return auth?.isLoggedIn ? <Navigate to={isAdmin ? '/admin' : '/'} /> : children;
  };

  return (
    <>
      <ScrollToTop>
        {/* Conditional Navbar */}
        {isAdmin && isAdminRoute ? <AdminNavbar /> : <Navbar />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <Login />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfLoggedIn>
                <Register />
              </RedirectIfLoggedIn>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={
              <UserRoute>
                <Checkout />
              </UserRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        {/* Footer hidden in admin routes */}
        {!isAdminRoute && <Footer />}
      </ScrollToTop>
    </>
  );
};

export default App;
