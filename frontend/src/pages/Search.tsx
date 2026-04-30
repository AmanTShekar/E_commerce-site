import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import FilterSidebar from '../components/ui/FilterSidebar';
import ProductCard from '../components/ui/ProductCard';
// import { products } from '../data/products';
import styles from './Search.module.css';
import { API_BASE_URL } from '../config/constants';

import { useSearchParams } from 'react-router-dom';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);
  const [selectedCategory, setSelectedCategory] = useState('All Hardware');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Hardware']);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        setCategories(['All Hardware', ...data.categories.map((c: any) => c.name)]);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products${searchQuery ? `?q=${searchQuery}` : ''}`);
        const data = await res.json();
        const formatted = data.products.map((p: any) => ({
          id: p.id,
          name: p.title,
          price: p.price,
          oldPrice: p.mrp > p.price ? p.mrp : undefined,
          discount: p.mrp > p.price ? `${Math.round(((p.mrp - p.price) / p.mrp) * 100)}%` : undefined,
          category: p.categoryName || 'Studio Gear',
          rating: 4.5 + (Math.random() * 0.5),
          image: p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
        }));
        setProducts(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const filteredProducts = products.filter(p => {
    // Only filtering by price and category locally since backend handles text search
    const matchesCategory = selectedCategory === 'All Hardware' || p.category === selectedCategory;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesCategory && matchesPrice;
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchParams({ q: e.target.value });
                  }}
                />
                {searchQuery && <X size={18} style={{ cursor: 'pointer' }} onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                }} />}
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
