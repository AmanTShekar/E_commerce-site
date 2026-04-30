import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useSystemStatus = () => {
  const [isFrozen, setIsFrozen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8788/api/config/site');
        if (res.ok) {
          const data = await res.json();
          // Find is_frozen in the config array safely
          const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
          const frozenSetting = arr.find((c: any) => c.key === 'is_frozen');
          setIsFrozen(frozenSetting?.value === 'true');
        }
      } catch (e) {
        console.error('System status check failed', e);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    // Poll every 60 seconds
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Admins are exempt from the freeze UI
  const shouldBlock = isFrozen && user?.role !== 'admin';

  return { isFrozen, shouldBlock, loading };
};
