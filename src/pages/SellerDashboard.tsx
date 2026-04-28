import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Plus, Search, Filter, ArrowUpRight, TrendingUp, MoreHorizontal
} from 'lucide-react';
import Button from '../components/ui/Button';
import styles from './SellerDashboard.module.css';

const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Revenue', value: '₹1,24,500', change: '+12.5%', icon: <BarChart3 size={20} /> },
    { label: 'Active Orders', value: '18', change: '+2', icon: <ShoppingCart size={20} /> },
    { label: 'Products', value: '42', change: '0', icon: <Package size={20} /> },
    { label: 'Store Rating', value: '4.9', change: '+0.1', icon: <TrendingUp size={20} /> },
  ];

  const recentOrders = [
    { id: '#ORD-7721', customer: 'John Doe', product: 'Mojo One Keyboard', status: 'Shipped', amount: '₹18,499' },
    { id: '#ORD-7722', customer: 'Sarah Miller', product: 'Zen Audio Hub', status: 'Processing', amount: '₹12,500' },
    { id: '#ORD-7723', customer: 'Mike Ross', product: 'Studio Monitor V2', status: 'Pending', amount: '₹42,000' },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Seller Studio</h1>
            <p className={styles.subtitle}>Welcome back, Obsidian Hardware.</p>
          </div>
          <Button size="lg">
            <Plus size={20} /> List New Product
          </Button>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              {...fadeInUp} 
              transition={{ delay: i * 0.1 }}
              className={styles.statCard}
            >
              <div className={styles.statHeader}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <span className={styles.statChange}>{stat.change}</span>
              </div>
              <span className={styles.statLabel}>{stat.label}</span>
              <h3 className={styles.statValue}>{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className={styles.mainGrid}>
          {/* Recent Orders */}
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Active Deployments</h3>
              <button className={styles.viewAll}>View All</button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={i}>
                      <td className={styles.orderId}>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td>
                        <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={styles.amount}>{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Actions / Performance */}
          <motion.div {...fadeInUp} transition={{ delay: 0.5 }} className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Studio Performance</h3>
              <MoreHorizontal size={18} />
            </div>
            <div className={styles.chartPlaceholder}>
              <div className={styles.barGroup}>
                {[60, 80, 45, 90, 70, 85].map((h, i) => (
                  <div key={i} className={styles.bar} style={{ height: `${h}%` }} />
                ))}
              </div>
              <p>Weekly Sales Growth</p>
            </div>
            <div className={styles.actionList}>
              <div className={styles.actionItem}>
                <span>Low Stock Alert: Mojo V1</span>
                <ArrowUpRight size={16} />
              </div>
              <div className={styles.actionItem}>
                <span>New Review Received</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
