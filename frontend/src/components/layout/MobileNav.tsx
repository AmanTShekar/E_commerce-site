import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './MobileNav.module.css';

const MobileNav: React.FC = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className={`${styles.mobileNav} mobile-only`}>
      <NavLink to="/discovery" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <Search size={20} />
        <span>Categories</span>
      </NavLink>
      <NavLink to="/" className={({ isActive }) => `${styles.navItem} ${styles.centerItem} ${isActive ? styles.active : ''}`}>
        <div className={styles.centerIconWrapper}>
          <Home size={24} />
        </div>
        <span>Nexus</span>
      </NavLink>
      <NavLink to={user ? "/profile" : "/login"} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
        <User size={20} />
        <span>{user ? 'Profile' : 'Login'}</span>
      </NavLink>
    </div>
  );
};

export default MobileNav;
