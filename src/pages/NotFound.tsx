import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import styles from './NotFound.module.css';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.visualStack}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: -5 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className={styles.floatingCard}
          >
            <span>404</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 0.5, scale: 1.1, rotate: 5 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={`${styles.floatingCard} ${styles.ghost}`}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className={styles.content}
        >
          <h1 className={styles.title}>Vanish into the Void.</h1>
          <p className={styles.description}>
            The architectural path you seek has been deconstructed or never existed in our current iteration.
          </p>
          <div className={styles.actions}>
            <Link to="/">
              <Button size="lg" className={styles.primaryBtn}>
                <Home size={18} />
                <span>Initialize Recovery</span>
              </Button>
            </Link>
            <button onClick={() => window.history.back()} className={styles.backLink}>
              <ArrowLeft size={18} />
              <span>Back to Origin</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Experimental architectural background */}
      <div className={styles.bgWrapper}>
        <div className={styles.noise} />
        <div className={styles.gridLine} />
        <div className={styles.gridLineV} />
      </div>
    </div>
  );
};

export default NotFound;
