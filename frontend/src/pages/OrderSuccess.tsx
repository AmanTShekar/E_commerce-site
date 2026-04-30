import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './OrderSuccess.module.css';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || `NX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  useEffect(() => {
    // Add confetti effect or sound if needed
  }, []);

  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.5 }
    })
  };

  return (
    <div className={styles.page}>
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className={styles.card}
      >
        <div className={styles.successIcon}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
          >
            <CheckCircle size={80} strokeWidth={1.5} color="#10b981" />
          </motion.div>
        </div>

        <motion.div custom={1} variants={itemVariants} className={styles.header}>
          <h1>Deployment Successful</h1>
          <p>Your hardware assets are being prepared for dispatch.</p>
        </motion.div>

        <motion.div custom={2} variants={itemVariants} className={styles.orderInfo}>
          <div className={styles.infoRow}>
            <span>Order Reference</span>
            <strong>{orderId}</strong>
          </div>
          <div className={styles.infoRow}>
            <span>Status</span>
            <span className={styles.statusBadge}>QUEUED FOR PICKUP</span>
          </div>
        </motion.div>

        <motion.div custom={3} variants={itemVariants} className={styles.visualFlow}>
          <div className={styles.flowItem}>
            <Package size={24} />
            <span>Processing</span>
          </div>
          <div className={styles.flowLine} />
          <div className={styles.flowItemDisabled}>
            <Package size={24} />
            <span>In Transit</span>
          </div>
        </motion.div>

        <motion.div custom={4} variants={itemVariants} className={styles.actions}>
          <Button size="lg" fullWidth onClick={() => navigate('/orders')}>
            View Deployment Hub <ArrowRight size={18} />
          </Button>
          <button className={styles.homeBtn} onClick={() => navigate('/')}>
            <Home size={18} /> Return to Store
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
