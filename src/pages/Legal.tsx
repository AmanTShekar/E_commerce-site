import React from 'react';
import { motion } from 'framer-motion';
import styles from './Legal.module.css';

const Legal: React.FC<{ title: string; content: string[] }> = ({ title, content }) => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.title}
        >
          {title}
        </motion.h1>
        <div className={styles.content}>
          {content.map((p, i) => (
            <motion.p 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={styles.paragraph}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Privacy: React.FC = () => (
  <Legal 
    title="Privacy Protocol" 
    content={[
      "At NEXMART, we treat your data with the same precision as our hardware. This protocol outlines how we handle your digital identity.",
      "1. Information Collection: We collect only the data necessary to facilitate your deployments — email, coordinates, and system preferences.",
      "2. Data Usage: Your information is used strictly for order processing and system optimization. We never sell your data to third-party entities.",
      "3. Encryption: All sensitive data is encrypted at rest using industry-standard protocols.",
      "4. Your Rights: You have the right to request a full dump of your data or immediate deletion of your studio account at any time."
    ]} 
  />
);

export const Terms: React.FC = () => (
  <Legal 
    title="Terms of Deployment" 
    content={[
      "By accessing the NEXMART Studio, you agree to the following terms of engagement.",
      "1. Account Security: You are responsible for maintaining the encryption of your session credentials.",
      "2. Intellectual Property: All designs, blueprints, and digital assets on this platform are the property of NEXMART or their respective artisans.",
      "3. Fair Use: The marketplace must be used for legitimate commerce. Any attempt to exploit system vulnerabilities will result in permanent suspension.",
      "4. Limitation of Liability: NEXMART is not liable for any creative blocks or productivity surges resulting from the use of our high-performance tools."
    ]} 
  />
);
