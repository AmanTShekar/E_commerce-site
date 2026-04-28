import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Eye, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
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
          <p>Configure your global studio settings.</p>
        </motion.div>

        <div className={styles.list}>
          {[
            { icon: <Bell />, title: 'Notifications', desc: 'Manage your deployment alerts.' },
            { icon: <Shield />, title: 'Privacy & Security', desc: 'Secure your artisan credentials.' },
            { icon: <Eye />, title: 'Appearance', desc: 'Switch between light and dark obsidian.' },
            { icon: <Globe />, title: 'Language & Region', desc: 'Set your global coordinates.' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.1 }}
              className={styles.card}
            >
              <div className={styles.icon}>{item.icon}</div>
              <div className={styles.info}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <Button variant="ghost" size="sm">Configure</Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
