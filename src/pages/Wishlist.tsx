import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import styles from './Wishlist.module.css';

const Wishlist: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  // Mock Wishlist Data
  const wishlistItems = [
    {
      id: '1',
      name: 'Keychron Q1 Pro',
      price: 18999,
      image: 'https://images.unsplash.com/photo-1618335829737-2228ad3088c3?q=80&w=2070&auto=format&fit=crop',
      category: 'Keyboards'
    },
    {
      id: '2',
      name: 'Sony WH-1000XM5',
      price: 29999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
      category: 'Audio'
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div {...fadeInUp} className={styles.header}>
          <h1>Your Wishlist</h1>
          <p>
            Curate your definitive workspace. Save the hardware you desire for future deployment.
          </p>
        </motion.div>

        <div className={styles.grid}>
          <AnimatePresence>
            {wishlistItems.map(item => (
              <motion.div
                key={item.id}
                {...fadeInUp}
                layout
                className={styles.wishCard}
              >
                <div className={styles.imageWrapper}>
                  <img src={item.image} alt={item.name} className={styles.image} />
                  <button className={styles.removeBtn}>
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className={styles.content}>
                  <span className={styles.category}>{item.category}</span>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.price}>₹{item.price.toLocaleString()}</p>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="primary" size="md" style={{ flex: 1 }}>
                      Add to Cart <ShoppingCart size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {wishlistItems.length === 0 && (
          <EmptyState 
            type="wishlist"
            title="Your wishlist is a blank blueprint."
            message="You haven't saved any hardware for your future deployments yet. Curate your definitive workspace today."
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
