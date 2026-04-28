import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Settings, Heart, LogOut, Shield, CreditCard, Bell, MapPin, Search
} from 'lucide-react';
import styles from './Profile.module.css';
import Button from '../components/ui/Button';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const user = {
    name: 'Alex Obsidian',
    email: 'alex@studio.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop',
    joined: 'January 2024',
    tier: 'Platinum Member',
    credits: '₹2,500'
  };

  const menuItems = [
    { id: 'profile', icon: <User size={18} />, label: 'Studio Profile' },
    { id: 'orders', icon: <Package size={18} />, label: 'Deployments' },
    { id: 'wishlist', icon: <Heart size={18} />, label: 'Blueprint List' },
    { id: 'payments', icon: <CreditCard size={18} />, label: 'Financials' },
    { id: 'addresses', icon: <MapPin size={18} />, label: 'Coordinates' },
    { id: 'security', icon: <Shield size={18} />, label: 'Encryption' },
    { id: 'settings', icon: <Settings size={18} />, label: 'System Prefs' },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.dashboardLayout}>
          
          {/* SIDEBAR NAVIGATION */}
          <aside className={styles.sidebar}>
            <div className={styles.userSection}>
              <div className={styles.avatarWrapper}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <div className={styles.onlineBadge} />
              </div>
              <div className={styles.userInfo}>
                <h2>{user.name}</h2>
                <span className={styles.userTier}>{user.tier}</span>
              </div>
            </div>

            <nav className={styles.sideNav}>
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                  {activeTab === item.id && <motion.div layoutId="activeTab" className={styles.activePill} />}
                </button>
              ))}
            </nav>

            <div className={styles.sidebarFooter}>
              <div className={styles.creditBox}>
                <span>Studio Credits</span>
                <strong>{user.credits}</strong>
              </div>
              <button className={styles.logoutBtn}>
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
                <span className={styles.date}>April 28, 2024</span>
              </div>
            </header>

            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div key="orders" {...fadeInUp} className={styles.section}>
                  <div className={styles.titleArea}>
                    <h1>Recent Deployments</h1>
                    <div className={styles.filterGroup}>
                      <button className={styles.activeFilter}>All</button>
                      <button>In Transit</button>
                      <button>Completed</button>
                    </div>
                  </div>
                  
                  <div className={styles.orderGrid}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div className={styles.orderId}>
                            <span className={styles.label}>ID</span>
                            <span className={styles.val}>#NX-00{i}842</span>
                          </div>
                          <div className={styles.orderStatus}>
                            <div className={styles.statusDot} />
                            <span>Shipped</span>
                          </div>
                        </div>
                        
                        <div className={styles.orderContent}>
                          <div className={styles.productBrief}>
                            <div className={styles.productImg} />
                            <div className={styles.productInfo}>
                              <h4>Mojo One Mechanical Keyboard</h4>
                              <p>Studio Edition • Gray/White</p>
                              <span className={styles.itemCount}>Qty: 01</span>
                            </div>
                            <div className={styles.priceInfo}>
                              <span>Amount</span>
                              <strong>₹18,499</strong>
                            </div>
                          </div>
                        </div>

                        <div className={styles.orderFooter}>
                          <div className={styles.deliveryInfo}>
                            <Package size={14} />
                            <span>Estimated Delivery: Oct {15+i}, 2024</span>
                          </div>
                          <div className={styles.btnGroup}>
                            <Button variant="outline" size="sm">Track</Button>
                            <Button size="sm">Invoice</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div key="profile" {...fadeInUp} className={styles.section}>
                  <div className={styles.titleArea}>
                    <h1>Studio Profile</h1>
                  </div>
                  
                  <div className={styles.profileGrid}>
                    <div className={styles.gridCard}>
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
                        <div className={styles.field}>
                          <label>Phone Number</label>
                          <input type="tel" defaultValue="+91 98765 43210" />
                        </div>
                        <Button className={styles.saveBtn}>Update Info</Button>
                      </div>
                    </div>

                    <div className={styles.gridCard}>
                      <h3>Activity Summary</h3>
                      <div className={styles.statsRow}>
                        <div className={styles.statBox}>
                          <span className={styles.statLabel}>Total Spent</span>
                          <span className={styles.statVal}>₹1.4L</span>
                        </div>
                        <div className={styles.statBox}>
                          <span className={styles.statLabel}>Avg Order</span>
                          <span className={styles.statVal}>₹12K</span>
                        </div>
                      </div>
                      <div className={styles.recentActivity}>
                        <h4>Recent Activity</h4>
                        <div className={styles.activityItem}>
                          <div className={styles.actDot} />
                          <p>Updated shipping address in <strong>Bangalore</strong></p>
                          <span>2 days ago</span>
                        </div>
                        <div className={styles.activityItem}>
                          <div className={styles.actDot} />
                          <p>Added <strong>Studio Monitor V2</strong> to blueprints</p>
                          <span>5 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div key="payments" {...fadeInUp} className={styles.section}>
                  <div className={styles.titleArea}>
                    <h1>Financials</h1>
                  </div>
                  <div className={styles.paymentList}>
                    <div className={styles.cardBox}>
                      <div className={styles.cardHeader}>
                        <CreditCard size={24} />
                        <span className={styles.cardType}>Primary</span>
                      </div>
                      <div className={styles.cardNumber}>•••• •••• •••• 8421</div>
                      <div className={styles.cardFooter}>
                        <div className={styles.cardOwner}>ALEX OBSIDIAN</div>
                        <div className={styles.cardExpiry}>08/26</div>
                      </div>
                    </div>
                    <button className={styles.addCardBtn}>+ Add New Method</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Profile;
