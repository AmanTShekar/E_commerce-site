import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, ShoppingBag, Heart, Shield, 
  Truck, RotateCcw, ChevronRight, Minus, Plus, 
  Share2
} from 'lucide-react';
import Button from '../components/ui/Button';
import styles from './ProductDetail.module.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';
import { fadeInUp } from '../utils/animations';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id) || products[0];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };


  return (
    <div className={styles.page}>
      {/* MOBILE STICKY ACTIONS - Flipkart Style */}
      <div className={`${styles.stickyActions} mobile-only`}>
        <div className={styles.stickyContainer}>
          <button className={styles.stickyAdd} onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className={styles.stickyBuy} onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/discovery">{product.category}</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </nav>

        <div className={styles.mainGrid}>
          {/* Gallery with Share button */}
          <div className={styles.gallerySide}>
            <div className={styles.mainImageWrapper}>
              <motion.img 
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.image} 
                alt={product.name} 
                className={styles.mainImage}
              />
              <button className={styles.floatingShare}><Share2 size={20} /></button>
              <button className={styles.floatingHeart}><Heart size={20} /></button>
            </div>
            <div className={styles.thumbnails}>
              {[product.image, product.image, product.image].map((img, i) => (
                <div 
                  key={i} 
                  className={`${styles.thumb} ${selectedImage === i ? styles.activeThumb : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Info Side */}
          <div className={styles.infoSide}>
            <motion.div {...fadeInUp}>
              <div className={styles.metaHeader}>
                <span className={styles.categoryBadge}>{product.category}</span>
                <span className={styles.stockBadge}>In Stock</span>
              </div>
              <h1 className={styles.title}>{product.name}</h1>
              
              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < 4 ? "#000" : "none"} stroke="#000" />
                  ))}
                </div>
                <span className={styles.reviewCount}>(128 Reviews)</span>
              </div>

              <div className={styles.pricing}>
                <div className={styles.priceMain}>
                  <span className={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
                  {product.oldPrice && <span className={styles.oldPrice}>₹{product.oldPrice.toLocaleString()}</span>}
                  {product.discount && <span className={styles.discountTag}>{product.discount} OFF</span>}
                </div>
                <p className={styles.taxLabel}>Inclusive of all taxes</p>
              </div>

              {/* Desktop Actions - Hidden on phone in favor of sticky bar */}
              <div className={`${styles.desktopActions} desktop-only`}>
                <div className={styles.quantityWrapper}>
                  <span className={styles.actionLabel}>Quantity</span>
                  <div className={styles.quantityControl}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={18} /></button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}><Plus size={18} /></button>
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <Button size="lg" className={styles.addBtn} onClick={handleAddToCart}>
                    <ShoppingBag size={20} />
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="outline" className={styles.buyNowBtn} onClick={handleBuyNow}>
                    Buy Now
                  </Button>
                </div>
              </div>

              <div className={styles.specGrid}>
                {Object.entries(product.specs || {}).map(([label, value], i) => (
                  <div key={i} className={styles.specItem}>
                    <span className={styles.specLabel}>{label}</span>
                    <span className={styles.specValue}>{value}</span>
                  </div>
                ))}
              </div>

              <div className={styles.guarantees}>
                <div className={styles.guaranteeItem}>
                  <Truck size={20} />
                  <div>
                    <strong>Fast Shipping</strong>
                    <span>Delivered in 3-5 days</span>
                  </div>
                </div>
                <div className={styles.guaranteeItem}>
                  <RotateCcw size={20} />
                  <div>
                    <strong>Easy Returns</strong>
                    <span>30-day hassle-free policy</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Highlights */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2>Studio Engineering</h2>
            <p>Purpose-built for the modern digital workflow.</p>
          </div>
          <div className={styles.featuresGrid}>
            {[
              { title: 'Premium Build', desc: 'Crafted with high-grade materials for long-lasting durability.' },
              { title: 'User Centric', desc: 'Designed with a focus on ergonomics and ease of use.' },
              { title: 'Studio Grade', desc: 'Meets the rigorous standards of professional digital creators.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className={styles.featureCard}
              >
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className={styles.recommendations}>
          <div className={styles.sectionHeader}>
            <h2>Complete the Setup</h2>
            <p>Curated assets that complement this product.</p>
          </div>
          <div className={styles.suggestionGrid}>
            {products.slice(0, 4).map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
