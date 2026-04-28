import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Truck, ShieldCheck, CheckCircle, 
  ArrowLeft, Lock, Info, Plus, Smartphone,
  Building2, Wallet
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './Checkout.module.css';
import { useCart } from '../context/CartContext';

const Checkout: React.FC = () => {
  const [step, setStep] = useState(1);
  const { cart, total } = useCart();
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  const gst = total * 0.18;
  const grandTotal = total + gst;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/cart" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Return to Collection</span>
          </Link>
          <div className={styles.logo}>NEXMART</div>
          <div className={styles.secureBadge}>
            <Lock size={14} />
            <span>Secure 256-bit SSL</span>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Form Side */}
          <div className={styles.formSide}>
            <div className={styles.steps}>
              <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
                <span className={styles.stepNum}>01</span> SHIPPING
              </div>
              <div className={styles.stepLine} />
              <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
                <span className={styles.stepNum}>02</span> PAYMENT
              </div>
              <div className={styles.stepLine} />
              <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
                <span className={styles.stepNum}>03</span> REVIEW
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" {...fadeInUp} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2>Shipping Details</h2>
                    <p>Enter your deployment coordinates.</p>
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <input type="email" placeholder="artisan@studio.com" />
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>First Name</label>
                      <input type="text" placeholder="John" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Last Name</label>
                      <input type="text" placeholder="Doe" />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Street Address</label>
                    <input type="text" placeholder="Architectural Plaza, Studio 404" />
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>City</label>
                      <input type="text" placeholder="Mumbai" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Postal Code</label>
                      <input type="text" placeholder="400001" />
                    </div>
                  </div>

                  <Button size="lg" className={styles.submitBtn} onClick={() => setStep(2)}>
                    Proceed to Payment
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" {...fadeInUp} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2>Payment Method</h2>
                    <p>Select your preferred transaction protocol.</p>
                  </div>

                  <div className={styles.paymentOptions}>
                    <div className={`${styles.paymentBox} ${styles.activePayment}`}>
                      <CreditCard size={24} />
                      <div className={styles.paymentInfo}>
                        <h4>Credit / Debit Card</h4>
                        <span>Visa, Mastercard, Amex</span>
                      </div>
                      <div className={styles.radio} />
                    </div>
                    
                    <div className={styles.paymentBox}>
                      <Smartphone size={24} />
                      <div className={styles.paymentInfo}>
                        <h4>UPI / QR Code</h4>
                        <span>GPay, PhonePe, Paytm</span>
                      </div>
                    </div>

                    <div className={styles.paymentBox}>
                      <Building2 size={24} />
                      <div className={styles.paymentInfo}>
                        <h4>Net Banking</h4>
                        <span>All Indian Banks</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardDetails}>
                    <div className={styles.inputGroup}>
                      <label>Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label>Expiry Date</label>
                        <input type="text" placeholder="MM/YY" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>CVV</label>
                        <input type="password" placeholder="***" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.footerBtns}>
                    <button className={styles.backBtn} onClick={() => setStep(1)}>Back</button>
                    <Button size="lg" className={styles.submitBtn} onClick={() => setStep(3)}>
                      Review Order
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" {...fadeInUp} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2>Order Review</h2>
                    <p>Validate your selection before final deployment.</p>
                  </div>

                  <div className={styles.reviewSection}>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Shipping to</span>
                      <p>John Doe, Mumbai 400001</p>
                    </div>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Payment</span>
                      <p>Visa ending in 4242</p>
                    </div>
                  </div>

                  <div className={styles.finalTotal}>
                    <span>Final Amount</span>
                    <h3>₹{grandTotal.toLocaleString()}</h3>
                  </div>

                  <Button size="lg" className={styles.placeOrderBtn} onClick={() => navigate('/profile')}>
                    Complete Deployment <CheckCircle size={20} />
                  </Button>
                  <button className={styles.backBtn} onClick={() => setStep(2)}>Modify Payment</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Side */}
          <div className={styles.summarySide}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <h3>Order Brief</h3>
                <Link to="/cart" className={styles.editLink}>Edit</Link>
              </div>

              <div className={styles.itemList}>
                {cart.map(item => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemThumb}>
                      <img src={item.image} alt={item.name} />
                      <span className={styles.badge}>{item.quantity}</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <h4>{item.name}</h4>
                      <span>Hardware</span>
                    </div>
                    <div className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className={styles.promoBox}>
                <input type="text" placeholder="Promo Code" />
                <button>Apply</button>
              </div>

              <div className={styles.totals}>
                <div className={styles.row}>
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className={styles.row}>
                  <span>Shipping</span>
                  <span className={styles.free}>COMPLIMENTARY</span>
                </div>
                <div className={styles.row}>
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className={styles.divider} />
                <div className={`${styles.row} ${styles.totalRow}`}>
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.trustStrip}>
                <div className={styles.trustItem}>
                  <ShieldCheck size={18} />
                  <span>24-Month Warranty</span>
                </div>
                <div className={styles.trustItem}>
                  <Truck size={18} />
                  <span>Express Logistics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
