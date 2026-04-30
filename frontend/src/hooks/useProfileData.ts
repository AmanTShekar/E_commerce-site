import { useState, useEffect, useCallback } from 'react';

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
}

export const useProfileData = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('nexmart_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8788/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        setError('Failed to load deployments.');
      }
    } catch (e) {
      setError('Network synchronization error.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refreshOrders: fetchOrders };
};
