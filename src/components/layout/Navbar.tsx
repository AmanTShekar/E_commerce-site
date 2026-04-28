import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, User, ChevronDown, 
  Package, Heart, LogOut, Settings, CreditCard 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>NEXMART</Link>
          <div className={styles.navLinks}>
            <Link to="/discovery" className={styles.navLink}>Discovery</Link>
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} size={18} />
            <input type="text" placeholder="Search for aesthetic utility..." />
          </div>
        </div>

        <div className={styles.right}>
          <div 
            className={styles.loginWrapper}
            onMouseEnter={() => setIsLoginOpen(true)}
            onMouseLeave={() => setIsLoginOpen(false)}
          >
            <div className={styles.navItem} onClick={() => navigate('/login')}>
              <User size={20} />
              <span>Login</span>
              <ChevronDown className={`${styles.chevron} ${isLoginOpen ? styles.active : ''}`} size={16} />
            </div>

            <AnimatePresence>
              {isLoginOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={styles.dropdown}
                >
                  <div className={styles.dropdownHeader}>
                    <span>New customer?</span>
                    <Link to="/login" className={styles.signupLink}>Sign Up</Link>
                  </div>
                  <div className={styles.divider} />
                  <button className={styles.dropdownItem} onClick={() => navigate('/profile')}>
                    <User size={16} /> My Profile
                  </button>
                  <button className={styles.dropdownItem}>
                    <Package size={16} /> Orders
                  </button>
                  <button className={styles.dropdownItem}>
                    <Heart size={16} /> Wishlist
                  </button>
                  <button className={styles.dropdownItem}>
                    <CreditCard size={16} /> Rewards
                  </button>
                  <div className={styles.divider} />
                  <button className={styles.dropdownItem}>
                    <Settings size={16} /> Settings
                  </button>
                  <button className={styles.dropdownItem}>
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/cart" className={styles.navItem}>
            <div className={styles.cartIconWrapper}>
              <ShoppingBag size={20} />
              <span className={styles.badge}>{cart.length}</span>
            </div>
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
