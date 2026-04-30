import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config/constants';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('nexmart_token');

  // Fetch wishlist on load
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated || !token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const arr = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
          const items = arr.map((i: any) => ({
            id: i.product?.id || i.id,
            name: i.product?.title || i.title || i.name,
            price: i.product?.price || i.price,
            image: i.product?.image || i.image,
            category: i.product?.categoryName || i.category || 'Studio Gear'
          }));
          setWishlist(items);
        }
      } catch (e) {
        console.error('Failed to fetch wishlist', e);
      }
    };
    fetchWishlist();
  }, [isAuthenticated, token]);

  const addToWishlist = async (item: WishlistItem) => {
    if (wishlist.find(i => i.id === item.id)) return;
    
    setWishlist(prev => [...prev, item]);

    if (isAuthenticated && token) {
      try {
        await fetch(`${API_BASE_URL}/wishlist`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: item.id })
        });
      } catch (e) {
        console.error('Failed to sync wishlist add', e);
      }
    }
  };

  const removeFromWishlist = async (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));

    if (isAuthenticated && token) {
      try {
        await fetch(`${API_BASE_URL}/wishlist/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error('Failed to sync wishlist remove', e);
      }
    }
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
