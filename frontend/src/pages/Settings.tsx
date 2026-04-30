import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Eye, Globe, Zap, Moon, Smartphone } from 'lucide-react';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [region, setRegion] = useState('Global');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div {...fadeInUp} className={styles.header}>
          <h1>System Preferences</h1>
          <p>Configure your artisan environment and global studio parameters.</p>
        </motion.div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Communications</h2>
          </div>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <h3>Deployment Alerts</h3>
              <p>Receive real-time notifications for hardware acquisitions.</p>
            </div>
            <div 
              className={`${styles.toggle} ${notifications ? styles.active : ''}`}
              onClick={() => setNotifications(!notifications)}
            >
              <div className={styles.toggleDot} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Security</h2>
          </div>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <h3>Two-Factor Protocol</h3>
              <p>Add an extra layer of encryption to your artisan identity.</p>
            </div>
            <div 
              className={`${styles.toggle} ${twoFactor ? styles.active : ''}`}
              onClick={() => setTwoFactor(!twoFactor)}
            >
              <div className={styles.toggleDot} />
            </div>
          </div>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <h3>Active Sessions</h3>
              <p>Manage all hardware currently linked to your session.</p>
            </div>
            <select className={styles.select}>
              <option>Studio Terminal</option>
              <option>Mobile Uplink</option>
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Environment</h2>
          </div>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <h3>Obsidian Mode</h3>
              <p>Switch between studio light and high-contrast dark interface.</p>
            </div>
            <div 
              className={`${styles.toggle} ${darkMode ? styles.active : ''}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <div className={styles.toggleDot} />
            </div>
          </div>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <h3>Regional Gateway</h3>
              <p>Select your primary fulfillment node.</p>
            </div>
            <select 
              className={styles.select} 
              value={region} 
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="Global">Global Alpha</option>
              <option value="US-East">US East (Artisan)</option>
              <option value="EU-West">EU West (Studio)</option>
              <option value="ASIA-South">Asia South (Cyber)</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
