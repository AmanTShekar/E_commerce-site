import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Wishlist.module.css';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
}

const Wishlist: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('nexmart_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await fetch('http://127.0.0.1:8788/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.wishlist) {
        setItems(data.wishlist);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (isAuthLoading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Initializing Session...</div>;
  if (!user) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Session Required.</div>;

  const handleRemove = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://127.0.0.1:8788/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setItems(prev => prev.filter(item => item.product.id !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Retrieving Studio Blueprints...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div {...fadeInUp} className={styles.header}>
          <div className={styles.titleArea}>
            <Heart size={32} fill="#000" />
            <h1>Artisan Wishlist</h1>
          </div>
          <p>Curate your definitive workspace. Save the hardware you desire for future studio deployments.</p>
        </motion.div>

        <div className={styles.grid}>
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                layout
                className={styles.wishCard}
              >
                <div className={styles.imageWrapper}>
                  <img src={item.product.image} alt={item.product.title} className={styles.image} />
                  <button className={styles.removeBtn} onClick={() => handleRemove(item.product.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className={styles.content}>
                  <span className={styles.category}>STUDIO GRADE</span>
                  <h3 className={styles.itemName}>{item.product.title}</h3>
                  <div className={styles.footer}>
                    <p className={styles.price}>₹{item.product.price.toLocaleString()}</p>
                    <div className={styles.actions}>
                      <button className={styles.buyBtn} onClick={() => { handleAddToCart(item.product); navigate('/cart'); }}>
                        DEPLOY NOW <ArrowRight size={14} />
                      </button>
                      <button className={styles.cartBtn} onClick={() => handleAddToCart(item.product)}>
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {items.length === 0 && (
          <EmptyState 
            type="wishlist"
            title="Your blueprint is currently empty."
            message="You haven't saved any hardware for your future studio deployments yet. Curate your definitive workspace today."
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
