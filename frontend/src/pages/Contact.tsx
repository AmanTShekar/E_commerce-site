import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Plus } from 'lucide-react';
import styles from './Contact.module.css';
import Button from '../components/ui/Button';
import { fadeInUp } from '../utils/animations';


import Toast from '../components/ui/Toast';

const Contact: React.FC = () => {
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' as any });
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({
      show: true,
      message: 'Transmission received. Our agents will respond within 24 standard cycles.',
      type: 'success'
    });
    (e.target as HTMLFormElement).reset();
  };

  const faqs = [
    { q: "What is the standard delivery timeline?", a: "Standard deployments arrive within 3-5 business days. Express protocols are available for select coordinates." },
    { q: "How do I return a hardware asset?", a: "Access your Studio Profile, navigate to Deployments, and select 'Initialize Return' within 7 days of arrival." },
    { q: "Are the products covered by warranty?", a: "All NEXMART assets come with a 1-year Limited Shield Warranty unless specified otherwise in the technical specs." },
    { q: "How do I become a verified artisan?", a: "Select 'Become a Seller' in the footer to begin the verification and onboarding protocol." }
  ];

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
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="email@example.com" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea placeholder="How can we assist you?" required></textarea>
                </div>
                <Button variant="primary" type="submit" className={styles.submitBtn}>
                  <Send size={18} />
                  <span>Send Message</span>
                </Button>
              </form>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div {...fadeInUp} className={styles.faqSection}>
            <h2 className={styles.faqTitle}>Protocol FAQs</h2>
            <div className={styles.faqGrid}>
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className={`${styles.faqItem} ${activeFaq === i ? styles.faqActive : ''}`}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <div className={styles.faqQuestion}>
                    <span>{faq.q}</span>
                    <Plus size={18} />
                  </div>
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Toast 
        isVisible={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
};

export default Contact;
