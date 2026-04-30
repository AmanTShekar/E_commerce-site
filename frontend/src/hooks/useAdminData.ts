import { useState, useCallback, useEffect } from 'react';

export interface AdminStats {
  users: number;
  orders: number;
  products: number;
  revenue: number;
}

export interface UserRecord {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export const useAdminData = (isAuthorized: boolean) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [matrixProducts, setMatrixProducts] = useState<any[]>([]);
  const [configData, setConfigData] = useState<any>({});
  const [discoveryGrids, setDiscoveryGrids] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(() => 
    sessionStorage.getItem('nexmart_admin_demo') === 'true'
  );

  const fetchAdminData = useCallback(async () => {
    if (!isAuthorized) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('nexmart_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, usersRes, configRes, gridsRes, logsRes, productsRes] = await Promise.all([
        fetch('http://127.0.0.1:8788/api/admin/stats', { headers }),
        fetch('http://127.0.0.1:8788/api/admin/users', { headers }),
        fetch('http://127.0.0.1:8788/api/config/site'),
        fetch('http://127.0.0.1:8788/api/admin/config/discovery', { headers }),
        fetch('http://127.0.0.1:8788/api/admin/audit-logs', { headers }),
        fetch('http://127.0.0.1:8788/api/admin/products', { headers })
      ]);

      if (statsRes.ok) setStats((await statsRes.json()).stats);
      if (usersRes.ok) setUsers((await usersRes.json()).users || []);
      if (configRes.ok) setConfigData((await configRes.json()).config || {});
      if (gridsRes.ok) setDiscoveryGrids((await gridsRes.json()).grids || []);
      if (logsRes.ok) setAuditLogs((await logsRes.json()).logs || []);
      if (productsRes.ok) setMatrixProducts((await productsRes.json()).products || []);
      
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (isAuthorized) {
      fetchAdminData();
    }
  }, [isAuthorized, fetchAdminData]);

  const handleProductStatus = async (id: string, status: string) => {
    if (isDemoMode) return;
    const token = localStorage.getItem('nexmart_token');
    await fetch(`http://127.0.0.1:8788/api/admin/products/${id}/status`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAdminData();
  };

  const handleSaveGrid = async (grid: any) => {
    if (isDemoMode || !grid) return;
    const token = localStorage.getItem('nexmart_token');
    await fetch(`http://127.0.0.1:8788/api/admin/config/discovery/${grid.id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: grid.title,
        items: grid.items,
        link: grid.link,
        order: grid.order
      })
    });
    fetchAdminData();
  };

  const handleUserAction = async (userId: string, action: string) => {
    if (isDemoMode) return alert('Protocol restricted in Demo Mode.');
    try {
      const token = localStorage.getItem('nexmart_token');
      const res = await fetch(`http://127.0.0.1:8788/api/admin/users/${userId}/action`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) await fetchAdminData();
    } catch (err) {
      console.error('User action failed:', err);
    }
  };

  const handleToggleFreeze = async () => {
    if (isDemoMode) return alert('Protocol restricted in Demo Mode.');
    const status = configData.is_frozen !== 'true';
    const token = localStorage.getItem('nexmart_token');
    try {
      await fetch('http://127.0.0.1:8788/api/admin/system/freeze', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      await fetchAdminData();
    } catch (err) {
      console.error('Freeze toggle failed:', err);
    }
  };

  const handleBackup = async () => {
    const token = localStorage.getItem('nexmart_token');
    const res = await fetch('http://127.0.0.1:8788/api/admin/system/backup', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    alert(data.message);
  };

  const handleUpdateConfig = async (key: string, value: string) => {
    if (isDemoMode) return;
    const token = localStorage.getItem('nexmart_token');
    await fetch('http://127.0.0.1:8788/api/admin/config/site', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value })
    });
    fetchAdminData();
  };

  const triggerIntegrityFix = async () => {
    if (isDemoMode) return;
    const token = localStorage.getItem('nexmart_token');
    await fetch('http://127.0.0.1:8788/api/admin/fix-categories', { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    fetchAdminData();
  };

  return {
    loading,
    stats,
    users,
    matrixProducts,
    configData,
    setConfigData,
    discoveryGrids,
    auditLogs,
    isDemoMode,
    setIsDemoMode,
    handleProductStatus,
    handleSaveGrid,
    handleUserAction,
    handleToggleFreeze,
    handleBackup,
    handleUpdateConfig,
    triggerIntegrityFix
  };
};
