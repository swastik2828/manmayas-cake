import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Cake, CakeCategory } from '../types';
import { getStoredCakes, subscribeToStoreEvents } from '../data/store';
import { CAKE_CATEGORIES } from '../data/categoriesData';
import { CakeCard } from '../components/common/CakeCard';
import { QuickEnquiryModal } from '../components/common/QuickEnquiryModal';
import { LightboxModal, LightboxImageItem } from '../components/common/LightboxModal';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  X, 
  Leaf, 
  Filter,
  Check
} from 'lucide-react';

export const CakesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [cakes, setCakes] = useState<Cake[]>(() => getStoredCakes());

  useEffect(() => {
    const unsubscribe = subscribeToStoreEvents((action) => {
      if (action === 'cakes_updated') {
        setCakes(getStoredCakes());
      }
    });
    return unsubscribe;
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-asc' | 'price-desc'>('featured');

  // Modals
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<LightboxImageItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter cakes
  const filteredCakes = useMemo(() => {
    return cakes
      .filter((cake) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (cake.categoryId !== selectedCategory) return false;
        }

        // Eggless only filter
        if (egglessOnly && !cake.isEgglessAvailable) {
          return false;
        }

        // Search text
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = cake.name.toLowerCase().includes(query);
          const matchDesc = cake.description.toLowerCase().includes(query);
          const matchFlavor = cake.flavors.some((f) => f.toLowerCase().includes(query));
          const matchTag = cake.tags.some((t) => t.toLowerCase().includes(query));
          if (!matchName && !matchDesc && !matchFlavor && !matchTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-asc') return (a.indicativePrice || 0) - (b.indicativePrice || 0);
        if (sortBy === 'price-desc') return (b.indicativePrice || 0) - (a.indicativePrice || 0);
        // Default featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [cakes, selectedCategory, egglessOnly, searchQuery, sortBy]);

  const handleCategorySelect = (catSlug: string) => {
    setSelectedCategory(catSlug);
    if (catSlug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catSlug);
    }
    setSearchParams(searchParams);
  };

  const handleOpenEnquiry = (cake: Cake) => {
    setSelectedCake(cake);
    setIsEnquiryOpen(true);
  };

  const handleQuickView = (cake: Cake) => {
    const items: LightboxImageItem[] = cake.galleryImages.map((url, idx) => ({
      id: `${cake.id}-${idx}`,
      url,
      title: cake.name,
      category: cake.category,
      description: cake.description,
      cakeSlug: cake.slug,
    }));
    if (items.length === 0) {
      items.push({
        id: `${cake.id}-0`,
        url: cake.imageUrl,
        title: cake.name,
        category: cake.category,
        description: cake.description,
        cakeSlug: cake.slug,
      });
    }
    setLightboxItems(items);
    setLightboxIndex(0);
    setIsLightboxOpen(true);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setEgglessOnly(false);
    setSortBy('featured');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBE6EC] text-[#C9365B] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handcrafted Bakery Catalogue</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#382722] tracking-tight">
            Our Cake Creations
          </h1>
          <p className="text-sm sm:text-base text-[#664E46] mt-2">
            Discover signature feather wings cakes, birthday centerpieces, tiered wedding cakes, and pure-vegetarian favorites in Kavisuryanagar.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl border border-[#F0E5D8] p-4 sm:p-6 shadow-sm mb-8 space-y-4">
          
          {/* Top Search & Sort Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A7269] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by cake name, flavor, or theme (e.g. Truffle, Wings, Vanilla)..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#FFF9F2] border border-[#F0E5D8] text-sm text-[#382722] placeholder-[#8A7269] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7269] hover:text-[#382722]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Eggless Toggle */}
            <button
              type="button"
              onClick={() => setEgglessOnly(!egglessOnly)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 shrink-0 ${
                egglessOnly
                  ? 'bg-[#EFF7EA] border-[#55853B] text-[#55853B] shadow-xs'
                  : 'bg-white border-[#F0E5D8] text-[#5A433B] hover:border-[#B8D4A5]'
              }`}
            >
              <Leaf className="w-4 h-4 text-[#55853B]" />
              <span>100% Eggless Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full md:w-auto px-4 py-3 rounded-2xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs font-bold text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
              >
                <option value="featured">Sort: Featured First</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
              </select>
            </div>

          </div>

          {/* Category Filter Chips */}
          <div className="pt-2 border-t border-[#FAF5EF] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CAKE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#C9365B] text-white shadow-xs'
                    : 'bg-[#FFF9F2] text-[#5A433B] border border-[#F0E5D8] hover:border-[#F5A5B8]'
                }`}
              >
                <span>{cat.name}</span>
                {selectedCategory === cat.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />
                )}
              </button>
            ))}
          </div>

          {/* Active Filters Summary */}
          {(selectedCategory !== 'all' || egglessOnly || searchQuery.trim()) && (
            <div className="pt-2 flex items-center justify-between text-xs text-[#8A7269]">
              <div>
                Showing <strong className="text-[#382722]">{filteredCakes.length}</strong> matching cake designs
              </div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[#C9365B] font-bold hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Cakes Grid */}
        {filteredCakes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCakes.map((cake) => (
              <CakeCard
                key={cake.id}
                cake={cake}
                onQuickView={handleQuickView}
                onEnquire={handleOpenEnquiry}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E5D8] max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF2E2] text-[#C9365B] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#382722]">
              No exact designs found
            </h3>
            <p className="text-xs sm:text-sm text-[#664E46] mt-1 mb-6">
              We can custom-bake any design you imagine! Submit your reference photo or clear your search filters.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#F0E5D8] text-xs font-bold text-[#382722]"
              >
                Clear Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCake(null);
                  setIsEnquiryOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#C9365B] text-white text-xs font-bold shadow-xs"
              >
                Request Custom Cake
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        <QuickEnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          preselectedCake={selectedCake}
        />

        <LightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          items={lightboxItems}
          currentIndex={lightboxIndex}
          onNavigate={setLightboxIndex}
        />

      </div>
    </div>
  );
};
