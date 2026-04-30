import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, ChevronRight, ExternalLink, Calendar, CreditCard, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  paymentStatus: string;
  shippingCity: string;
  createdAt: string;
}

const Orders: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('nexmart_token');
        const response = await fetch('http://127.0.0.1:8788/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isAuthLoading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Initializing Session...</div>;
  if (!user) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Session Required.</div>;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Synchronizing Deployment Records...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div {...fadeInUp} className={styles.header}>
          <div className={styles.titleArea}>
            <Package size={32} />
            <h1>Deployment History</h1>
          </div>
          <p>Track your studio acquisitions and hardware deployments across the global marketplace.</p>
        </motion.div>

        <div className={styles.orderGrid}>
          {orders.length > 0 ? (
            orders.map((order, i) => (
              <motion.div 
                key={order.id}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className={styles.orderCard}
              >
                <div className={styles.orderHeader}>
                  <div className={styles.orderId}>
                    <span>DEPLOYMENT ID</span>
                    <h4>{order.id.split('-')[0].toUpperCase()}</h4>
                  </div>
                  <div className={styles.orderMeta}>
                    <div className={styles.metaItem}>
                      <Calendar size={14} />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <CreditCard size={14} />
                      <span>{order.paymentStatus.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className={`${styles.statusBadge} ${styles[order.status]}`}>
                    {order.status === 'delivered' ? <CheckCircle2 size={14} /> : <Truck size={14} />}
                    {order.status.toUpperCase()}
                  </div>
                </div>

                <div className={styles.orderBody}>
                  <div className={styles.orderSummary}>
                    <div className={styles.totalBlock}>
                      <span>TOTAL ACQUISITION</span>
                      <h3>₹{order.total.toLocaleString()}</h3>
                    </div>
                    <div className={styles.locationBlock}>
                      <span>DESTINATION</span>
                      <p>{order.shippingCity || 'Studio Node'}</p>
                    </div>
                  </div>
                  <div className={styles.orderActions}>
                    <Button variant="secondary" size="sm">Track Payload</Button>
                    <Button variant="ghost" size="sm">
                      Details <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState 
              type="orders"
              title="No active deployments."
              message="Your studio history is currently clear. Initialize your first acquisition from our curated hardware catalog."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
