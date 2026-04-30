import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, Heart } from 'lucide-react';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, q: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={styles.item}
    >
      <div className={styles.itemImageWrapper}>
        <img src={item.image} alt={item.name} className={styles.itemImage} />
      </div>
      <div className={styles.itemInfo}>
        <div className={styles.itemHeader}>
          <div>
            <span className={styles.category}>Hardware</span>
            <h3>{item.name}</h3>
          </div>
          <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className={styles.itemControls}>
          <div className={styles.quantity}>
            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
            <span>{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
          </div>
          <div className={styles.itemActions}>
            <button className={styles.secondaryAction}><Heart size={16} /> Save for Later</button>
          </div>
          <p className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
