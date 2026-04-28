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
  Heart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import CartItem from '../components/ui/CartItem';
import EmptyState from '../components/ui/EmptyState';
import styles from './Cart.module.css';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

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
    <div className={styles.page}>
      {/* MOBILE STICKY CHECKOUT BAR - Flipkart Style */}
      <div className={`${styles.stickyCheckout} mobile-only`}>
        <div className={styles.stickyContainer}>
          <div className={styles.stickyTotal}>
            <span>Total Amount</span>
            <h3>₹{total.toLocaleString()}</h3>
          </div>
          <button className={styles.stickyBtn} onClick={() => navigate('/checkout')}>
            Place Order
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <motion.div {...fadeInUp} className={styles.header}>
          <h1 className={styles.title}>Your Collection</h1>
          <span className={styles.itemCount}>{cart.length} ITEMS READY FOR DEPLOYMENT</span>
        </motion.div>
        
        <div className={styles.layout}>
          <div className={styles.itemsSide}>
            <AnimatePresence>
              {cart.map(item => (
                <CartItem 
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </AnimatePresence>

            <div className={styles.trustStrip}>
              <div className={styles.trustItem}>
                <ShieldCheck size={20} />
                <span>Secure Checkout</span>
              </div>
              <div className={styles.trustItem}>
                <Truck size={20} />
                <span>Fast Deployment</span>
              </div>
              <div className={styles.trustItem}>
                <RotateCcw size={20} />
                <span>30-Day Evaluation</span>
              </div>
            </div>
          </div>

          <aside className={styles.summarySide}>
            <div className={styles.summaryCard}>
              <h2>Order Summary</h2>
              <div className={styles.summaryRows}>
                <div className={styles.row}>
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className={styles.row}>
                  <span>Standard Shipping</span>
                  <span className={styles.free}>COMPLIMENTARY</span>
                </div>
                <div className={styles.row}>
                  <span>Estimated Tax</span>
                  <span>₹0.00</span>
                </div>
              </div>
              <div className={styles.divider} />
              <div className={`${styles.row} ${styles.totalRow}`}>
                <span>Estimated Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <Button size="lg" className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight size={18} />
              </Button>
              <p className={styles.summaryNote}>
                Shipping and taxes calculated at checkout.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
