import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandSide}>
            <div className={styles.logo}>NEXMART</div>
            <p>Curating the world's most purposeful hardware and furniture for the modern digital artisan.</p>
            <div className={styles.socials}>
              <Instagram size={20} />
              <Twitter size={20} />
              <Linkedin size={20} />
              <Github size={20} />
            </div>
          </div>
          
          <div className={styles.linksSide}>
            <div className={styles.linkCol}>
              <h4>Marketplace</h4>
              <Link to="/discovery">All Products</Link>
              <Link to="/search">Featured</Link>
              <Link to="/discovery">Studio Kits</Link>
              <Link to="/discovery">Hardware</Link>
            </div>
            <div className={styles.linkCol}>
              <h4>Company</h4>
              <Link to="/about">Our Story</Link>
              <Link to="/contact">Careers</Link>
              <Link to="/about">Sustainability</Link>
              <Link to="/about">Press</Link>
            </div>
            <div className={styles.linkCol}>
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Protocol</Link>
              <Link to="/terms">Terms of Deployment</Link>
              <Link to="/terms">Cookies</Link>
              <Link to="/terms">Security</Link>
            </div>
            <div className={styles.linkCol}>
              <h4>Support</h4>
              <Link to="/contact">Help Center</Link>
              <Link to="/contact">Returns</Link>
              <Link to="/contact">Shipping</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>© 2024 NEXMART STUDIO. ALL RIGHTS RESERVED.</p>
          <div className={styles.legal}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
