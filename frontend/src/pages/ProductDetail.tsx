import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ShoppingBag, Heart, Shield, 
  Truck, RotateCcw, ChevronRight, Minus, Plus, 
  Share2, Zap
} from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import Toast from '../components/ui/Toast';
import { useProductDetail } from '../hooks/useProductDetail';
import { fadeInUp, staggerContainer } from '../utils/animations';
import styles from './ProductDetail.module.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as any });

  const {
    product,
    recommendations,
    loading,
    error,
    quantity,
    selectedImage,
    setSelectedImage,
    isWishlisted,
    toggleWishlist,
    handleAddToCart,
    updateQuantity
  } = useProductDetail(id);

  const onWishlistToggle = () => {
    const result = toggleWishlist();
    if (result) {
      setToast({ show: true, message: result.message, type: result.action === 'added' ? 'success' : 'info' });
    }
  };

  const onAddToCart = () => {
    const result = handleAddToCart();
    if (result) {
      setToast({ show: true, message: result.message, type: 'success' });
    }
  };

  const onBuyNow = () => {
    onAddToCart();
    navigate('/checkout');
  };

  if (loading) return (
    <div className={styles.loadingState}>
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className={styles.loader}
      />
      <span>Calibrating Hardware Assets...</span>
    </div>
  );

  if (error || !product) return (
    <div className={styles.errorState}>
      <h2>Access Denied</h2>
      <p>{error || 'Asset not found in database.'}</p>
      <Button onClick={() => navigate('/discovery')}>Return to Hub</Button>
    </div>
  );

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className={styles.page}
    >
      {/* MOBILE STICKY ACTIONS */}
      <div className={`${styles.stickyActions} mobile-only`}>
        <div className={styles.stickyContainer}>
          <button className={styles.stickyAdd} onClick={onAddToCart}>
            Queue Asset
          </button>
          <button className={styles.stickyBuy} onClick={onBuyNow}>
            Deploy Now
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Nexus</Link>
          <ChevronRight size={14} />
          <Link to="/discovery">{product.category}</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </nav>

        <div className={styles.mainGrid}>
          {/* Gallery Side */}
          <motion.div variants={fadeInUp} className={styles.gallerySide}>
            <div className={styles.mainImageWrapper}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src={product.image} 
                  alt={product.name} 
                  className={styles.mainImage}
                />
              </AnimatePresence>
              <div className={styles.floatingActions}>
                <button className={styles.floatingAction}><Share2 size={18} /></button>
                <button 
                  className={`${styles.floatingAction} ${isWishlisted ? styles.active : ''}`}
                  onClick={onWishlistToggle}
                >
                  <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
            <div className={styles.thumbnails}>
              {[product.image, product.image, product.image].map((img, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${styles.thumb} ${selectedImage === i ? styles.activeThumb : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info Side */}
          <motion.div variants={staggerContainer} className={styles.infoSide}>
            <motion.div variants={fadeInUp}>
              <div className={styles.metaHeader}>
                <span className={styles.categoryBadge}>{product.category}</span>
                <span className={styles.serialTag}>REF: {product.id.slice(0, 8)}</span>
              </div>
              <h1 className={styles.title}>{product.name}</h1>
              
              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < 4 ? "var(--color-primary)" : "none"} stroke="var(--color-primary)" />
                  ))}
                </div>
                <span className={styles.reviewCount}>128 Verified Evaluations</span>
              </div>

              <div className={styles.pricing}>
                <div className={styles.priceMain}>
                  <span className={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
                  {product.oldPrice && <span className={styles.oldPrice}>₹{product.oldPrice.toLocaleString()}</span>}
                  {product.discount && <span className={styles.discountTag}>{product.discount} YIELD</span>}
                </div>
                <p className={styles.taxLabel}>Encrypted Pricing • Inc. GST</p>
              </div>

              {/* Bank Offers */}
              <div className={styles.offersSection}>
                <h4 className={styles.sectionLabel}>Priority Benefits</h4>
                <ul className={styles.offersList}>
                  <li>
                    <Zap size={14} className={styles.offerIcon} />
                    <span><strong>Obsidian Tier</strong> 10% instant yield on HDFC Assets. <button className={styles.tAndC}>Details</button></span>
                  </li>
                  <li>
                    <Zap size={14} className={styles.offerIcon} />
                    <span><strong>Ecosystem Bundle</strong> Save 10% on modular pairings. <button className={styles.tAndC}>View Pairs</button></span>
                  </li>
                </ul>
              </div>

              <div className={styles.pincodeCheck}>
                <div className={styles.pincodeHeader}>
                  <Truck size={18} />
                  <span>Logistics to <strong>400001</strong></span>
                  <button className={styles.changeBtn}>Relocate</button>
                </div>
                <p className={styles.deliveryEstimate}>Deployment by <strong>Wed, May 5</strong> | <span className={styles.freeText}>Complimentary</span></p>
              </div>

              {/* Desktop Actions */}
              <div className={`${styles.desktopActions} desktop-only`}>
                <div className={styles.quantityWrapper}>
                  <span className={styles.actionLabel}>Allocation</span>
                  <div className={styles.quantityControl}>
                    <button onClick={() => updateQuantity(-1)}><Minus size={18} /></button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQuantity(1)}><Plus size={18} /></button>
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <Button size="lg" className={styles.addBtn} onClick={onAddToCart}>
                    <ShoppingBag size={20} />
                    Queue Asset
                  </Button>
                  <Button size="lg" variant="outline" className={styles.buyNowBtn} onClick={onBuyNow}>
                    Instant Deploy
                  </Button>
                </div>
              </div>

              {/* Product Highlights */}
              <div className={styles.highlightsSection}>
                <h4 className={styles.sectionLabel}>Technical Brief</h4>
                <ul className={styles.highlightsList}>
                  <li>Aerospace-grade aluminum architecture</li>
                  <li>Low-latency multi-stack connectivity</li>
                  <li>Ergonomic efficiency optimization</li>
                  <li>Precision-crafted tactical feedback</li>
                </ul>
              </div>

              <div className={styles.specGrid}>
                {Object.entries(product.specs).map(([label, value], i) => (
                  <div key={i} className={styles.specItem}>
                    <span className={styles.specLabel}>{label}</span>
                    <span className={styles.specValue}>{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.section variants={fadeInUp} className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2>Studio Engineering</h2>
            <p>Purpose-built for high-fidelity digital workflows.</p>
          </div>
          <div className={styles.featuresGrid}>
            {[
              { title: 'Obsidian Build', desc: 'Crafted with high-density materials for generational longevity.' },
              { title: 'Neural Flow', desc: 'Designed for subconscious ergonomic integration.' },
              { title: 'Studio Protocol', desc: 'Meets the rigorous standards of technical artisans.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className={styles.featureCard}
              >
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recommendations */}
        <motion.section variants={fadeInUp} className={styles.recommendations}>
          <div className={styles.sectionHeader}>
            <h2>Complete the Stack</h2>
            <p>Curated pairings for your current selection.</p>
          </div>
          <div className={styles.suggestionGrid}>
            {recommendations.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </motion.section>
      </div>
      <Toast 
        isVisible={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </motion.div>
  );
};

export default ProductDetail;

