import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Quote, ShoppingCart, Star, ChevronLeft, ChevronRight,
  Truck, RotateCcw, ShieldCheck, Shield, Zap, Smartphone, Laptop, Cpu, Layout, Globe
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categories } from '../data/categories';
import { products } from '../data/products';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import styles from './Home.module.css';

// Hooks & Utils
import { useScrollPosition } from '../hooks/useScrollPosition';
import { fadeInUp, staggerContainer } from '../utils/animations';

// Assets
import heroImg from '../assets/images/hero.png';
import galleryImg1 from '../assets/images/home_workspace_lifestyle_1_1777330794916.png';
import aboutHeroImg from '../assets/images/about_hero_modern_studio_1777330720335.png';

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

const testimonials = [
  { quote: "NEXMART redefined my workspace. The build quality of the S1 is genuinely world-class.", author: "Sarah Jenkins", role: "Director", company: "Flux Studio" },
  { quote: "Minimalism met utility. The M1 mouse is the most precise tool I've used in a decade.", author: "Marcus Thorne", role: "Sr. Designer", company: "Technic" },
  { quote: "The H1 audio profile is exceptionally flat and honest. Perfect for long mixing sessions.", author: "Elena Rossi", role: "Audio Engineer", company: "Sonic Lab" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const newArrivalsRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const isScrolled = useScrollPosition(20);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const [isHoveringDeals, setIsHoveringDeals] = useState(false);
  const [isHoveringNew, setIsHoveringNew] = useState(false);
  const [isHoveringTrending, setIsHoveringTrending] = useState(false);
  
  const [currentHero, setCurrentHero] = useState(0);
  const heroSlides = [
    {
      subtitle: "The Masterpiece Collection",
      title: "Audio Studio Pro",
      image: heroImg,
      cta: "Explore Assets",
      link: "/search?category=Audio"
    },
    {
      subtitle: "Precision Engineering",
      title: "Obsidian Keys",
      image: galleryImg1,
      cta: "Discover More",
      link: "/search?category=Hardware"
    },
    {
      subtitle: "The Workspace Revolution",
      title: "Ergo Evolution",
      image: aboutHeroImg,
      cta: "Shop Now",
      link: "/search?category=Office"
    }
  ];
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);

  const flashDeals = products.filter(p => p.isFlashDeal);
  const featuredItems = products.filter(p => p.rating >= 4.7).slice(0, 10);
  const newArrivals = products.filter(p => p.isNew).slice(0, 10);
  const trendingItems = products.slice(5, 15); // Dynamic trending

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    
    const createAutoScroll = (ref: React.RefObject<HTMLDivElement>, isHovering: boolean) => {
      return setInterval(() => {
        if (ref.current && !isHovering) {
          const { scrollLeft, scrollWidth, clientWidth } = ref.current;
          const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10;
          
          if (isAtEnd) {
            ref.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            ref.current.scrollBy({ left: 400, behavior: 'smooth' });
          }
        }
      }, 5000);
    };

    const dealsInterval = createAutoScroll(scrollContainerRef, isHoveringDeals);
    const newInterval = createAutoScroll(newArrivalsRef, isHoveringNew);
    const trendingInterval = createAutoScroll(trendingRef, isHoveringTrending);
    
    const heroInterval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => {
      clearInterval(dealsInterval);
      clearInterval(newInterval);
      clearInterval(trendingInterval);
      clearInterval(heroInterval);
    };
  }, [isHoveringDeals, isHoveringNew, isHoveringTrending, heroSlides.length]);

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
      <motion.div className={styles.progressBar} style={{ scaleX }} />

      {/* 1. TOP TRUST STRIP */}
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

      {/* 2. CATEGORY NAV */}
      <nav className={`${styles.categoryNav} ${isScrolled ? styles.scrolled : ''} desktop-only`}>
        <div className={styles.container}>
          <div className={styles.catScrollContainer}>
            <div className={styles.catGrid}>
              {categories.map((cat, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }}
                  className={styles.catItem}
                  onClick={() => navigate(`/search?category=${encodeURIComponent(cat.label)}`)}
                >
                  <div className={styles.catIcon}>{cat.icon}</div>
                  <span>{cat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </nav>


      {/* MOBILE CATEGORY ROW */}
      <div className={`${styles.mobileCategoryRow} mobile-only`}>
        <div className={styles.mobileCategoryContainer}>
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className={styles.mobileCategoryItem} 
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat.label)}`)}
            >
              <div className={styles.mobileCategoryIcon}>{cat.icon}</div>
              <span>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. HERO */}
      <section className={styles.hero}>
        <motion.img 
          src={heroImg} 
          style={{ scale: heroScale, opacity: heroOpacity }} 
          className={styles.heroImage} 
        />
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <motion.p {...fadeInUp} className={styles.heroSubtitle}>NEXMART / SPRING 24</motion.p>
          <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className={styles.heroTitle}>Aesthetic Utility.</motion.h1>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className={styles.heroActions}>
            <Button size="lg" onClick={() => navigate('/discovery')}>Shop the Collection</Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/about')}>Watch the Film</Button>
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
                onClick={() => navigate('/discovery')}
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
            <div className={styles.viewAll} onClick={() => navigate('/search?filter=deals')}>View All Offers</div>
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

            <div 
              className={styles.horizontalScroll} 
              ref={scrollContainerRef} 
              onScroll={checkScroll}
              onMouseEnter={() => setIsHoveringDeals(true)}
              onMouseLeave={() => setIsHoveringDeals(false)}
            >
              {flashDeals.map(product => (
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
              { title: 'Pro Audio', sub: 'STUDIO SERIES', text: 'Engineered for high-performance productivity.', price: '₹29,900', bg: '#000', color: '#fff' },
              { title: 'Oak & Walnut', sub: 'SUSTAINABILITY', text: 'Ethically sourced, precision crafted furniture.', price: '₹12,500', bg: '#f5f5f5', color: '#000' },
              { title: 'Steel Grey', sub: 'LIMITED DROP', text: 'The definitive edition for the digital artisan.', price: '₹18,500', bg: '#ffffff', color: '#000', border: true }
            ].map((ad, i) => (
              <motion.div 
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className={styles.adBanner} 
                style={{ backgroundColor: ad.bg, color: ad.color, border: ad.border ? '1px solid var(--color-border)' : undefined }}
              >
                <span className={styles.adSub}>{ad.sub}</span>
                <h3 className={styles.adTitle}>{ad.title}</h3>
                <p className={styles.adDescription}>{ad.text}</p>
                <div className={styles.adBannerActions}>
                  <span className={styles.priceTag}>{ad.price}</span>
                  <Button size="sm" variant={ad.bg === '#000' ? 'outline' : 'primary'} onClick={() => navigate('/discovery')}>Buy Now</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. NEW ARRIVALS */}
      <section className={styles.section} style={{ backgroundColor: '#f9f9f9' }}>
        <div className={styles.container}>
          <motion.div {...fadeInUp} className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>New Arrivals</h2>
            <div className={styles.viewAll} onClick={() => navigate('/search?filter=new')}>Explore All</div>
          </motion.div>
          <div className={styles.productGridWrapper}>
            <button 
              className={`${styles.carouselBtn} ${styles.prevBtn}`}
              onClick={() => newArrivalsRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
            >
              <ChevronLeft size={24} />
            </button>
            <div 
              className={styles.productGrid}
              ref={newArrivalsRef}
              onMouseEnter={() => setIsHoveringNew(true)}
              onMouseLeave={() => setIsHoveringNew(false)}
            >
              {newArrivals.map((product, i) => (
                <motion.div key={product.id} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
            <button 
              className={`${styles.carouselBtn} ${styles.nextBtn}`}
              onClick={() => newArrivalsRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. FEATURED ITEMS */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div {...fadeInUp} className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Studio Favorites</h2>
            <div className={styles.viewAll} onClick={() => navigate('/search')}>Browse All</div>
          </motion.div>
          <div className={styles.productGrid}>
            {featuredItems.map((product, i) => (
              <motion.div key={product.id} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. DEVICE EXCLUSIVE SECTIONS */}
      
      {/* MOBILE EXCLUSIVE: Quick Swipe Discovery */}
      <section className={`${styles.section} mobile-only`} style={{ paddingBottom: '120px' }}>
        <div className={styles.container}>
          <motion.div {...fadeInUp} className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Mobile Discovery</h2>
          </motion.div>
          <div className={styles.mobileExclusiveBanner}>
            <div className={styles.exclusiveContent}>
              <Smartphone size={32} />
              <h3>Studio On The Go</h3>
              <p>Experience the full NEXMART ecosystem optimized for your palm. Haptic-ready interactions and rapid deployment.</p>
              <Button variant="outline" size="sm">Open App View</Button>
            </div>
          </div>
        </div>
      </section>

      {/* DESKTOP EXCLUSIVE: Studio Efficiency Section */}
      <section className={`${styles.section} desktop-only`}>
        <div className={styles.container}>
          <div className={styles.desktopExclusiveGrid}>
            <motion.div {...fadeInUp} className={styles.efficiencyCard}>
              <Laptop size={40} />
              <h2>Pro Workflow</h2>
              <p>Advanced keyboard shortcuts and multi-window curation tools for the professional digital artisan.</p>
              <div className={styles.shortcutList}>
                <div className={styles.shortcut}><span>CMD + K</span> Quick Search</div>
                <div className={styles.shortcut}><span>SHIFT + D</span> Discovery Mode</div>
              </div>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className={styles.statsCard}>
              <Globe size={40} />
              <h2>Global Network</h2>
              <p>Access the unified studio marketplace with 24/7 priority support and global asset distribution.</p>
              <div className={styles.statGrid}>
                <div className={styles.stat}><strong>24/7</strong> Uptime</div>
                <div className={styles.stat}><strong>150+</strong> Studios</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. TRENDING NOW */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div {...fadeInUp} className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trending Now</h2>
            <div className={styles.viewAll} onClick={() => navigate('/search')}>See Trending</div>
          </motion.div>
          <div className={styles.productGridWrapper}>
            <button 
              className={`${styles.carouselBtn} ${styles.prevBtn}`}
              onClick={() => trendingRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
            >
              <ChevronLeft size={24} />
            </button>
            <div 
              className={styles.productGrid}
              ref={trendingRef}
              onMouseEnter={() => setIsHoveringTrending(true)}
              onMouseLeave={() => setIsHoveringTrending(false)}
            >
              {trendingItems.map((product, i) => (
                <motion.div key={product.id} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
            <button 
              className={`${styles.carouselBtn} ${styles.nextBtn}`}
              onClick={() => trendingRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* 11. NEWSLETTER */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <motion.div {...fadeInUp} className={styles.newsletterCard}>
            <div className={styles.newsletterContent}>
              <Sparkles size={40} className={styles.newsletterIcon} />
              <h2>Join the Studio.</h2>
              <p>Get exclusive drops, early access, and curated hardware inspiration delivered to your inbox.</p>
              <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email address" />
                <Button variant="primary">Subscribe</Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
