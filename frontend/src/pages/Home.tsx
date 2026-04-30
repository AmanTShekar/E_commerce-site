import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Quote, ShoppingCart, Star, ChevronLeft, ChevronRight,
  Truck, RotateCcw, ShieldCheck, Shield, Zap, Smartphone, Laptop, Cpu, Layout, Globe,
  Headphones
} from 'lucide-react';
import { useCart } from '../context/CartContext';
// import { products } from '../data/products';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import { ProductSkeleton } from '../components/ui/Skeleton';
import styles from './Home.module.css';
import { API_BASE_URL } from '../config/constants';

// Hooks & Utils
import { useScrollPosition } from '../hooks/useScrollPosition';
import { fadeInUp, staggerContainer } from '../utils/animations';

// Assets
const heroImg = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop';
const galleryImg1 = 'https://images.unsplash.com/photo-1595225402422-03d7e674a6a7?q=80&w=2000&auto=format&fit=crop';
const aboutHeroImg = 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=2000&auto=format&fit=crop';

const gridCategories = [
  {
    title: "Home Office Essentials",
    categoryId: "cat-home-office",
    items: ["Mechanical Keyboards", "Ergonomic Mice", "Monitor Stands", "Desk Mats"]
  },
  {
    title: "Audio Mastery",
    categoryId: "cat-audio",
    items: ["Studio Headphones", "Wireless Earbuds", "Hi-Fi Speakers", "Microphones"]
  },
  {
    title: "Task Furniture",
    categoryId: "cat-furniture",
    items: ["Office Chairs", "Standing Desks", "Steel Shelving", "Task Lamps"]
  },
  {
    title: "Gaming Hardware",
    categoryId: "cat-gaming",
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
  
  const [products, setProducts] = useState<any[]>([]);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [bankOffers, setBankOffers] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>({});
  const [homeGrids, setHomeGrids] = useState<any[]>([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch Categories
        const catRes = await fetch(`${API_BASE_URL}/categories`);
        const catData = await catRes.json();
        
        // High-fidelity Studio Categories
        const studioCategories = [
          { label: "Cyber Hardware", slug: "cyber", icon: <Cpu size={20} /> },
          { label: "Obsidian Series", slug: "obsidian", icon: <Shield size={20} /> },
          { label: "Hyper Performance", slug: "hyper", icon: <Zap size={20} /> },
          { label: "Studio Audio", slug: "audio", icon: <Headphones size={20} /> },
          { label: "Artisan Essentials", slug: "artisan", icon: <Sparkles size={20} /> }
        ];
        setCategories(studioCategories);

        // Fetch Products
        const prodRes = await fetch(`${API_BASE_URL}/products`);
        const prodData = await prodRes.json();
        const formatted = prodData.products.length > 0 ? prodData.products.map((p: any) => ({
          id: p.id,
          name: p.title,
          price: p.price,
          oldPrice: p.mrp > p.price ? p.mrp : undefined,
          discount: p.mrp > p.price ? `${Math.round(((p.mrp - p.price) / p.mrp) * 100)}%` : undefined,
          category: p.categoryName || 'Studio Gear',
          rating: 4.5 + (Math.random() * 0.5),
          image: p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
          isFlashDeal: p.price < 50000,
          isNew: true
        })) : [
          { id: 'f1', name: 'Obsidian Keyboard V3', price: 12900, oldPrice: 15900, category: 'Hardware', rating: 4.9, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80', isFlashDeal: true },
          { id: 'f2', name: 'Studio Monitor Pro', price: 45000, oldPrice: 52000, category: 'Audio', rating: 4.8, image: 'https://images.unsplash.com/photo-1583394838336-acd977730f90?w=500&q=80', isFlashDeal: true },
          { id: 'f3', name: 'Minimalist Desk Mat', price: 2500, oldPrice: 3500, category: 'Aesthetic', rating: 4.7, image: 'https://images.unsplash.com/photo-1616412411311-594475a914a6?w=500&q=80', isFlashDeal: true },
          { id: 'f4', name: 'H1 Wireless Headset', price: 8900, oldPrice: 12000, category: 'Audio', rating: 4.9, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', isFlashDeal: true }
        ];
        setProducts(formatted);

        // Fetch Deals of the Day (EC-115)
        const dealsRes = await fetch(`${API_BASE_URL}/deals`);
        const dealsData = await dealsRes.json();
        setFlashDeals(dealsData.products || []);

        // Fetch Config & Promotions
        const [promoRes, configRes, gridRes] = await Promise.all([
          fetch(`${API_BASE_URL}/config/promotions`),
          fetch(`${API_BASE_URL}/config/site`),
          fetch(`${API_BASE_URL}/config/discovery`)
        ]);
        const promoData = await promoRes.json();
        const configData = await configRes.json();
        const gridData = await gridRes.json();

        setSiteConfig(configData.config || {});
        setHomeGrids(gridData.grids && gridData.grids.length > 0 ? gridData.grids : [
          { id: 'g1', title: 'Hardware Studio', items: ['Keyboards', 'Mice', 'Monitors', 'Audio Interface'] },
          { id: 'g2', title: 'Acoustic Control', items: ['Panels', 'Foam', 'Bass Traps', 'Diffusers'] },
          { id: 'g3', title: 'Studio Gear', items: ['Headphones', 'Mics', 'Cables', 'Stands'] },
          { id: 'g4', title: 'Workspaces', items: ['Desks', 'Chairs', 'Lighting', 'Organizers'] }
        ]);
        
        // Map Hero Banners
        const heroes = (promoData.promotions || [])
          .filter((p: any) => p.type === 'hero_banner')
          .map((p: any) => ({
            title: p.title,
            subtitle: p.subtitle,
            image: p.imageUrl,
            cta: p.ctaText || 'Shop Now',
            link: p.linkUrl || '/search',
            price: p.price
          }));
        setHeroSlides(heroes.length > 0 ? heroes : [
          { subtitle: "Masterpiece Collection", title: "Audio Studio Pro", image: heroImg, cta: "Explore Assets", link: "/search", price: "29,900" }
        ]);

        // Map Bank Offers
        const mappedBankOffers = (promoData.promotions || [])
          .filter((p: any) => p.type === 'bank_offer')
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle
          }));
        setBankOffers(mappedBankOffers.length > 0 ? mappedBankOffers : [
          { id: 'b1', title: 'HDFC', subtitle: '10% Instant Discount on HDFC Bank Credit Cards' },
          { id: 'b2', title: 'ICICI', subtitle: 'Extra ₹2,500 Off on ICICI Bank EMI Transactions' }
        ]);

      } catch (e) {
        console.error('Failed to fetch data', e);
        // Fallback Data for stability
        // Comprehensive Fallback Data for stability
        const fallbackProducts = Array.from({ length: 24 }, (_, i) => ({
          id: `f${i}`,
          name: [
            'Obsidian Keyboard V4', 'Studio Monitor X-Pro', 'Neural Mic Ultra', 'Glass Mousepad Elite',
            'Acoustic Diffuser Panel', 'Ergo Arm Pro', 'Thunderbolt Hub 12', 'Studio Desk Mini',
            'Noise Cancel Headphones', 'Macro Deck V2', 'Cable Management Kit', 'Monitor Stand Pro',
            'LED Studio Strip', 'External SSD Rack', 'Pop Filter Elite', 'XLR Master Cable',
            'Studio Chair Carbon', 'Footrest Comfort+', 'Tablet Pro Mount', 'Knob Master Controller',
            'Shield Screen Filter', 'Desk Mat Leather', 'Mouse Grip Pro', 'Keycap Set Obsidian'
          ][i % 24],
          price: (5000 + (i * 2000)).toLocaleString(),
          originalPrice: (7000 + (i * 2000)).toLocaleString(),
          discount: '20% OFF',
          rating: 4.5 + (Math.random() * 0.5),
          reviews: 10 + i * 5,
          image: heroImg,
          tag: i % 5 === 0 ? 'New' : i % 7 === 0 ? 'Bestseller' : null
        }));
        setProducts(fallbackProducts);
        setFlashDeals(fallbackProducts.filter(p => p.tag === 'New').slice(0, 8));
        
        setCategories([
          { label: "Cyber Hardware", slug: "cyber", icon: <Cpu size={20} /> },
          { label: "Obsidian Series", slug: "obsidian", icon: <Shield size={20} /> },
          { label: "Hyper Performance", slug: "hyper", icon: <Zap size={20} /> },
          { label: "Studio Audio", slug: "audio", icon: <Headphones size={20} /> },
          { label: "Artisan Essentials", slug: "artisan", icon: <Sparkles size={20} /> }
        ]);

        setHeroSlides([
          { subtitle: "Masterpiece Collection", title: "Audio Studio Pro", image: heroImg, cta: "Explore Assets", link: "/search", price: "29,900" },
          { subtitle: "Visual Excellence", title: "Precision Monitor 8K", image: heroImg, cta: "View Specs", link: "/search", price: "89,000" },
          { subtitle: "Obsidian Core", title: "Mechanical Keyboard V4", image: heroImg, cta: "Configure", link: "/search", price: "15,900" }
        ]);

        setBankOffers([
          { id: 'b1', title: 'HDFC', subtitle: '10% Instant Discount on HDFC Bank Credit Cards' },
          { id: 'b2', title: 'ICICI', subtitle: 'Extra ₹2,500 Off on ICICI Bank EMI Transactions' }
        ]);

        setHomeGrids([
          { id: 'g1', title: 'Hardware Studio', items: ['Keyboards', 'Mice', 'Monitors', 'Audio Interface'] },
          { id: 'g2', title: 'Acoustic Control', items: ['Panels', 'Foam', 'Bass Traps', 'Diffusers'] },
          { id: 'g3', title: 'Studio Gear', items: ['Headphones', 'Mics', 'Cables', 'Stands'] },
          { id: 'g4', title: 'Workspaces', items: ['Desks', 'Chairs', 'Lighting', 'Organizers'] }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);

  const featuredItems = products.slice(0, 8);
  const newArrivals = products.slice(4, 12);
  const trendingItems = products.slice(8, 16);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);
    }
  };

  const getGridItemImage = (itemName: string) => {
    // Better fuzzy matching for dynamic data
    const terms = itemName.toLowerCase().split(' ');
    const prod = products.find(p => 
      terms.some(term => p.name.toLowerCase().includes(term)) ||
      p.category.toLowerCase().includes(terms[0])
    );
    return prod ? prod.image : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80';
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
              <Globe size={18} />
              <span>{siteConfig.guarantee_shipping || 'Fast Global Shipping'}</span>
            </div>
            <div className={styles.trustItem}>
              <RotateCcw size={18} />
              <span>{siteConfig.guarantee_returns || '30-Day Easy Returns'}</span>
            </div>
            <div className={styles.trustItem}>
              <ShieldCheck size={18} />
              <span>{siteConfig.guarantee_warranty || '2 Year Brand Warranty'}</span>
            </div>
            <div className={styles.trustItem}>
              <Shield size={18} />
              <span>{siteConfig.guarantee_secure || 'Secure Payment PCI-DSS'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BANK OFFERS STRIP - Backend Controlled */}
      <div className={styles.bankStrip}>
        <div className={styles.container}>
          <div className={styles.bankGrid}>
            {bankOffers.map((offer) => (
              <div key={offer.id} className={styles.bankItem}>
                <div className={styles.bankIcon}>{offer.title}</div>
                <p>{offer.subtitle}</p>
              </div>
            ))}
            {bankOffers.length === 0 && (
              <>
                <div className={styles.bankItem}>
                  <div className={styles.bankIcon}>HDFC</div>
                  <p>10% Instant Discount on HDFC Bank Credit Cards</p>
                </div>
                <div className={styles.bankItem}>
                  <div className={styles.bankIcon}>ICICI</div>
                  <p>Extra ₹2,500 Off on ICICI Bank EMI Transactions</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. CATEGORY NAV - DESKTOP */}
      <nav className={`${styles.nexusCategoryStrip} ${isScrolled ? styles.scrolled : ''} hide-mobile`}>
        <div className={styles.container}>
          <div className={styles.catScrollContainer}>
            <div className={styles.nexusCatGrid}>
              {categories.map((cat, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.02 }}
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

      {/* 2. CATEGORY NAV - MOBILE EXCLUSIVE */}
      <div className={`${styles.mobileCategoryRow} ${isScrolled ? styles.mobileScrolled : ''} mobile-only`}>
        <div className={styles.mobileCategoryContainer}>
          {categories.map((cat, i) => (
            <motion.div 
              key={i} 
              whileTap={{ scale: 0.95 }}
              className={styles.mobileCategoryItem}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat.label)}`)}
            >
              <div className={styles.mobileCategoryIcon}>{cat.icon}</div>
              <span>{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      {/* MOBILE APP-ONLY EXCLUSIVE BANNER */}
      <section className={`${styles.mobileExclusiveSection} hide-desktop`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.mobileExclusiveCard}
        >
          <div className={styles.exclusiveHeader}>
            <div className={styles.pulseIcon}>
              <Smartphone size={24} />
            </div>
            <div>
              <h3>App-Only Flash Sale</h3>
              <p>Exclusive assets for mobile artisans</p>
            </div>
          </div>
          <div className={styles.exclusiveTimer}>
            <span className={styles.timerLabel}>ENDS IN</span>
            <span className={styles.timerValue}>04 : 22 : 10</span>
          </div>
          <div className={styles.exclusiveActions}>
            <Button size="lg" variant="primary" fullWidth>Claim Offer</Button>
            <p className={styles.exclusiveTerms}>*Terms and conditions apply. Mobile only.</p>
          </div>
        </motion.div>
      </section>




      {/* 3. HERO */}
      {heroSlides.length > 0 && (
        <section className={styles.hero}>
          <motion.img 
            src={heroSlides[currentHero].image} 
            style={{ scale: heroScale, opacity: heroOpacity }} 
            className={styles.heroImage} 
          />
          <div className={styles.heroBackground} />
          {/* DESKTOP HERO CONTENT */}
          <div className={`${styles.heroContent} hide-mobile`}>
            <motion.div 
              key={currentHero}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={styles.glassCard}
            >
              <div className={styles.ecosystemBadge}>
                <Sparkles size={14} />
                <span>{heroSlides[currentHero].subtitle.includes('Audio') ? 'AUDIO MASTERCLASS' : 'NEXUS ECOSYSTEM'}</span>
              </div>
              <motion.p {...fadeInUp} className={styles.heroSubtitle}>{heroSlides[currentHero].subtitle}</motion.p>
              <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className={styles.heroTitle}>{heroSlides[currentHero].title}</motion.h1>
              
              {heroSlides[currentHero].title.includes('Audio') && (
                <div className={styles.audioVisualizer}>
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 24, 8, 20, 4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className={styles.vizBar}
                    />
                  ))}
                </div>
              )}

              <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className={styles.heroActions}>
                <Button size="lg" onClick={() => navigate(heroSlides[currentHero].link)}>{heroSlides[currentHero].cta}</Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/discovery')}>Tech Specs</Button>
              </motion.div>
            </motion.div>
          </div>

          {/* MOBILE EXCLUSIVE HERO CONTENT */}
          <div className={`${styles.heroContentMobile} mobile-only`}>
            <motion.div {...fadeInUp} className={styles.mobileBadge}>PLATINUM ASSET</motion.div>
            <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className={styles.mobileHeroTitle}>{heroSlides[currentHero].title}</motion.h1>
            <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className={styles.mobileHeroSubtitle}>{heroSlides[currentHero].subtitle}</motion.p>
            <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className={styles.mobileHeroPrice}>
              <span className={styles.from}>From</span>
              <span className={styles.price}>₹{heroSlides[currentHero].price || '12,900'}</span>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.4 }} style={{ marginTop: '16px' }}>
              <Button variant="primary" onClick={() => navigate(heroSlides[currentHero].link)} fullWidth>Explore Hardware</Button>
            </motion.div>
          </div>
          
          <div className={styles.heroIndicators}>
            {heroSlides.map((_, i) => (
              <div 
                key={i} 
                className={`${styles.indicator} ${currentHero === i ? styles.active : ''}`}
                onClick={() => setCurrentHero(i)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. DISCOVERY GRIDS */}
      <section className={styles.discoverySection}>
        <div className={styles.container}>
          <div className={styles.amazonGrid}>
            {homeGrids.map((group, i) => (
              <motion.div 
                key={group.id || i} 
                {...fadeInUp} 
                transition={{ delay: i * 0.1 }}
                className={styles.gridCard}
              >
                <h3>{group.title}</h3>
                <div className={styles.miniGrid}>
                  {(group.items || []).map((item: string, j: number) => (
                    <div 
                      key={j} 
                      className={styles.miniItem}
                      onClick={() => navigate(`/search?q=${encodeURIComponent(item)}`)}
                    >
                      <div className={styles.miniThumb}>
                        <img 
                          src={getGridItemImage(item) || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80'} 
                          alt="" 
                          loading="lazy"
                        />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.gridLink} onClick={() => navigate(group.link || `/search?category=${encodeURIComponent(group.title)}`)}>
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
          {/* DESKTOP FLASH HEADER */}
          <motion.div {...fadeInUp} className={`${styles.flashHeader} hide-mobile`}>
            <div className={styles.flashTitle}>
              <Zap size={24} fill="#000" stroke="#000" />
              <h2>Deals of the Day</h2>
              <div className={styles.timer}>Ends soon</div>
            </div>
            <div className={styles.viewAll} onClick={() => navigate('/search?filter=deals')}>View All Offers</div>
          </motion.div>

          {/* MOBILE FLASH HEADER */}
          <motion.div {...fadeInUp} className={`${styles.mobileFlashHeader} mobile-only`}>
            <div className={styles.mobileFlashTop}>
              <div className={styles.flashTitle}>
                <Zap size={20} fill="#000" stroke="#000" />
                <h2>Deals of the Day</h2>
              </div>
              <div className={styles.viewAll} onClick={() => navigate('/search?filter=deals')}>See All</div>
            </div>
            <div className={styles.mobileTimer}>Ends in 04h 22m 10s</div>
          </motion.div>
          
          <div className={styles.carouselWrapper}>
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`${styles.scrollBtn} ${styles.left} hide-mobile`} 
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
                  className={`${styles.scrollBtn} ${styles.right} hide-mobile`} 
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
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <div key={i} className={styles.carouselItem}>
                    <ProductSkeleton />
                  </div>
                ))
              ) : (
                flashDeals.map(product => (
                  <div key={product.id} className={styles.carouselItem}>
                    <ProductCard {...product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE AD BANNERS */}
      <section className={styles.section}>
        <div className={styles.container}>
          {/* DESKTOP AD ROW */}
          <div className={`${styles.adRow} hide-mobile`}>
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

          {/* MOBILE AD SCROLL */}
          <div className={`${styles.mobileAdScroll} mobile-only`}>
            {[
              { title: 'Pro Audio', sub: 'STUDIO SERIES', bg: '#000', color: '#fff' },
              { title: 'Oak & Walnut', sub: 'SUSTAINABILITY', bg: '#f5f5f5', color: '#000' },
              { title: 'Steel Grey', sub: 'LIMITED DROP', bg: '#ffffff', color: '#000', border: true }
            ].map((ad, i) => (
              <div 
                key={i}
                className={styles.mobileAdCard} 
                style={{ backgroundColor: ad.bg, color: ad.color, border: ad.border ? '1px solid var(--color-border)' : undefined }}
                onClick={() => navigate('/discovery')}
              >
                <span className={styles.adSub}>{ad.sub}</span>
                <h3 className={styles.adTitle}>{ad.title}</h3>
                <div className={styles.adBannerActions}>
                  <Button size="sm" variant={ad.bg === '#000' ? 'outline' : 'primary'}>Explore</Button>
                </div>
              </div>
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
              {loading ? (
                [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
              ) : (
                newArrivals.map((product, i) => (
                  <motion.div key={product.id} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                    <ProductCard {...product} />
                  </motion.div>
                ))
              )}
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
            {loading ? (
              [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              featuredItems.map((product, i) => (
                <motion.div key={product.id} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                  <ProductCard {...product} />
                </motion.div>
              ))
            )}
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

      {/* 8. STUDIO GALLERY */}
      <section className={styles.section} style={{ backgroundColor: '#fff' }}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <span className={styles.headerLabel}>Curated Hardware</span>
            <h2 className={styles.sectionTitleLarge}>The Studio Gallery</h2>
          </div>
          <div className={styles.galleryGrid}>
            <motion.div {...fadeInUp} className={styles.galleryItem}>
              <img src={galleryImg1} alt="Studio Setup" />
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className={styles.galleryTextCard}>
              <div className={styles.textLeft}>
                <h3>Precision Built</h3>
                <p>Hardware that feels as good as it looks. Every asset is a statement of intent.</p>
              </div>
              <ArrowRight className={styles.arrowIcon} size={32} />
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className={styles.galleryItem}>
              <img src={aboutHeroImg} alt="Hardware Detail" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className={styles.section} style={{ backgroundColor: '#fbfbfb' }}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <span className={styles.headerLabel}>Community Echo</span>
            <h2 className={styles.sectionTitleLarge}>Trusted by Producers</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp} 
                transition={{ delay: i * 0.1 }}
                className={styles.testimonialCard}
              >
                <Quote className={styles.quoteIcon} size={40} />
                <p>{t.quote}</p>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{t.author}</span>
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
