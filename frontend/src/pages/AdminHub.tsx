import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Users, ShoppingBag, CreditCard, 
  Search, Filter,
  ChevronRight, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminHub.module.css';
import Button from '../components/ui/Button';
import { useAdminData } from '../hooks/useAdminData';
import { staggerContainer, fadeInUp } from '../utils/animations';

const COMMAND_SECRET = 'NEXMART-STUDIO-ALPHA-2026';

const AdminHub: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'identity' | 'products' | 'config' | 'pulse'>('identity');
  const [pulseData, setPulseData] = useState({ cpu: 12, mem: 42, users: 156 });
  const [isAuthorized, setIsAuthorized] = useState(() => 
    sessionStorage.getItem('nexmart_admin_auth') === 'true'
  );
  
  const [secretInput, setSecretInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [editingGrid, setEditingGrid] = useState<any>(null);

  const {
    loading, stats, users, matrixProducts, configData, setConfigData,
    discoveryGrids, auditLogs, isDemoMode, setIsDemoMode,
    handleProductStatus, handleSaveGrid, handleUserAction,
    handleToggleFreeze, handleBackup, handleUpdateConfig, triggerIntegrityFix
  } = useAdminData(isAuthorized);

  useEffect(() => {
    if (isAuthorized) {
      const interval = setInterval(() => {
        setPulseData(prev => ({
          cpu: Math.floor(Math.random() * 30) + 5,
          mem: Math.floor(Math.random() * 20) + 40,
          users: prev.users + (Math.random() > 0.5 ? 1 : -1)
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthorized]);

  if (isAuthLoading) {
    return (
      <div className={styles.loadingPage}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className={styles.spinner} />
        <p>Initializing Secure Nexus...</p>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className={styles.loadingPage}>
        <ShieldCheck size={48} color="#000" />
        <h1 style={{ marginTop: '16px' }}>Desktop Environment Required</h1>
        <p style={{ maxWidth: '400px', textAlign: 'center', margin: '8px auto', lineHeight: '1.5', opacity: 0.8 }}>
          Command Center access is restricted to Desktop environments for security, comprehensive data visualization, and workflow optimization. Please access from a workstation.
        </p>
        <Button onClick={() => navigate('/profile')} style={{ marginTop: '24px' }}>Return to Profile</Button>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className={styles.loadingPage}>
        <ShieldCheck size={48} color="#ff3b30" />
        <h1 style={{ marginTop: '16px', color: '#ff3b30' }}>Access Denied</h1>
        <p>Unauthorized: Admin credentials required for this protocol.</p>
        <Button onClick={() => navigate('/')} style={{ marginTop: '16px' }}>Return to Discovery</Button>
      </div>
    );
  }

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) {
      setAuthError('Too many failed attempts. Protocol Locked.');
      return;
    }
    if (secretInput === COMMAND_SECRET) {
      setIsAuthorized(true);
      setIsDemoMode(false);
      sessionStorage.setItem('nexmart_admin_auth', 'true');
      sessionStorage.setItem('nexmart_admin_demo', 'false');
    } else {
      setAttempts(prev => prev + 1);
      setAuthError('Invalid Command Secret. Access Logged.');
    }
  };

  const enterDemo = () => {
    setIsAuthorized(true);
    setIsDemoMode(true);
    sessionStorage.setItem('nexmart_admin_auth', 'true');
    sessionStorage.setItem('nexmart_admin_demo', 'true');
  };

  if (!isAuthorized) {
    return (
      <div className={styles.gatePage}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`${styles.gateCard} glass`}
        >
          <div className={styles.gateHeader}>
            <ShieldCheck size={48} color="var(--color-primary)" />
            <h2>Nexus Authorization Required</h2>
            <p>Enter the Level 2 Command Secret to access global system protocols.</p>
          </div>
          <div className={styles.gateActions}>
            <Button variant="outline" className={styles.demoBtn} onClick={enterDemo} style={{ width: '100%' }}>
              See Demo Mode (Read-Only)
            </Button>
            <div style={{ margin: '24px 0', color: '#bbb', fontSize: '12px', fontWeight: 800 }}>OR</div>
            <form onSubmit={handleAuthorize} className={styles.authForm}>
              <input 
                type="password" 
                placeholder="COMMAND SECRET" 
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                className={styles.secretInput}
              />
              <Button type="submit" size="lg" className={styles.submitBtn} style={{ width: '100%' }}>
                Unlock Full Command Center
              </Button>
              {authError && <p className={styles.errorText}>{authError}</p>}
              <p className={styles.attempts}>Attempt {attempts}/5</p>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className={styles.spinner} />
        <p>Loading System Telemetry...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <motion.div 
        className={styles.container}
        initial="initial"
        animate="whileInView"
        variants={staggerContainer}
      >
        <motion.div className={styles.header} variants={fadeInUp}>
          <div className={styles.titleArea}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <ShieldCheck size={40} color="var(--color-primary)" />
              <h1>Command Center {isDemoMode && <span className={styles.demoBadge}>DEMO MODE</span>}</h1>
            </div>
            <p className={styles.subtitle}>System oversight and global nexus management.</p>
          </div>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === 'identity' ? styles.active : ''}`} onClick={() => setActiveTab('identity')}>Identity</button>
            <button className={`${styles.tab} ${activeTab === 'products' ? styles.active : ''}`} onClick={() => setActiveTab('products')}>Matrix</button>
            <button className={`${styles.tab} ${activeTab === 'config' ? styles.active : ''}`} onClick={() => setActiveTab('config')}>Global Config</button>
            <button className={`${styles.tab} ${activeTab === 'pulse' ? styles.active : ''}`} onClick={() => setActiveTab('pulse')}>System Pulse</button>
          </div>
        </motion.div>

        <motion.div className={styles.statsGrid} variants={staggerContainer} initial="initial" animate="whileInView">
          <motion.div className={styles.statCard} variants={fadeInUp}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}><Users size={24} /></div>
            </div>
            <span className={styles.statLabel}>Global Artisans</span>
            <h3 className={styles.statValue}>{stats?.users || 0}</h3>
          </motion.div>
          <motion.div className={styles.statCard} variants={fadeInUp}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}><ShoppingBag size={24} /></div>
            </div>
            <span className={styles.statLabel}>Active Deployments</span>
            <h3 className={styles.statValue}>{stats?.orders || 0}</h3>
          </motion.div>
          <motion.div className={styles.statCard} variants={fadeInUp}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}><CreditCard size={24} /></div>
            </div>
            <span className={styles.statLabel}>Total Revenue</span>
            <h3 className={styles.statValue}>₹{(stats?.revenue || 0).toLocaleString()}</h3>
          </motion.div>
          <motion.div className={styles.statCard} variants={fadeInUp}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}><Activity size={24} /></div>
            </div>
            <span className={styles.statLabel}>System Health</span>
            <h3 className={styles.statValue} style={{ color: configData.is_frozen === 'true' ? '#ff3b30' : 'var(--color-primary)' }}>
              {configData.is_frozen === 'true' ? 'FROZEN' : 'OPTIMUM'}
            </h3>
          </motion.div>
        </motion.div>

        <motion.div className={styles.mainGrid} variants={fadeInUp}>
          <AnimatePresence mode="wait">
            {activeTab === 'identity' && (
              <motion.div 
                key="identity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.sectionCard}
              >
                <div className={styles.sectionHeader}>
                  <h3>Identity Management</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Search size={18} color="#999" />
                    <Filter size={18} color="#999" />
                  </div>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Artisan</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className={styles.userCell}>
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} alt="" className={styles.avatar} />
                              <div>
                                <div style={{ fontWeight: 800 }}>{u.fullName}</div>
                                <div style={{ fontSize: 12, color: '#888' }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`${styles.roleBadge} ${styles[u.role]}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {u.isActive ? (
                                <Button size="sm" variant="outline" onClick={() => handleUserAction(u.id, 'suspend')}>Suspend</Button>
                              ) : (
                                <Button size="sm" variant="outline" style={{ color: '#10b981', borderColor: '#10b981' }} onClick={() => handleUserAction(u.id, 'activate')}>Activate</Button>
                              )}
                              <Button size="sm" variant="outline" style={{ color: '#ff3b30', borderColor: '#ff3b30' }} onClick={() => handleUserAction(u.id, 'delete')}>Delete</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div 
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.sectionCard}
              >
                <div className={styles.sectionHeader}>
                  <h3>Product Matrix</h3>
                  <Button size="sm" onClick={triggerIntegrityFix}>
                    Run Integrity Fix
                  </Button>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrixProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={p.image} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                              <div style={{ fontWeight: 800, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                            </div>
                          </td>
                          <td>{p.brand}</td>
                          <td>{p.stock}</td>
                          <td>
                            <select 
                              value={p.status} 
                              onChange={(e) => handleProductStatus(p.id, e.target.value)}
                              style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'transparent' }}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="pending">Pending</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {matrixProducts.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No products in matrix.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'config' && (
              <motion.div 
                key="config"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.configArea}
              >
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <h3>Trust Strip Configuration</h3>
                  </div>
                  <div className={styles.configGrid}>
                    <div className={styles.inputGroup}>
                      <label>Global Shipping</label>
                      <input 
                        type="text" 
                        value={configData.guarantee_shipping || ''} 
                        onChange={(e) => setConfigData({...configData, guarantee_shipping: e.target.value})}
                        onBlur={(e) => handleUpdateConfig('guarantee_shipping', e.target.value)} 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Return Policy</label>
                      <input 
                        type="text" 
                        value={configData.guarantee_returns || ''} 
                        onChange={(e) => setConfigData({...configData, guarantee_returns: e.target.value})}
                        onBlur={(e) => handleUpdateConfig('guarantee_returns', e.target.value)} 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Warranty Label</label>
                      <input 
                        type="text" 
                        value={configData.guarantee_warranty || ''} 
                        onChange={(e) => setConfigData({...configData, guarantee_warranty: e.target.value})}
                        onBlur={(e) => handleUpdateConfig('guarantee_warranty', e.target.value)} 
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Secure Payment</label>
                      <input 
                        type="text" 
                        value={configData.guarantee_secure || ''} 
                        onChange={(e) => setConfigData({...configData, guarantee_secure: e.target.value})}
                        onBlur={(e) => handleUpdateConfig('guarantee_secure', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <h3>Discovery Grids</h3>
                  </div>
                  <div className={styles.gridManager}>
                    {discoveryGrids.map((grid) => (
                      <div key={grid.id} className={styles.gridItem}>
                        <div className={styles.gridInfo}>
                          <h4>{grid.title}</h4>
                          <p>{grid.items.join(', ')}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setEditingGrid({...grid})}>Modify</Button>
                      </div>
                    ))}
                    {discoveryGrids.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No discovery grids defined.</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pulse' && (
              <motion.div 
                key="pulse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.pulseArea}
              >
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <h3>Cloudflare Edge Telemetry</h3>
                    <div className={styles.liveIndicator}>
                      <div className={styles.pulseDot} />
                      LIVE PROTOCOL
                    </div>
                  </div>
                  <div className={styles.pulseGrid}>
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>CPU Utilization</span>
                      <div className={styles.progressContainer}>
                        <motion.div 
                          className={styles.progressBar} 
                          initial={{ width: 0 }}
                          animate={{ width: `${pulseData.cpu}%` }}
                        />
                      </div>
                      <span className={styles.metricValue}>{pulseData.cpu}%</span>
                    </div>
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Memory Allocation</span>
                      <div className={styles.progressContainer}>
                        <motion.div 
                          className={styles.progressBar} 
                          initial={{ width: 0 }}
                          animate={{ width: `${pulseData.mem}%` }}
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        />
                      </div>
                      <span className={styles.metricValue}>{pulseData.mem} MB</span>
                    </div>
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Active Nexus Sessions</span>
                      <h3 className={styles.bigMetric}>{pulseData.users}</h3>
                      <p style={{ fontSize: 12, color: '#888' }}>Concurrent artisans across edge nodes</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>System Protocol</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className={styles.protocolItem} onClick={() => alert('Real-time traffic audit active. All requests are currently logged in the Audit Trail.')}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)' }}>Server Logs</div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Real-time traffic audit</div>
                </div>
                <ChevronRight size={16} color="#bbb" />
              </div>
              <div className={styles.protocolItem} onClick={handleBackup}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)' }}>D1 Backups</div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Last atomic backup: {new Date().toLocaleDateString()}</div>
                </div>
                <ChevronRight size={16} color="#bbb" />
              </div>
              <div className={styles.protocolItem} onClick={handleToggleFreeze}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)' }}>Global Freeze</div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{configData.is_frozen === 'true' ? 'THAW SYSTEM' : 'HALT ALL DEPLOYMENTS'}</div>
                </div>
                <ChevronRight size={16} color="#bbb" />
              </div>
              <div className={styles.sectionHeader} style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                <h4 style={{ fontSize: 11, fontWeight: 900, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Audit Trail</h4>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {auditLogs.map((log) => (
                  <div key={log.id} style={{ padding: 'var(--space-3)', background: log.severity === 'critical' ? '#fff5f5' : '#fafafa', border: `1px solid ${log.severity === 'critical' ? '#ffcdd2' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, color: log.severity === 'critical' ? '#ff3b30' : 'var(--color-primary)' }}>{log.action}</span>
                      <span style={{ color: '#888' }}>{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div style={{ color: '#666' }}>{log.resource}: {log.details}</div>
                  </div>
                ))}
                {auditLogs.length === 0 && <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>No activity logged.</p>}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modify Grid Modal */}
      <AnimatePresence>
        {editingGrid && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ background: 'var(--color-surface)', padding: 'var(--space-8)', borderRadius: 'var(--radius-2xl)', maxWidth: '600px', width: '100%', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'var(--shadow-premium)' }}
            >
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>Modify {editingGrid.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className={styles.inputGroup}>
                  <label>Grid Title</label>
                  <input type="text" value={editingGrid.title} onChange={(e) => setEditingGrid({...editingGrid, title: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Items (Comma separated)</label>
                  <input type="text" value={editingGrid.items.join(', ')} onChange={(e) => setEditingGrid({...editingGrid, items: e.target.value.split(',').map((s: string) => s.trim())})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Link Target</label>
                  <input type="text" value={editingGrid.link || ''} onChange={(e) => setEditingGrid({...editingGrid, link: e.target.value})} />
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-4)' }}>
                <Button onClick={() => handleSaveGrid(editingGrid)}>Save Protocol</Button>
                <Button variant="outline" onClick={() => setEditingGrid(null)}>Abort</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHub;
