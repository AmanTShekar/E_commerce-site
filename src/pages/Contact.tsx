import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import styles from './Contact.module.css';
import Button from '../components/ui/Button';
import { fadeInUp } from '../utils/animations';


const Contact: React.FC = () => {
  return (
    <div className={styles.contact}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.h1 {...fadeInUp} className={styles.title}>Connect.</motion.h1>
          <motion.p {...fadeInUp} transition={{ delay: 0.1 }} className={styles.subtitle}>
            Have a question about our curation or need technical support? We're here to help.
          </motion.p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <motion.div {...fadeInUp} className={styles.infoSide}>
              <div className={styles.infoCard}>
                <div className={styles.icon}><Mail size={24} /></div>
                <div>
                  <h3>Email</h3>
                  <p>studio@nexmart.com</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.icon}><Phone size={24} /></div>
                <div>
                  <h3>Phone</h3>
                  <p>+91 800-STUDIO-24</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.icon}><MapPin size={24} /></div>
                <div>
                  <h3>Studio</h3>
                  <p>12/4 Obsidian Square, Mumbai, IN</p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className={styles.formSide}>
              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="Your Name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="email@example.com" />
                </div>
                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea placeholder="How can we assist you?"></textarea>
                </div>
                <Button variant="primary" className={styles.submitBtn}>
                  <Send size={18} />
                  <span>Send Message</span>
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
