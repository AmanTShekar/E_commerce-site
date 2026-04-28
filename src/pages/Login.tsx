import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const toggleMode = () => setMode(prev => prev === 'login' ? 'signup' : 'login');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className={styles.page}>
      {/* Background decoration */}
      <div className={styles.bgGlow} />
      
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> <span>Back to Studio</span>
      </button>

      <div className={styles.authCard}>
        <div className={styles.mainGrid}>
          
          {/* VISUAL PANEL */}
          <div className={styles.visualPanel}>
            <div className={styles.panelContent}>
              <div className={styles.logo}>NEXMART</div>
              <div className={styles.panelText}>
                <h2>{mode === 'login' ? 'Welcome back, artisan.' : 'Start your collection.'}</h2>
                <p>Engineering the definitive digital workspace with curated aesthetic hardware.</p>
              </div>
              <div className={styles.trustBadge}>
                <ShieldCheck size={16} />
                <span>Verified Studio Environment</span>
              </div>
            </div>
            {/* Sliding overlay for desktop */}
            <motion.div 
              className={styles.slidingOverlay}
              animate={{ x: mode === 'login' ? '0%' : '100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>

          {/* FORMS */}
          <div className={styles.formPanel}>
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div key="login" {...fadeInUp} className={styles.formWrapper}>
                  <header>
                    <h3>Sign In</h3>
                    <p>Enter your credentials to access the vault.</p>
                  </header>

                  <form onSubmit={(e) => { e.preventDefault(); navigate('/'); }} className={styles.form}>
                    <div className={styles.inputStack}>
                      <div className={styles.inputBox}>
                        <label>Email Address</label>
                        <div className={styles.inputInner}>
                          <Mail size={18} />
                          <input type="email" placeholder="artisan@studio.com" required />
                        </div>
                      </div>
                      <div className={styles.inputBox}>
                        <label>Security Key</label>
                        <div className={styles.inputInner}>
                          <Lock size={18} />
                          <input type="password" placeholder="••••••••" required />
                        </div>
                      </div>
                    </div>
                    <div className={styles.formMeta}>
                      <span className={styles.forgot}>Lost Access?</span>
                    </div>
                    <Button type="submit" size="lg" className={styles.submitBtn}>
                      Initialize Session <ArrowRight size={18} />
                    </Button>
                  </form>

                  <footer>
                    <span>New to the studio?</span>
                    <button onClick={toggleMode} className={styles.toggleBtn}>Create Account</button>
                  </footer>
                </motion.div>
              ) : (
                <motion.div key="signup" {...fadeInUp} className={styles.formWrapper}>
                  <header>
                    <h3>Create Account</h3>
                    <p>Register your identity within the ecosystem.</p>
                  </header>

                  <form onSubmit={(e) => { e.preventDefault(); navigate('/'); }} className={styles.form}>
                    <div className={styles.inputStack}>
                      <div className={styles.inputBox}>
                        <label>Full Name</label>
                        <div className={styles.inputInner}>
                          <User size={18} />
                          <input type="text" placeholder="Alex Obsidian" required />
                        </div>
                      </div>
                      <div className={styles.inputBox}>
                        <label>Email Address</label>
                        <div className={styles.inputInner}>
                          <Mail size={18} />
                          <input type="email" placeholder="artisan@studio.com" required />
                        </div>
                      </div>
                      <div className={styles.inputBox}>
                        <label>Create Security Key</label>
                        <div className={styles.inputInner}>
                          <Lock size={18} />
                          <input type="password" placeholder="••••••••" required />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" size="lg" className={styles.submitBtn}>
                      Register Identity <ArrowRight size={18} />
                    </Button>
                  </form>

                  <footer>
                    <span>Existing member?</span>
                    <button onClick={toggleMode} className={styles.toggleBtn}>Sign In Instead</button>
                  </footer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
