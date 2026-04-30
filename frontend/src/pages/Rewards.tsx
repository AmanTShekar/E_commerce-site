import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Gift, Star, ArrowRight, Zap, Target, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './Rewards.module.css';

const Rewards: React.FC = () => {
  const navigate = useNavigate();
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  const rewardStats = [
    { label: 'Available Credits', value: '₹2,500', icon: <Star size={20} />, color: '#f59e0b' },
    { label: 'Current Tier', value: 'Platinum', icon: <Award size={20} />, color: '#3b82f6' },
    { label: 'Next Reward', value: '₹5,000 Coupon', icon: <Gift size={20} />, color: '#10b981' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HERO SECTION */}
        <motion.section {...fadeInUp} className={styles.hero}>
          <div className={styles.heroIcon}>
            <Trophy strokeWidth={1.5} className={styles.mainTrophy} />
          </div>
          <h1 className={styles.title}>Studio Rewards</h1>
          <p className={styles.subtitle}>
            Premium loyalty program for the digital artisan. Earn, upgrade, and redeem within the Studio ecosystem.
          </p>
          <div className={styles.heroActions}>
            <Button size="lg" onClick={() => navigate('/discovery')}>Go to Store</Button>
            <Button size="lg" variant="outline">View History</Button>
          </div>
        </motion.section>

        {/* STATS GRID - PRODUCTION LEVEL OPTIMIZED */}
        <div className={styles.grid}>
          {rewardStats.map((item, i) => (
            <motion.div 
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.1 }}
              className={styles.rewardCard}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon} style={{ color: item.color }}>{item.icon}</div>
                <span className={styles.cardLabel}>{item.label}</span>
              </div>
              <h3 className={styles.cardValue}>{item.value}</h3>
              {/* Added a progress indicator for production feel */}
              <div className={styles.miniProgress}>
                <div className={styles.bar} style={{ width: '70%', backgroundColor: item.color }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* MOBILE ONLY: QUICK TIER PROGRESS (Different placement for phone) */}
        <section className={styles.mobileTierCard}>
          <div className={styles.tierHeader}>
            <Zap size={16} fill="currentColor" />
            <span>Power Level 82</span>
          </div>
          <div className={styles.tierProgress}>
            <div className={styles.tierBar} style={{ width: '82%' }} />
          </div>
          <p>1,240 XP until Diamond Tier</p>
        </section>

        {/* MILESTONES SECTION */}
        <section className={styles.milestones}>
          <div className={styles.sectionHeader}>
            <h2>Active Milestones</h2>
            <Target size={20} />
          </div>
          <div className={styles.milestoneList}>
            {[
              { task: 'Spend ₹50,000 this month', progress: '₹32,400', percent: 65 },
              { task: 'Review 5 Studio Assets', progress: '3/5', percent: 60 },
            ].map((m, i) => (
              <div key={i} className={styles.milestoneItem}>
                <div className={styles.mInfo}>
                  <p>{m.task}</p>
                  <span>{m.progress}</span>
                </div>
                <div className={styles.mBarContainer}>
                  <div className={styles.mBar} style={{ width: `${m.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.footerActions}>
          <Button size="lg" onClick={() => navigate('/discovery')}>
            Explore Reward Store <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
