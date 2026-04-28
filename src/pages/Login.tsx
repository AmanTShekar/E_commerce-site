import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './Login.module.css';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email, password);
    navigate('/');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    login(email, password);
    navigate('/');
  };

  const toggleMode = () => setIsSignUp(!isSignUp);

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />
      
      <button 
        id="back-to-home"
        className={styles.backBtn} 
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={18} /> <span>Return to Store</span>
      </button>

      <div className={`${styles.authCard} ${isSignUp ? styles.rightPanelActive : ''}`} id="auth-card">
        
        {/* SIGN UP FORM */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.formContent} id="signup-form" onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <p>Join the collection of global artisans.</p>
            
            <div className={styles.inputGroup}>
              <label htmlFor="signup-name">Full Identity</label>
              <div className={styles.inputField}>
                <User size={18} />
                <input 
                  id="signup-name" 
                  type="text" 
                  placeholder="Alex Obsidian" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="signup-email">Workspace Email</label>
              <div className={styles.inputField}>
                <Mail size={18} />
                <input 
                  id="signup-email" 
                  type="email" 
                  placeholder="artisan@studio.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="signup-password">Security Key</label>
              <div className={styles.inputField}>
                <Lock size={18} />
                <input 
                  id="signup-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <Button id="signup-submit" type="submit" variant="primary" size="lg" className={styles.submitBtn}>
              Register Identity <ArrowRight size={18} />
            </Button>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.formContent} id="login-form" onSubmit={handleLogin}>
            <h1>Welcome Back</h1>
            <p>Enter the vault to access your curated gear.</p>

            <div className={styles.inputGroup}>
              <label htmlFor="login-email">Artisan Email</label>
              <div className={styles.inputField}>
                <Mail size={18} />
                <input 
                  id="login-email" 
                  type="email" 
                  placeholder="artisan@studio.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="login-password">Security Key</label>
              <div className={styles.inputField}>
                <Lock size={18} />
                <input 
                  id="login-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <span className={styles.forgot}>Lost Access?</span>

            <Button id="login-submit" type="submit" variant="primary" size="lg" className={styles.submitBtn}>
              Initialize Session <ArrowRight size={18} />
            </Button>
          </form>
        </div>

        {/* SLIDING OVERLAY */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h2>Studio Member?</h2>
              <p>To stay connected with us please login with your personal info</p>
              <button className={styles.ghostBtn} id="toggle-signin" onClick={toggleMode}>
                Sign In
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h2>Hello, Artisan!</h2>
              <p>Enter your personal details and start your journey with us</p>
              <button className={styles.ghostBtn} id="toggle-signup" onClick={toggleMode}>
                Sign Up
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
