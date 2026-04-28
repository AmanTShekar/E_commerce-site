import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories } from '../data/categories';
import { products } from '../data/products';
import styles from './Discovery.module.css';

import ProductCard from '../components/ui/ProductCard';

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
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Discovery;
