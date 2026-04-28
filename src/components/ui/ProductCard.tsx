import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  category: string;
  rating: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id, name, price, oldPrice, discount, category, rating, image
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, name, price, quantity: 1, image });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, name, price, quantity: 1, image });
    navigate('/checkout');
  };

  const goToDetail = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className={styles.card} onClick={goToDetail}>
      <div className={styles.imageWrapper}>
        {discount && <span className={styles.badge}>{discount} OFF</span>}
        <img src={image} alt={name} className={styles.image} />
        <button className={styles.cartOverlayBtn} onClick={handleAddToCart}>
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{category}</span>
          <div className={styles.rating}>
            <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
            <span>{rating}</span>
          </div>
        </div>
        
        <h3 className={styles.name}>{name}</h3>
        
        <div className={styles.footer}>
          <div className={styles.pricing}>
            <span className={styles.price}>₹{price.toLocaleString()}</span>
            {oldPrice && <span className={styles.oldPrice}>₹{oldPrice.toLocaleString()}</span>}
          </div>
          <button className={styles.buyBtn} onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
