import React, { useState } from 'react';
import { ShoppingCart, Star, Zap, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
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
  reviewsCount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id, name, price, oldPrice, discount, category, rating, image, reviewsCount
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  if (!id || !name) return null;

  const fallbackImg = `https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80`;

  const isWishlisted = isInWishlist(id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, name, price, image, category });
    }
  };

  // Generate a realistic review count if not provided
  const displayReviews = reviewsCount || Math.floor(Math.random() * 2000) + 150;

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
        <button 
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.activeWishlist : ''}`}
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from Blueprint" : "Add to Blueprint"}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <img 
          src={imgError ? fallbackImg : image} 
          alt={imgError ? "" : name} 
          className={styles.image} 
          onError={() => setImgError(true)}
        />
      </div>
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{category}</span>
          <div className={styles.rating}>
            <Star size={10} fill="#000" stroke="#000" />
            <span>{rating.toFixed(1)}</span>
            <span className={styles.reviewCount}>({displayReviews.toLocaleString()})</span>
          </div>
        </div>
        
        <h3 className={styles.name}>{name}</h3>
        
        <div className={styles.pricing}>
          <div className={styles.priceRow}>
            <span className={styles.price}>₹{price.toLocaleString()}</span>
            {oldPrice && <span className={styles.oldPrice}>₹{oldPrice.toLocaleString()}</span>}
          </div>
          <div className={styles.deliveryInfo}>Free Delivery</div>
        </div>

        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.buyBtn} onClick={handleBuyNow}>
              <Zap size={14} fill="currentColor" /> Buy Now
            </button>
            <button className={styles.cartBtn} onClick={handleAddToCart} title="Add to Cart">
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
