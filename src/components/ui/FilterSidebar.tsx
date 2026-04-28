import React from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  isOpen,
  onClose
}) => {
  const content = (
    <div className={styles.sidebarContent}>
      <div className={styles.header}>
        <SlidersHorizontal size={18} />
        <h2>Filters</h2>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Categories</h3>
          <ChevronDown size={16} />
        </div>
        <div className={styles.options}>
          {categories.map(cat => (
            <label key={cat} className={styles.option}>
              <input 
                type="radio" 
                name="category" 
                checked={selectedCategory === cat}
                onChange={() => onCategoryChange(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Price Range</h3>
          <ChevronDown size={16} />
        </div>
        <div className={styles.priceInputs}>
          <div className={styles.inputField}>
            <span>Min</span>
            <input 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
            />
          </div>
          <div className={styles.inputField}>
            <span>Max</span>
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Availability</h3>
          <ChevronDown size={16} />
        </div>
        <div className={styles.options}>
          <label className={styles.option}>
            <input type="checkbox" defaultChecked />
            <span>In Stock</span>
          </label>
          <label className={styles.option}>
            <input type="checkbox" />
            <span>Pre-order</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`${styles.sidebarDesktop} show-desktop`}>
        {content}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.overlay}
              onClick={onClose}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={styles.sidebarMobile}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterSidebar;
