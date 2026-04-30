import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';
import aboutHeroImg from '../assets/images/about_hero_modern_studio_1777330720335.png';
import { fadeInUp } from '../utils/animations';


const About: React.FC = () => {
  return (
    <div className={styles.about}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.h1 {...fadeInUp} className={styles.title}>Purposeful<br />Curation.</motion.h1>
          <motion.p {...fadeInUp} transition={{ delay: 0.1 }} className={styles.subtitle}>
            NEXMART was born from a simple observation: the tools we use define the work we create.
          </motion.p>
        </div>
        <motion.img 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          src={aboutHeroImg} 
          className={styles.heroImage} 
        />
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <motion.div {...fadeInUp} className={styles.textBlock}>
              <h2>The Philosophy</h2>
              <p>We don't believe in more. We believe in better. Every item in the NEXMART collection undergoes a rigorous selection process focused on aesthetic utility, material honesty, and longevity.</p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className={styles.textBlock}>
              <h2>The Studio</h2>
              <p>Located at the intersection of design and technology, our studio is dedicated to discovering hardware and furniture that empowers the digital artisan to focus on what truly matters.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.container}>
          <div className={styles.valueRow}>
            <div className={styles.valueItem}>
              <span>01</span>
              <h3>Surgical Precision</h3>
              <p>Every product is vetted for technical excellence and performance.</p>
            </div>
            <div className={styles.valueItem}>
              <span>02</span>
              <h3>Material Honesty</h3>
              <p>We prioritize sustainable woods, high-grade metals, and premium textiles.</p>
            </div>
            <div className={styles.valueItem}>
              <span>03</span>
              <h3>Digital Zen</h3>
              <p>Designed to reduce clutter and foster a state of deep work.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
