import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, ShoppingBag, Heart, Shield, 
  Truck, RotateCcw, ChevronRight, Minus, Plus, 
  CreditCard 
} from 'lucide-react';
import Button from '../components/ui/Button';
import styles from './ProductDetail.module.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Mock product data (In production this would fetch based on ID)
  const product = {
    id: id || '1',
    name: 'Mojo One Mechanical Keyboard',
    price: 18499,
    oldPrice: 22999,
    discount: '20%',
    rating: 4.9,
    reviews: 128,
    category: 'Hardware',
    description: 'The Mojo One is a masterpiece of tactile engineering. Featuring a solid aluminum chassis, hot-swappable mechanical switches, and a unique triple-gasket mount system for the ultimate typing acoustics. Designed for the digital artisan who demands precision in every keystroke.',
    specs: [
      { label: 'Layout', value: '75% Compact' },
      { label: 'Switches', value: 'Studio Linear v2' },
      { label: 'Material', value: 'CNC Aluminum' },
      { label: 'Connectivity', value: 'Triple Mode (2.4G/BT/USB)' }
    ],
    features: [
      { title: 'Triple Gasket Mount', desc: 'Unparalleled acoustics and flex for a premium typing feel.' },
      { title: 'Hot-Swap PCB', desc: 'Experiment with any mechanical switch without soldering.' },
      { title: 'OLED Display', desc: 'Programmable screen for system metrics or custom animations.' },
      { title: 'South-Facing RGB', desc: 'Vibrant lighting that remains visible with premium keycaps.' }
    ],
    images: [
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618384881928-22d4c69dec5a?auto=format&fit=crop&q=80&w=1200'
    ]
  };

  const suggestions = [
    { id: 's1', name: 'Studio Monitor V2', price: 42000, category: 'Hardware', rating: 4.8, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800' },
    { id: 's2', name: 'Zen Audio Hub', price: 12500, category: 'Audio', rating: 4.7, image: 'https://images.unsplash.com/photo-1618384881928-22d4c69dec5a?auto=format&fit=crop&q=80&w=800' },
    { id: 's3', name: 'Ergo Desk Pro', price: 65000, category: 'Furniture', rating: 5.0, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800' },
    { id: 's4', name: 'Mojo Wrist Rest', price: 3499, category: 'Accessories', rating: 4.9, image: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?auto=format&fit=crop&q=80&w=800' },
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0]
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs}>
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/discovery">{product.category}</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </nav>

        <div className={styles.mainGrid}>
          {/* Image Gallery */}
          <div className={styles.gallerySide}>
            <div className={styles.mainImageWrapper}>
              <motion.img 
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.images[selectedImage]} 
                alt={product.name} 
                className={styles.mainImage}
              />
            </div>
            <div className={styles.thumbnails}>
              {product.images.map((img, i) => (
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

          {/* Product Info */}
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
                <span className={styles.reviewCount}>({product.reviews} Customer Reviews)</span>
              </div>

              <div className={styles.pricing}>
                <span className={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
                <span className={styles.oldPrice}>₹{product.oldPrice.toLocaleString()}</span>
                <span className={styles.discountTag}>{product.discount} OFF</span>
              </div>

              <p className={styles.description}>{product.description}</p>

              <div className={styles.specGrid}>
                {product.specs.map((spec, i) => (
                  <div key={i} className={styles.specItem}>
                    <span className={styles.specLabel}>{spec.label}</span>
                    <span className={styles.specValue}>{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className={styles.actions}>
                <div className={styles.quantityControl}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={18} /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}><Plus size={18} /></button>
                </div>
                <Button size="lg" className={styles.addBtn} onClick={handleAddToCart}>
                  <ShoppingBag size={20} />
                  Add to Cart
                </Button>
                <button className={styles.wishBtn}><Heart size={20} /></button>
              </div>

              <Button size="lg" variant="outline" className={styles.buyNowBtn} onClick={handleBuyNow}>
                <CreditCard size={20} />
                Buy It Now
              </Button>

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
                <div className={styles.guaranteeItem}>
                  <Shield size={20} />
                  <div>
                    <strong>2 Year Warranty</strong>
                    <span>Full brand coverage</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Highlights */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2>Tactile Excellence</h2>
            <p>Engineered for those who appreciate the nuance of a single keystroke.</p>
          </div>
          <div className={styles.featuresGrid}>
            {product.features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
            <h2>Synergy Collection</h2>
            <p>Items curated to complement your studio setup.</p>
          </div>
          <div className={styles.suggestionGrid}>
            {suggestions.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
