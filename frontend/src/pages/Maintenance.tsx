import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Clock, RefreshCw } from 'lucide-react';
import styles from './NotFound.module.css'; // Reuse some styles

const Maintenance: React.FC = () => {
  return (
    <div className={styles.container} style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={styles.iconWrapper}
        style={{ marginBottom: '2rem', color: 'var(--accent)' }}
      >
        <ShieldAlert size={80} />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}
      >
        SYSTEM GUARD ACTIVE
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', lineHeight: '1.6', marginBottom: '3rem' }}
      >
        The NEXMART Command Center has initiated a global protocol freeze for essential maintenance. 
        Normal operations will resume shortly.
      </motion.p>
      
      <div style={{ display: 'flex', gap: '2rem', opacity: 0.8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} />
          <span>Est. Resume: 15m</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={18} className="spin" />
          <span>Status: Synchronizing</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Maintenance;
