import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, User, ChevronDown, 
  Package, Heart, LogOut, Settings, CreditCard, ShieldCheck, Store
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const SearchComponent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          ref={!isMobile ? searchInputRef : null}
          type="text" 
          placeholder="Search for hardware, audio, furniture..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </div>
      
      <AnimatePresence>
        {showSuggestions && searchTerm.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={styles.suggestions}
          >
            {mockSuggestions.length > 0 ? (
              mockSuggestions.map((s, i) => (
                <div 
                  key={i} 
                  className={styles.suggestionItem}
                  onMouseDown={() => {
                    setSearchTerm(s);
                    navigate(`/search?q=${encodeURIComponent(s)}`);
                    setShowSuggestions(false);
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
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* TOP ROW */}
        <div className={styles.topRow}>
          <div className={styles.left}>
            <Link to="/" className={styles.logo}>NEXMART</Link>
          </div>

          <div className={`${styles.desktopSearch} desktop-only`}>
            <SearchComponent />
          </div>

          <div className={styles.right}>
            <div 
              className={`${styles.loginWrapper} desktop-only`}
              onMouseEnter={() => setIsLoginOpen(true)}
              onMouseLeave={() => setIsLoginOpen(false)}
            >
              <div className={styles.navItem} onClick={() => navigate(user ? '/profile' : '/login')}>
                <User size={20} />
                <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
                <ChevronDown className={`${styles.chevron} ${isLoginOpen ? styles.active : ''}`} size={16} />
              </div>

              <AnimatePresence>
                {isLoginOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
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

                    {user?.role === 'admin' && (
                      <button className={styles.dropdownItem} onClick={() => navigate('/admin')}>
                        <ShieldCheck size={16} /> Command Center
                      </button>
                    )}

                    {(user?.role === 'seller' || user?.role === 'admin') && (
                      <button className={styles.dropdownItem} onClick={() => navigate('/seller')}>
                        <Store size={16} /> Seller Studio
                      </button>
                    )}

                    <button className={styles.dropdownItem} onClick={() => navigate('/orders')}>
                      <Package size={16} /> My Orders
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

          </div>
        </div>

        {/* BOTTOM ROW (MOBILE SEARCH) */}
        <div className={`${styles.mobileSearchRow} mobile-only`}>
          <SearchComponent isMobile={true} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
