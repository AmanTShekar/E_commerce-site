import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Heart, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'orders' | 'search';
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, title, message }) => {
  const navigate = useNavigate();
  
  const icons = {
    cart: <ShoppingBag size={64} strokeWidth={1} />,
    wishlist: <Heart size={64} strokeWidth={1} />,
    orders: <Package size={64} strokeWidth={1} />,
    search: <Search size={64} strokeWidth={1} />,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '100px 20px',
        textAlign: 'center',
        background: '#fff',
        borderRadius: '32px',
        border: '1px solid var(--color-border)',
        margin: '40px 0'
      }}
    >
      <div style={{ color: '#000', marginBottom: '24px', opacity: 0.2 }}>
        {icons[type]}
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
        {title}
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 32px' }}>
        {message}
      </p>
      <Button size="lg" onClick={() => navigate('/discovery')}>
        Explore the Collection
      </Button>
    </motion.div>
  );
};

export default EmptyState;
