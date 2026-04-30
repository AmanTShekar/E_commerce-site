import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import styles from './Discovery.module.css';
import { API_BASE_URL } from '../config/constants';

import ProductCard from '../components/ui/ProductCard';

const Discovery: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/categories`)
        ]);
        
        const [prodData, catData] = await Promise.all([
          prodRes.json(),
          catRes.json()
        ]);

        const formattedProds = (prodData.products || prodData || []).map((p: any) => ({
          id: p.id || Math.random().toString(),
          name: p.title || p.name || 'Premium Asset',
          price: p.price || 0,
          oldPrice: (p.mrp || p.oldPrice) > (p.price || 0) ? (p.mrp || p.oldPrice) : undefined,
          category: p.categoryName || p.category || 'Studio Gear',
          rating: p.rating || 4.5 + (Math.random() * 0.5),
          image: p.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
          isNew: true
        }));
        setProducts(formattedProds);
        setCategories((catData.categories || catData || []).map((c: any) => {
          let icon = '✦';
          if (c.slug?.includes('audio')) icon = '🎧';
          if (c.slug?.includes('hardware')) icon = '📱';
          if (c.slug?.includes('utility')) icon = '⚡';
          if (c.slug?.includes('aesthetic')) icon = '✨';
          return {
            label: c.name || 'Category',
            count: Math.floor(Math.random() * 50) + 10,
            icon
          };
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscoveryData();
  }, []);

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
          {loading ? (
            <div className={styles.loading}>Loading assets...</div>
          ) : (
            <div className={styles.productGrid}>
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Discovery;
