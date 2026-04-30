import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import MobileNav from './components/layout/MobileNav';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Cart from './pages/Cart';
import ScrollToTop from './components/ui/ScrollToTop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import SearchPage from './pages/Search';
import Rewards from './pages/Rewards';
import Settings from './pages/Settings';
import SellerDashboard from './pages/SellerDashboard';
import AdminHub from './pages/AdminHub';
import BecomeSeller from './pages/BecomeSeller';
import { Privacy, Terms } from './pages/Legal';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Maintenance from './pages/Maintenance';
import { useSystemStatus } from './hooks/useSystemStatus';

function AppContent() {
  const { shouldBlock, loading } = useSystemStatus();

  if (loading) return null;

  if (shouldBlock) {
    return (
      <div className="app-container">
        <Maintenance />
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <MobileNav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/admin" element={<AdminHub />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
