import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './Login.module.css';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !confirmPassword) return;
    setError(null);
    try {
      await register(name, email, password, confirmPassword);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> <span>Return to Store</span>
      </button>

      <div className={`${styles.authCard} ${isSignUp ? styles.rightPanelActive : ''}`}>
        
        {/* SIGN UP FORM */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.formContent} onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <p>Join the collection of global artisans.</p>
            
            {error && isSignUp && (
              <div className={styles.errorMessage}>
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Full Identity</label>
              <div className={styles.inputField}>
                <User size={18} />
                <input type="text" placeholder="Alex Obsidian" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Workspace Email</label>
              <div className={styles.inputField}>
                <Mail size={18} />
                <input type="email" placeholder="artisan@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Security Key</label>
              <div className={styles.inputField}>
                <Lock size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  className={styles.eyeBtn} 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Key</label>
              <div className={styles.inputField}>
                <Lock size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  className={styles.eyeBtn} 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className={styles.submitBtn}>
              Register Identity <ArrowRight size={18} />
            </Button>

            <div className={styles.mobileSwitch}>
              <p>Already a member?</p>
              <button type="button" onClick={() => setIsSignUp(false)}>Sign In</button>
            </div>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.formContent} onSubmit={handleLogin}>
            <h1>Welcome Back</h1>
            <p>Initialize your session to access your studio gear.</p>

            {error && !isSignUp && (
              <div className={styles.errorMessage}>
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Artisan Email</label>
              <div className={styles.inputField}>
                <Mail size={18} />
                <input type="email" placeholder="artisan@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Security Key</label>
              <div className={styles.inputField}>
                <Lock size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  className={styles.eyeBtn} 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <span className={styles.forgot}>Lost Access?</span>

            <Button type="submit" variant="primary" size="lg" className={styles.submitBtn}>
              Initialize Session <ArrowRight size={18} />
            </Button>
            
            <div className={styles.mobileSwitch}>
              <p>New to the Studio?</p>
              <button type="button" onClick={() => setIsSignUp(true)}>Create Account</button>
            </div>
          </form>
        </div>

        {/* SLIDING OVERLAY */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h2>Studio Member?</h2>
              <p>To stay connected with us please login with your personal info</p>
              <button className={styles.ghostBtn} onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h2>Hello, Artisan!</h2>
              <p>Enter your personal details and start your journey with us</p>
              <button className={styles.ghostBtn} onClick={() => setIsSignUp(true)}>
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
