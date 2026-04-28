import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ShieldCheck, Truck, RotateCcw, Shield, ArrowRight, ArrowLeft,
  Smartphone, Monitor, Headphones, Layout, Coffee, Sofa,
  MousePointer, Gamepad2, Lamp, Watch, Zap, Quote,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import styles from './Home.module.css';

// Assets
import heroImg from '../assets/images/hero.png';
import keyboardImg from '../assets/images/keyboards.png';
import audioImg from '../assets/images/audio.png';
import galleryImg1 from '../assets/images/home_workspace_lifestyle_1_1777330794916.png';
import aboutHeroImg from '../assets/images/about_hero_modern_studio_1777330720335.png';

const categories = [
  { icon: <Smartphone />, label: 'Mobiles' },
  { icon: <Monitor />, label: 'Laptops' },
  { icon: <Headphones />, label: 'Audio' },
  { icon: <Layout />, label: 'Hardware' },
  { icon: <MousePointer />, label: 'Accessories' },
  { icon: <Gamepad2 />, label: 'Gaming' },
  { icon: <Lamp />, label: 'Lighting' },
  { icon: <Sofa />, label: 'Furniture' },
  { icon: <Watch />, label: 'Wearables' },
  { icon: <Coffee />, label: 'Appliances' },
];

const gridCategories = [
  {
    title: "Home Office Essentials",
    items: ["Mechanical Keyboards", "Ergonomic Mice", "Monitor Stands", "Desk Mats"]
  },
  {
    title: "Audio Mastery",
    items: ["Studio Headphones", "Wireless Earbuds", "Hi-Fi Speakers", "Microphones"]
  },
  {
    title: "Task Furniture",
    items: ["Office Chairs", "Standing Desks", "Steel Shelving", "Task Lamps"]
  },
  {
    title: "Gaming Hardware",
    items: ["NVIDIA GPUs", "Gaming Monitors", "RGB Keyboards", "Streaming Kits"]
  }
];

const bestDeals = [
  { id: '1', name: 'S1 Mechanical Keyboard', price: 18500, oldPrice: 24500, discount: '25%', category: 'Hardware', rating: 4.9, image: keyboardImg },
  { id: '2', name: 'H1 Wireless Studio', price: 29900, oldPrice: 35000, discount: '15%', category: 'Audio', rating: 5.0, image: audioImg },
  { id: '3', name: 'M1 Minimalist Mouse', price: 8900, oldPrice: 12000, discount: '26%', category: 'Hardware', rating: 4.7, image: keyboardImg },
  { id: '4', name: 'T1 Desk Mat (Wool)', price: 4500, oldPrice: 6000, discount: '25%', category: 'Accessories', rating: 4.8, image: audioImg },
  { id: '5', name: 'W1 Walnut Stand', price: 12500, category: 'Furniture', rating: 4.9, image: keyboardImg },
  { id: '6', name: 'C1 Task Chair', price: 42000, category: 'Furniture', rating: 5.0, image: audioImg },
];

const testimonials = [
  { quote: "NEXMART redefined my workspace. The build quality of the S1 is genuinely world-class.", author: "Sarah Jenkins", role: "Director", company: "Flux Studio" },
  { quote: "Minimalism met utility. The M1 mouse is the most precise tool I've used in a decade.", author: "Marcus Thorne", role: "Sr. Designer", company: "Technic" },
  { quote: "The H1 audio profile is exceptionally flat and honest. Perfect for long mixing sessions.", author: "Elena Rossi", role: "Audio Engineer", company: "Sonic Lab" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const Home: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for container scroll
    checkScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollDeals = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 500);
    }
  };

  return (
    <div className={styles.home}>
      {/* Scroll Progress Bar */}
      <motion.div className={styles.progressBar} style={{ scaleX }} />

      {/* 1. TOP TRUST STRIP (Now at the very top) */}
      <div className={styles.topTrustStrip}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <Truck size={18} />
              <span>Fast Global Shipping</span>
            </div>
            <div className={styles.trustItem}>
              <RotateCcw size={18} />
              <span>30-Day Easy Returns</span>
            </div>
            <div className={styles.trustItem}>
              <ShieldCheck size={18} />
              <span>2 Year Brand Warranty</span>
            </div>
            <div className={styles.trustItem}>
              <Shield size={18} />
              <span>Secure Payment PCI-DSS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY NAV (Pinned to Navbar) */}
      <nav className={`${styles.categoryNav} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <div className={styles.catGrid}>
            {categories.map((cat, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: isScrolled ? 0 : -5 }}
                className={styles.catItem}
              >
                <div className={styles.catIcon}>{cat.icon}</div>
                <span>{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. CINEMATIC HERO */}
      <section className={styles.hero}>
        <motion.img 
          src={heroImg} 
          style={{ scale: heroScale, opacity: heroOpacity }} 
          className={styles.heroImage} 
        />
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <motion.p {...fadeInUp} className={styles.heroSubtitle}>NEXMART / SPRING 24</motion.p>
          <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className={styles.heroTitle}>Aesthetic<br />Utility.</motion.h1>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className={styles.heroActions}>
            <Button size="lg">Shop the Collection</Button>
            <Button size="lg" variant="outline">Watch the Film</Button>
          </motion.div>
        </div>
      </section>

      {/* 4. DISCOVERY GRIDS */}
      <section className={styles.discoverySection}>
        <div className={styles.container}>
          <div className={styles.amazonGrid}>
            {gridCategories.map((group, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp} 
                transition={{ delay: i * 0.1 }}
                className={styles.gridCard}
              >
                <h3>{group.title}</h3>
                <div className={styles.miniGrid}>
                  {group.items.map((item, j) => (
                    <div key={j} className={styles.miniItem}>
                      <div className={styles.miniThumb} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.gridLink}>
                  <strong>See all options</strong> 
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FLASH DEALS */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div {...fadeInUp} className={styles.flashHeader}>
            <div className={styles.flashTitle}>
              <Zap size={24} fill="#000" stroke="#000" />
              <h2>Deals of the Day</h2>
              <div className={styles.timer}>Ends soon</div>
            </div>
            <div className={styles.viewAll}>View All Offers</div>
          </motion.div>
          
          <div className={styles.carouselWrapper}>
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`${styles.scrollBtn} ${styles.left}`} 
                  onClick={() => scrollDeals('left')}
                >
                  <ChevronLeft size={28} strokeWidth={1.5} />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canScrollRight && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`${styles.scrollBtn} ${styles.right}`} 
                  onClick={() => scrollDeals('right')}
                >
                  <ChevronRight size={28} strokeWidth={1.5} />
                </motion.button>
              )}
            </AnimatePresence>

            <div className={styles.horizontalScroll} ref={scrollContainerRef} onScroll={checkScroll}>
              {bestDeals.map(product => (
                <div key={product.id} className={styles.carouselItem}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE AD BANNERS */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.adRow}>
            {[
              { 
                title: 'Pro Audio', 
                sub: 'STUDIO SERIES', 
                text: 'Engineered for high-performance productivity.',
                bg: '#000', 
                color: '#fff' 
              },
              { 
                title: 'Oak & Walnut', 
                sub: 'SUSTAINABILITY', 
                text: 'Ethically sourced, precision crafted furniture.',
                bg: '#f5f5f5', 
                color: '#000' 
              },
              { 
                title: 'Steel Grey', 
                sub: 'LIMITED DROP', 
                text: 'The definitive edition for the digital artisan.',
                bg: '#ffffff', 
                color: '#000', 
                border: true 
              }
            ].map((ad, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className={styles.adBanner} 
                style={{ 
                  backgroundColor: ad.bg, 
                  color: ad.color,
                  border: ad.border ? '1px solid var(--color-border)' : undefined,
                }}
              >
                <span className={styles.adSub}>{ad.sub}</span>
                <h3 className={styles.adTitle}>{ad.title}</h3>
                <p className={styles.adDescription}>{ad.text}</p>
                <Button 
                  size="sm" 
                  variant={ad.bg === '#000' ? 'outline' : 'primary'} 
                  className={ad.bg === '#000' ? styles.whiteBtn : ''}
                >
                  Explore Collection
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BESTSELLERS */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div {...fadeInUp} className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Items</h2>
            <div className={styles.viewAll}>Browse All</div>
          </motion.div>
          <div className={styles.productGrid}>
            {[...bestDeals, ...bestDeals].slice(0, 8).map((product, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp} 
                transition={{ delay: (i % 4) * 0.1 }}
              >
                <ProductCard {...product} id={`${product.id}-${i}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STUDIO GALLERY */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div {...fadeInUp} className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Studio Gallery</h2>
            <div className={styles.viewAll}>Follow @NEXMART</div>
          </motion.div>
          <div className={styles.galleryGrid}>
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className={styles.galleryItem}>
              <img src={galleryImg1} alt="Studio Scene 1" />
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className={styles.galleryItem}>
              <img src={aboutHeroImg} alt="Studio Scene 2" />
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className={styles.galleryTextCard}>
              <div className={styles.textLeft}>
                <h3>Curated Hardware</h3>
                <p>Designed for the digital artisan. Engineered for focus.</p>
              </div>
              <ArrowRight className={styles.arrowIcon} size={32} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className={styles.section} style={{ backgroundColor: '#fff', borderTop: '1px solid var(--color-border)' }}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <span className={styles.headerLabel}>Community</span>
            <h2 className={styles.sectionTitleLarge}>Trusted globally.</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }} className={styles.testimonialCard}>
                <Quote size={32} className={styles.quoteIcon} />
                <p>"{t.quote}"</p>
                <div className={styles.userInfo}>
                  <strong className={styles.userName}>{t.author}</strong>
                  <div className={styles.userMeta}>
                    <span className={styles.userRole}>{t.role}</span>
                    <span className={styles.userDivider}>•</span>
                    <span className={styles.userCompany}>{t.company}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
