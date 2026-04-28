import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, User, ChevronDown, 
  Package, Heart, LogOut, Settings, CreditCard, Menu, X 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

// Hooks
import { useScrollPosition } from '../../hooks/useScrollPosition';

const Navbar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isScrolled = useScrollPosition(20);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  const mockSuggestions = [
    'Mechanical Keyboards',
    'Studio Monitors',
    'Ergonomic Desks',
    'Audio Interfaces',
    'Pro Studio Cables'
  ].filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>NEXMART</Link>
          <div className={`${styles.navLinks} desktop-only`}>
            <Link to="/discovery" className={styles.navLink}>Discovery</Link>
          </div>
        </div>

        <div className={`${styles.center} desktop-only`}>
          <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search for aesthetic utility..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            
            <AnimatePresence>
              {showSuggestions && searchTerm.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={styles.suggestions}
                >
                  {mockSuggestions.length > 0 ? (
                    mockSuggestions.map((s, i) => (
                      <div 
                        key={i} 
                        className={styles.suggestionItem}
                        onClick={() => {
                          setSearchTerm(s);
                          navigate(`/search?q=${encodeURIComponent(s)}`);
                        }}
                      >
                        <Search size={14} />
                        <span>{s}</span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noSuggestions}>No assets found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        <div className={styles.right}>
          <div 
            className={styles.loginWrapper}
            onMouseEnter={() => setIsLoginOpen(true)}
            onMouseLeave={() => setIsLoginOpen(false)}
          >
            <div className={styles.navItem} onClick={() => navigate(user ? '/profile' : '/login')}>
              <User size={20} />
              <span className="desktop-only">{user ? user.name.split(' ')[0] : 'Login'}</span>
              <ChevronDown className={`desktop-only ${styles.chevron} ${isLoginOpen ? styles.active : ''}`} size={16} />
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
                    <span>{user ? 'Hello!' : 'New customer?'}</span>
                    <Link to="/login" className={styles.signupLink}>{user ? 'Switch Account' : 'Sign Up'}</Link>
                  </div>
                  <div className={styles.divider} />
                  <button className={styles.dropdownItem} onClick={() => navigate('/profile')}>
                    <User size={16} /> My Profile
                  </button>
                  <button className={styles.dropdownItem} onClick={() => navigate('/orders')}>
                    <Package size={16} /> Orders
                  </button>
                  <button className={styles.dropdownItem} onClick={() => navigate('/wishlist')}>
                    <Heart size={16} /> Wishlist
                  </button>
                  <button className={styles.dropdownItem} onClick={() => navigate('/rewards')}>
                    <CreditCard size={16} /> Rewards
                  </button>
                  <div className={styles.divider} />
                  <button className={styles.dropdownItem} onClick={() => navigate('/settings')}>
                    <Settings size={16} /> Settings
                  </button>
                  {user && (
                    <button className={styles.dropdownItem} onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/cart" className={styles.navItem}>
            <div className={styles.cartIconWrapper}>
              <ShoppingBag size={20} />
              <span className={styles.badge}>{cart.length}</span>
            </div>
            <span className="desktop-only">Cart</span>
          </Link>

          <button className={`${styles.mobileSearchBtn} mobile-only`} onClick={() => setIsSearchOpen(true)}>
            <Search size={24} />
          </button>

          <button className={`${styles.mobileMenuBtn} mobile-only`} onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.overlay}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={styles.drawer}
            >
              <div className={styles.drawerHeader}>
                <div className={styles.logo}>NEXMART</div>
                <button onClick={() => setIsMenuOpen(false)} className={styles.closeBtn}>
                  <X size={24} />
                </button>
              </div>

              <div className={styles.drawerContent}>
                <div className={styles.drawerSection}>
                  <h4>Marketplace</h4>
                  <Link to="/discovery" onClick={() => setIsMenuOpen(false)}>Discovery</Link>
                  <Link to="/search" onClick={() => setIsMenuOpen(false)}>Featured</Link>
                  <Link to="/search?category=Hardware" onClick={() => setIsMenuOpen(false)}>Hardware</Link>
                  <Link to="/search?category=Audio" onClick={() => setIsMenuOpen(false)}>Audio</Link>
                </div>

                <div className={styles.drawerSection}>
                  <h4>Account</h4>
                  {user ? (
                    <>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile Settings</Link>
                      <Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link>
                      <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
                      <button className={styles.drawerLogout} onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login / Sign Up</Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* MOBILE SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={styles.searchOverlay}
          >
            <div className={styles.overlayHeader}>
              <button onClick={() => setIsSearchOpen(false)} className={styles.backBtn}>
                <ChevronDown size={24} style={{ transform: 'rotate(90deg)' }} />
              </button>
              <form className={styles.overlayForm} onSubmit={handleSearchSubmit}>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              {searchTerm && <X size={20} onClick={() => setSearchTerm('')} />}
            </div>
            
            <div className={styles.overlayContent}>
              <div className={styles.recentTitle}>Trending Searches</div>
              <div className={styles.trendList}>
                {['Mechanical Keyboards', 'Monitors', 'Audio', 'Laptops'].map(t => (
                  <div key={t} className={styles.trendItem} onClick={() => {
                    setSearchTerm(t);
                    navigate(`/search?q=${t}`);
                    setIsSearchOpen(false);
                  }}>
                    <Search size={14} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
