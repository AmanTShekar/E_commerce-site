import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Zap,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import CartItem from '../components/ui/CartItem';
import EmptyState from '../components/ui/EmptyState';
import { fadeInUp, staggerContainer } from '../utils/animations';
import styles from './Cart.module.css';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <EmptyState 
            type="cart" 
            title="Your collection is a blank slate." 
            message="No high-performance assets have been added to your current session. Discover purposeful hardware and furniture."
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className={styles.page}
    >
      {/* MOBILE STICKY CHECKOUT BAR */}
      <div className={`${styles.stickyCheckout} mobile-only`}>
        <div className={styles.stickyContainer}>
          <div className={styles.stickyTotal}>
            <span>TOTAL ALLOCATION</span>
            <h3>₹{total.toLocaleString()}</h3>
          </div>
          <button className={styles.stickyBtn} onClick={() => navigate('/checkout')}>
            Finalize Deployment
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <motion.div variants={fadeInUp} className={styles.header}>
          <h1 className={styles.title}>Your Collection</h1>
          <span className={styles.itemCount}>{cart.length} ASSETS READY FOR DEPLOYMENT</span>
        </motion.div>
        
        <div className={styles.layout}>
          <div className={styles.itemsSide}>
            <motion.div variants={staggerContainer} className={styles.cartList}>
              <AnimatePresence mode="popLayout">
                {cart.map(item => (
                  <motion.div 
                    key={item.id}
                    variants={fadeInUp}
                    layout
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <CartItem 
                      item={item}
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fadeInUp} className={styles.trustStrip}>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><ShieldCheck size={20} /></div>
                <div className={styles.trustContent}>
                  <strong>Secure Protocol</strong>
                  <span>Encrypted Transaction</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><Truck size={20} /></div>
                <div className={styles.trustContent}>
                  <strong>Priority Logistics</strong>
                  <span>Expedited Deployment</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><RotateCcw size={20} /></div>
                <div className={styles.trustContent}>
                  <strong>Evaluation Period</strong>
                  <span>30-Day Recalibration</span>
                </div>
              </div>
            </motion.div>
          </div>

          <aside className={styles.summarySide}>
            <motion.div variants={fadeInUp} className={styles.couponCard}>
              <div className={styles.couponHeader}>
                <Zap size={16} fill="currentColor" />
                <span>Yield Optimization</span>
              </div>
              <button className={styles.couponBtn}>APPLY PROTOCOL</button>
            </motion.div>

            <motion.div variants={fadeInUp} className={styles.summaryCard}>
              <h2>Allocation Summary ({cart.length} Units)</h2>
              <div className={styles.summaryRows}>
                <div className={styles.row}>
                  <span>Gross Asset Value</span>
                  <span>₹{(total * 1.2).toLocaleString()}</span>
                </div>
                <div className={styles.row}>
                  <span>Yield Discount</span>
                  <span className={styles.discount}>-₹{(total * 0.2).toLocaleString()}</span>
                </div>
                <div className={styles.row}>
                  <span>Network Processing</span>
                  <span>₹29</span>
                </div>
                <div className={styles.row}>
                  <span>Logistics Protocol</span>
                  <div className={styles.shippingBox}>
                    <span className={styles.oldPrice}>₹99</span>
                    <span className={styles.free}>FREE</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.divider} />
              
              <div className={`${styles.row} ${styles.totalRow}`}>
                <span>Net Total Allocation</span>
                <span>₹{(total + 29).toLocaleString()}</span>
              </div>
              
              <div className={styles.savingsStrip}>
                Yield Savings: ₹{(total * 0.2).toLocaleString()} secured for this session
              </div>

              <Button size="lg" className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                Finalize Deployment <ArrowRight size={18} />
              </Button>

              <div className={styles.paymentBadges}>
                <CreditCard size={14} />
                <span>Encrypted 256-bit Payment Gateway</span>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
