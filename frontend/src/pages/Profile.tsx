import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Settings, Heart, LogOut, Shield, CreditCard, Bell, MapPin, Search, Store, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Hooks & Context
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useProfileData } from '../hooks/useProfileData';
import { useToast } from '../hooks/useToast';

// UI & Utils
import styles from './Profile.module.css';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { fadePage, staggerContainer, fadeInUp } from '../utils/animations';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'profile' : 'orders');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { orders, loading: ordersLoading } = useProfileData();
  const { toast, showToast, hideToast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMoveToCart = async (item: any) => {
    await addToCart({ ...item, quantity: 1 });
    await removeFromWishlist(item.id);
    showToast(`${item.name} moved to deployment queue.`);
  };

  const menuItems = useMemo(() => {
    const baseItems = [
      { id: 'profile', icon: <User size={18} />, label: 'Studio Profile' },
      { id: 'security', icon: <Shield size={18} />, label: 'Encryption' },
      { id: 'settings', icon: <Settings size={18} />, label: 'System Prefs' },
    ];
    
    const consumerItems = [
      { id: 'orders', icon: <Package size={18} />, label: 'Deployments' },
      { id: 'wishlist', icon: <Heart size={18} />, label: 'Blueprint List' },
      { id: 'payments', icon: <CreditCard size={18} />, label: 'Financials' },
      { id: 'addresses', icon: <MapPin size={18} />, label: 'Coordinates' },
    ];

    const items = [...baseItems.slice(0, 1), ...consumerItems, ...baseItems.slice(1)];
    
    if (isDesktop) {
      if (user?.role === 'seller' || user?.role === 'admin') {
        items.push({ id: 'seller', icon: <Store size={18} />, label: 'Seller Hub' });
      }
      if (user?.role === 'admin') {
        items.push({ id: 'admin', icon: <ShieldCheck size={18} />, label: 'Command Center' });
      }
    }
    return items;
  }, [user?.role, isDesktop]);

  if (isAuthLoading) {
    return <div className="intrinsic-center" style={{ height: '100vh' }}>Initializing Session...</div>;
  }

  if (!user) {
    return (
      <div className="intrinsic-center" style={{ height: '100vh' }}>
        <motion.div {...fadeInUp} style={{ textAlign: 'center' }}>
          <Shield size={48} strokeWidth={1} style={{ marginBottom: '20px' }} />
          <h2>Access Restricted</h2>
          <p>Please initialize your session to view your profile.</p>
          <Button onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>Login</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.dashboardLayout}>
          
          {/* SIDEBAR NAVIGATION */}
          <aside className={styles.sidebar}>
            <div className={styles.userSection}>
              <div className={styles.avatarWrapper}>
                <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop'} alt={user.name} className={styles.avatar} />
                <div className={styles.onlineBadge} />
              </div>
              <div className={styles.userInfo}>
                <h2>{user.name}</h2>
                <span className={styles.userTier}>{user.role === 'admin' ? 'System Administrator' : user.role === 'seller' ? 'Verified Seller' : 'Platinum Member'}</span>
              </div>
            </div>

            <nav className={styles.sideNav}>
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                  onClick={() => {
                    if (item.id === 'seller') navigate('/seller');
                    else if (item.id === 'admin') navigate('/admin');
                    else setActiveTab(item.id);
                  }}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                  {activeTab === item.id && (
                    <motion.div layoutId="activeTabPill" className={styles.activePill} style={{ position: 'absolute', left: 0, width: '4px', height: '60%', background: 'var(--color-surface)', borderRadius: '0 4px 4px 0' }} />
                  )}
                </button>
              ))}
            </nav>

            <div className={styles.sidebarFooter}>
              <div className={styles.creditBox}>
                <span>Studio Credits</span>
                <strong>₹2,500</strong>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className={styles.mainContent}>
            <header className={styles.contentHeader}>
              <div className={styles.searchBox}>
                <Search size={16} />
                <input type="text" placeholder="Search orders, invoices..." />
              </div>
              <div className={styles.headerActions}>
                <Bell size={20} className={styles.notifIcon} />
                <div className={styles.divider} />
                <span className={styles.date}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} {...fadePage} className={styles.section}>
                
                {activeTab === 'orders' && (
                  <>
                    <div className={styles.titleArea}>
                      <h1>Recent Deployments</h1>
                      <div className={styles.filterGroup}>
                        <button className={styles.activeFilter}>All</button>
                        <button>In Transit</button>
                        <button>Completed</button>
                      </div>
                    </div>
                    
                    <motion.div className={styles.orderGrid} variants={staggerContainer} initial="initial" animate="whileInView">
                      {ordersLoading ? <p>Syncing deployments...</p> : orders.length === 0 ? <p>No deployments found.</p> : orders.map((order) => (
                        <motion.div key={order.id} className={styles.orderCard} variants={fadeInUp}>
                          <div className={styles.orderHeader}>
                            <div className={styles.orderId}>
                              <span className={styles.label}>ID</span>
                              <span className={styles.val}>#{order.id.slice(0,8)}</span>
                            </div>
                            <div className={styles.orderStatus}>
                              <div className={styles.statusDot} />
                              <span style={{textTransform: 'capitalize'}}>{order.status}</span>
                            </div>
                          </div>
                          
                          <div className={styles.orderContent}>
                            <div className={styles.productBrief}>
                              <div className={styles.productInfo}>
                                <h4>Deployment Total</h4>
                                <p>Payment: {order.paymentStatus}</p>
                              </div>
                              <div className={styles.priceInfo}>
                                <span>Amount</span>
                                <strong>₹{order.total.toLocaleString()}</strong>
                              </div>
                            </div>
                          </div>

                          <div className={styles.orderFooter}>
                            <div className={styles.deliveryInfo}>
                              <Package size={14} />
                              <span>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.btnGroup}>
                              <Button variant="outline" size="sm">Track</Button>
                              <Button size="sm">Invoice</Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </>
                )}

                {activeTab === 'wishlist' && (
                  <>
                    <div className={styles.titleArea}>
                      <h1>Blueprint List</h1>
                    </div>
                    <motion.div className={styles.orderGrid} variants={staggerContainer} initial="initial" animate="whileInView">
                       {wishlist.length === 0 ? <p>Your blueprint is empty.</p> : wishlist.map((item) => (
                         <motion.div key={item.id} className={styles.orderCard} variants={fadeInUp}>
                           <div className={styles.productBrief} style={{padding: '24px'}}>
                              <img src={item.image} style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)'}} alt={item.name} />
                              <div className={styles.productInfo}>
                                <h4>{item.name}</h4>
                                <p>₹{item.price.toLocaleString()}</p>
                                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{item.category}</span>
                              </div>
                              <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                                <Button size="sm" onClick={() => handleMoveToCart(item)}>Deploy</Button>
                                <Button size="sm" variant="outline" onClick={() => removeFromWishlist(item.id)}>Remove</Button>
                              </div>
                           </div>
                         </motion.div>
                       ))}
                    </motion.div>
                  </>
                )}

                {activeTab === 'profile' && (
                  <>
                    <div className={styles.titleArea}>
                      <h1>Studio Profile</h1>
                    </div>

                    {user.role === 'buyer' && (
                      <motion.div {...fadeInUp} className={styles.artisanBanner}>
                        <div className={styles.artisanInfo}>
                          <Store size={24} />
                          <div>
                            <h4>Become a NEXMART Artisan</h4>
                            <p>Unlock the Seller Studio and start deploying your own hardware assets.</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => navigate('/become-seller')}>Apply Now</Button>
                      </motion.div>
                    )}
                    
                    <div className={styles.profileGrid}>
                      <motion.div {...fadeInUp} className={styles.gridCard}>
                        <h3>Contact Information</h3>
                        <div className={styles.fieldList}>
                          <div className={styles.field}>
                            <label>Full Name</label>
                            <input type="text" defaultValue={user.name} />
                          </div>
                          <div className={styles.field}>
                            <label>Email Address</label>
                            <input type="email" defaultValue={user.email} />
                          </div>
                          <Button onClick={() => showToast('Identity protocols synchronized.')}>
                            Update Info
                          </Button>
                        </div>
                      </motion.div>

                      <motion.div {...fadeInUp} className={styles.gridCard}>
                        <h3>Activity Summary</h3>
                        <div className={styles.statsRow}>
                          <div className={styles.statBox}>
                            <span className={styles.statLabel}>Total Spent</span>
                            <span className={styles.statVal}>₹1.4L</span>
                          </div>
                          <div className={styles.statBox}>
                            <span className={styles.statLabel}>Total Assets</span>
                            <span className={styles.statVal}>{orders.length}</span>
                          </div>
                        </div>
                        <div className={styles.recentActivity}>
                          <h4>Recent Activity</h4>
                          <div className={styles.activityItem}>
                            <div className={styles.actDot} />
                            <p>Updated shipping address in <strong>Bangalore</strong></p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </>
                )}

                {activeTab === 'payments' && (
                  <>
                    <div className={styles.titleArea}>
                      <h1>Financial Hub</h1>
                    </div>
                    <div className={styles.profileGrid}>
                      <motion.div {...fadeInUp} className={styles.cardBox}>
                        <div className={styles.cardNumber}>•••• •••• •••• 8421</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <div style={{ fontSize: '10px', opacity: 0.6 }}>HOLDER</div>
                            <div style={{ fontWeight: 800 }}>{user?.name?.toUpperCase()}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', opacity: 0.6 }}>EXPIRES</div>
                            <div style={{ fontWeight: 800 }}>12/28</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </>
                )}

                {activeTab === 'seller' && (
                  <div className="intrinsic-center" style={{ minHeight: '400px' }}>
                    <motion.div {...fadeInUp} style={{ textAlign: 'center', maxWidth: '400px' }}>
                      <Store size={64} strokeWidth={1} style={{ marginBottom: '24px' }} />
                      <h2>Seller Studio</h2>
                      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>Manage your artisan hardware deployments and inventory records from the central studio dashboard.</p>
                      <Button size="lg" onClick={() => navigate('/seller')}>
                        Open Studio Dashboard <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                      </Button>
                    </motion.div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <Toast 
        isVisible={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={hideToast} 
      />
    </div>
  );
};

export default Profile;
