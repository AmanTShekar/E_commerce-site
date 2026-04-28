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
      <div className={styles.emptyPage}>
        <motion.div {...fadeInUp} className={styles.emptyContent}>
          <ShoppingBag size={80} strokeWidth={1} />
          <h1>Your collection is empty.</h1>
          <p>Discover high-performance utility for your digital workspace.</p>
          <Link to="/discovery">
            <Button size="lg">Explore Discovery</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div {...fadeInUp} className={styles.header}>
          <h1 className={styles.title}>Your Collection</h1>
          <span className={styles.itemCount}>{cart.length} ITEMS READY FOR DEPLOYMENT</span>
        </motion.div>
        
        <div className={styles.layout}>
          <div className={styles.itemsSide}>
            <AnimatePresence>
              {cart.map(item => (
                <motion.div 
                  key={item.id} 
                  layout 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={styles.item}
                >
                  <div className={styles.itemImageWrapper}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <div>
                        <span className={styles.category}>Hardware</span>
                        <h3>{item.name}</h3>
                      </div>
                      <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className={styles.itemControls}>
                      <div className={styles.quantity}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                      <div className={styles.itemActions}>
                        <button className={styles.secondaryAction}><Heart size={16} /> Save for Later</button>
                      </div>
                      <p className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
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
