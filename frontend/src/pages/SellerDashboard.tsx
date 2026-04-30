import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, ShoppingCart, BarChart3, Plus, X, 
  TrendingUp, MoreHorizontal, ArrowRight, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import styles from './SellerDashboard.module.css';

const SellerDashboard: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as any });

  if (isAuthLoading) {
    return <div className={styles.loadingState}><div className={styles.spinner}></div><p>Synchronizing Studio Analytics...</p></div>;
  }

  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
    return <div className={styles.loadingState}><h1>Access Denied</h1><p>Seller credentials required for this protocol.</p></div>;
  }

  // Form State
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    mrp: 0,
    stock: 0,
    image: '',
    categoryId: 'electronics' // default
  });

  useEffect(() => {
    // In a real app, we'd fetch only this seller's products
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem('nexmart_token');
        const res = await fetch('http://127.0.0.1:8788/api/products'); // In production, filter by seller
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMyProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('nexmart_token');
      const res = await fetch('http://127.0.0.1:8788/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setToast({
          show: true,
          message: 'Hardware deployment initialized successfully.',
          type: 'success'
        });
        // Refresh product list
        const refreshRes = await fetch('http://127.0.0.1:8788/api/products');
        const refreshData = await refreshRes.json();
        setProducts(refreshData.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Seller Studio</h1>
            <p className={styles.subtitle}>Welcome back, {user?.name}. Manage your hardware deployments.</p>
          </div>
          <Button size="lg" onClick={() => setShowAddModal(true)}>
            <Plus size={20} /> List New Product
          </Button>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {[
            { label: 'Total Revenue', value: '₹1,24,500', change: '+12.5%', icon: <BarChart3 size={20} /> },
            { label: 'Active Orders', value: '18', change: '+2', icon: <ShoppingCart size={20} /> },
            { label: 'Products', value: '42', change: '0', icon: <Package size={20} /> },
            { label: 'Store Rating', value: '4.9', change: '+0.1', icon: <TrendingUp size={20} /> },
          ].map((stat, i) => (
            <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <span className={styles.statChange}>{stat.change}</span>
              </div>
              <span className={styles.statLabel}>{stat.label}</span>
              <h3 className={styles.statValue}>{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className={styles.mainGrid}>
          {/* Recent Products */}
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Active Inventory</h3>
              <button className={styles.viewAll}>View All</button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.image} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} alt="" />
                          <span style={{ fontWeight: 800 }}>{p.title}</span>
                        </div>
                      </td>
                      <td className={styles.amount}>₹{p.price.toLocaleString()}</td>
                      <td>{p.stock} units</td>
                      <td>
                        <span className={`${styles.status} ${styles.shipped}`}>Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Studio Performance */}
          <motion.div {...fadeInUp} transition={{ delay: 0.5 }} className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Studio Performance</h3>
              <MoreHorizontal size={18} />
            </div>
            <div className={styles.chartPlaceholder}>
              <div className={styles.barGroup}>
                {[60, 80, 45, 90, 70, 85].map((h, i) => (
                  <div key={i} className={styles.bar} style={{ height: `${h}%` }} />
                ))}
              </div>
              <p>Weekly Acquisition Growth</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={styles.modal}
            >
              <button className={styles.closeBtn} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
              <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>List New Hardware</h2>
              <p style={{ color: '#999', marginBottom: 32 }}>Deploy a new product to the global NEXMART marketplace.</p>

              <form onSubmit={handleAddProduct}>
                <div className={styles.inputGroup}>
                  <label>Product Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mojo Obsidian Edition" 
                    required 
                    onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Hardware Category</label>
                  <select 
                    required 
                    onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                    value={newProduct.categoryId}
                  >
                    <option value="cyber-hardware">Cyber Hardware</option>
                    <option value="obsidian-series">Obsidian Series</option>
                    <option value="hyper-performance">Hyper Performance</option>
                    <option value="studio-audio">Studio Audio</option>
                    <option value="artisan-essentials">Artisan Essentials</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Description</label>
                  <textarea 
                    rows={3} 
                    placeholder="Describe the hardware specifications..." 
                    required
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Deployment Price (₹)</label>
                    <input 
                      type="number" 
                      placeholder="12000" 
                      required
                      onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>MRP (₹)</label>
                    <input 
                      type="number" 
                      placeholder="15000" 
                      required
                      onChange={(e) => setNewProduct({...newProduct, mrp: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Initial Stock</label>
                    <input 
                      type="number" 
                      placeholder="50" 
                      required
                      onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Hardware Image URL</label>
                    <input 
                      type="url" 
                      placeholder="https://images..." 
                      required
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className={styles.submitBtn} loading={loading}>
                  Initialize Deployment <Zap size={18} fill="#fff" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toast 
        isVisible={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
};

export default SellerDashboard;
