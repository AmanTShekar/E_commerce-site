import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config/constants';

interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('nexmart_token');

  // Fetch cart on load if authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated || !token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const items = data.items.map((i: any) => ({
            id: i.product.id,
            name: i.product.title,
            price: i.product.price,
            quantity: i.quantity,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' // Placeholder
          }));
          setCart(items);
        }
      } catch (e) {
        console.error('Failed to fetch cart', e);
      }
    };
    fetchCart();
  }, [isAuthenticated, token]);

  const addToCart = async (item: CartItem) => {
    // Optimistic UI update
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i);
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });

    if (isAuthenticated && token) {
      try {
        await fetch('http://127.0.0.1:8788/api/cart', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: item.id, quantity: item.quantity || 1 })
        });
      } catch (e) {
        console.error('Failed to sync add to cart', e);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    // Optimistic UI update
    setCart(prev => prev.filter(item => item.id !== id));

    if (isAuthenticated && token) {
      try {
        await fetch(`http://127.0.0.1:8788/api/cart/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error('Failed to sync remove from cart', e);
      }
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    // We update locally for now (Backend update quantity route can be added later)
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
