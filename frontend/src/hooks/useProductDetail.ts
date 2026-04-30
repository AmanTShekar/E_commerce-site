import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export interface ProductDetailData {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  category: string;
  image: string;
  specs: Record<string, any>;
}

export const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = id ? isInWishlist(id) : false;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [prodRes, allProdRes] = await Promise.all([
          fetch(`http://127.0.0.1:8788/api/products/${id}`),
          fetch('http://127.0.0.1:8788/api/products')
        ]);

        const prodData = await prodRes.json();
        const allProdData = await allProdRes.json();

        if (prodData.product) {
          const p = prodData.product;
          setProduct({
            id: p.id,
            name: p.title,
            price: p.price,
            oldPrice: p.mrp > p.price ? p.mrp : undefined,
            discount: p.mrp > p.price ? `${Math.round(((p.mrp - p.price) / p.mrp) * 100)}%` : undefined,
            category: p.categoryName || 'Studio Gear',
            image: p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            specs: { Brand: p.brand || 'NEXMART', Stock: p.stock, Model: p.id.slice(0, 8).toUpperCase() }
          });
        } else {
          setError('Product not found');
        }

        if (allProdData.products) {
          setRecommendations(allProdData.products.slice(0, 4).map((p: any) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            category: p.categoryName || 'Studio Gear',
            rating: 4.5 + Math.random() * 0.5,
            image: p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
          })));
        }
      } catch (err) {
        setError('Connection failure');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      return { action: 'removed', message: 'Removed from blueprints.' };
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
      return { action: 'added', message: 'Added to blueprints.' };
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    });
    return { message: `${product.name} added to deployment queue.` };
  };

  const updateQuantity = (val: number) => {
    setQuantity(prev => Math.max(1, prev + val));
  };

  return {
    product,
    recommendations,
    loading,
    error,
    quantity,
    selectedImage,
    setSelectedImage,
    isWishlisted,
    toggleWishlist,
    handleAddToCart,
    updateQuantity
  };
};
