import React, { useState } from 'react';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import FilterSidebar from '../components/ui/FilterSidebar';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';
import styles from './Search.module.css';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Hardware');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const categories = ['All Hardware', 'Mobiles', 'Laptops', 'Audio', 'Gaming', 'Accessories'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Hardware' || p.category === selectedCategory;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className={styles.page}>
      <FilterSidebar 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.searchBarWrapper}>
              <div className={styles.searchBar}>
                <SearchIcon size={20} />
                <input 
                  type="text" 
                  placeholder="Search studio assets..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && <X size={18} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />}
              </div>
              
              {/* MOBILE/TABLET FILTER BUTTON */}
              <button 
                className={`${styles.filterToggle} hide-desktop`}
                onClick={() => setIsFiltersOpen(true)}
              >
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </button>
            </div>

            <div className={styles.resultsMeta}>
              <h2 className={styles.resultsCount}>{filteredProducts.length} Results</h2>
              <div className={styles.sortWrapper}>
                <span className={styles.sortLabel}>SORT BY:</span>
                <select className={styles.sortSelect}>
                  <option>Relevance</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </header>

          <div className={styles.grid}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className={styles.emptyState}>
              <SearchIcon size={64} strokeWidth={1} className={styles.emptyIcon} />
              <h3>No results matching "{searchQuery}"</h3>
              <p>Try adjusting your filters or search terms for a broader range.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
