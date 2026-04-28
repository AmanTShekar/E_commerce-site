import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Monitor, Headphones, Layout, MousePointer, Gamepad2, Lamp, Sofa, Watch, Coffee } from 'lucide-react';
import styles from './Discovery.module.css';

import ProductCard from '../components/ui/ProductCard';

const categories = [
  { icon: <Smartphone />, label: 'Mobiles', count: '1.2k' },
  { icon: <Monitor />, label: 'Laptops', count: '840' },
  { icon: <Headphones />, label: 'Audio', count: '1.5k' },
  { icon: <Layout />, label: 'Hardware', count: '920' },
  { icon: <MousePointer />, label: 'Accessories', count: '2.1k' },
  { icon: <Gamepad2 />, label: 'Gaming', count: '600' },
  { icon: <Lamp />, label: 'Lighting', count: '450' },
  { icon: <Sofa />, label: 'Furniture', count: '320' },
  { icon: <Watch />, label: 'Wearables', count: '1.1k' },
  { icon: <Coffee />, label: 'Appliances', count: '240' },
];

const trendingProducts = [
  { id: 't1', name: 'Mojo One Keyboard', price: 18499, oldPrice: 22999, discount: '20%', category: 'Hardware', rating: 4.9, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800' },
  { id: 't2', name: 'Studio Monitor V2', price: 42000, category: 'Hardware', rating: 4.8, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800' },
  { id: 't3', name: 'Ergo Desk Pro', price: 65000, discount: '10%', category: 'Furniture', rating: 5.0, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800' },
  { id: 't4', name: 'Zen Audio Hub', price: 12500, category: 'Audio', rating: 4.7, image: 'https://images.unsplash.com/photo-1618384881928-22d4c69dec5a?auto=format&fit=crop&q=80&w=800' },
];

const Discovery: React.FC = () => {
  return (
    <div className={styles.discovery}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.subtitle}
          >
            Explore NEXMART
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.title}
          >
            Curated Discovery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.description}
          >
            Browse through our purposeful selection of hardware, software, and furniture.
          </motion.p>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, backgroundColor: '#000', color: '#fff' }}
                className={styles.catCard}
              >
                <div className={styles.icon}>{cat.icon}</div>
                <div className={styles.info}>
                  <h3>{cat.label}</h3>
                  <span>{cat.count} Items</span>
                </div>
                <ArrowRight size={20} className={styles.arrow} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.trendingSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Trending in Studio</h2>
            <p>Popular assets across the ecosystem.</p>
          </div>
          <div className={styles.productGrid}>
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Discovery;
