import React from 'react';
import { motion } from 'framer-motion';
import { Store, Zap, Shield, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './BecomeSeller.module.css';

const BecomeSeller: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Rocket size={24} />,
      title: "Global Reach",
      desc: "Connect with thousands of digital artisans looking for high-fidelity utility."
    },
    {
      icon: <Shield size={24} />,
      title: "Secure Payments",
      desc: "Our automated payout system ensures you get paid for every deployment instantly."
    },
    {
      icon: <Zap size={24} />,
      title: "Instant Analytics",
      desc: "Track your revenue and inventory with real-time studio telemetry."
    }
  ];

  const steps = [
    "Register your Studio Profile",
    "Define your Artisan Category",
    "List your Hardware or Assets",
    "Monitor Global Deployments"
  ];

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroContent}
          >
            <span className={styles.badge}>Seller Program</span>
            <h1>Launch your Studio on NEXMART</h1>
            <p>Join the elite network of hardware creators and digital architects. Scale your craftsmanship globally.</p>
            <div className={styles.heroActions}>
              <Button size="lg" onClick={() => navigate('/login')}>Initialize Registration</Button>
              <Button size="lg" variant="outline">View Fee Structure</Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={styles.featureCard}
            >
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <section className={styles.workflow}>
          <div className={styles.workflowInfo}>
            <h2>Operational Workflow</h2>
            <p>Four steps to becoming a verified NEXMART Studio provider.</p>
            <div className={styles.stepList}>
              {steps.map((s, i) => (
                <div key={i} className={styles.step}>
                  <CheckCircle2 size={20} className={styles.check} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.workflowVisual}>
             <div className={styles.visualBox}>
                <Store size={64} strokeWidth={1} />
                <div className={styles.scanningLine} />
             </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>Ready to synchronize?</h2>
            <p>Join 2,400+ sellers already powering the NEXMART ecosystem.</p>
            <Button size="lg" onClick={() => navigate('/login')}>
              Join Seller Studio <ArrowRight size={18} />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BecomeSeller;
