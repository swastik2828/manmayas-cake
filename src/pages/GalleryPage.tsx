import React, { useState } from 'react';
import { LightboxModal, LightboxImageItem } from '../components/common/LightboxModal';
import { QuickEnquiryModal } from '../components/common/QuickEnquiryModal';
import { Sparkles, Eye, Filter, Leaf } from 'lucide-react';
import { Cake } from '../types';

interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  category: string;
  categorySlug: string;
  caption: string;
  isPureVeg?: boolean;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80',
    title: 'Feather Wings Signature Cake',
    category: 'Feather Wings',
    categorySlug: 'feather-wings',
    caption: 'Sculpted wings with delicate edible gold leaf and macarons, created for a 1st birthday in Kavisuryanagar.',
    isPureVeg: true
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80',
    title: 'Strawberry Pistachio Bloom',
    category: 'Celebration',
    categorySlug: 'celebration',
    caption: 'Farm-fresh strawberries layered on velvety roasted pistachio sponge with fresh organic rose petals.',
    isPureVeg: true
  },
  {
    id: 'gal-3',
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    title: 'Royal Belgian Truffle Crown',
    category: 'Birthday',
    categorySlug: 'birthday',
    caption: 'Moist Dutch cocoa layers coated with decadent 55% chocolate ganache and chocolate truffle spheres.',
    isPureVeg: true
  },
  {
    id: 'gal-4',
    url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=80',
    title: 'Rose Gold Floral Wedding Tier',
    category: 'Wedding',
    categorySlug: 'wedding',
    caption: 'Handcrafted ivory buttercream roses and edible rose-gold luster dust for a grand reception.',
    isPureVeg: true
  },
  {
    id: 'gal-5',
    url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1200&q=80',
    title: 'Golden Honey Butterscotch',
    category: 'Birthday',
    categorySlug: 'birthday',
    caption: 'House-made caramel toffee, crunchy cashew praline, and golden honeycomb spirals.',
    isPureVeg: true
  },
  {
    id: 'gal-6',
    url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80',
    title: 'Rainbow Confetti Kids Dream',
    category: 'Custom Art',
    categorySlug: 'custom-art',
    caption: 'Pastel buttercream cloud swirls and festive sprinkles made for a joyful children’s party.',
    isPureVeg: true
  },
  {
    id: 'gal-7',
    url: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1200&q=80',
    title: 'Red Velvet Royale',
    category: 'Celebration',
    categorySlug: 'celebration',
    caption: 'Silky red velvet cocoa crumb with rich cream cheese frosting swirl and fresh berry accents.',
    isPureVeg: true
  },
  {
    id: 'gal-8',
    url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80',
    title: 'Kesar Mango Shahi Velvet',
    category: 'Pure Veg',
    categorySlug: 'pure-veg',
    caption: '100% pure vegetarian creation infused with aromatic saffron (kesar) and alfonso mango pulp.',
    isPureVeg: true
  },
  {
    id: 'gal-9',
    url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80',
    title: 'Artisan Drip Celebration',
    category: 'Birthday',
    categorySlug: 'birthday',
    caption: 'Dark chocolate drip over vanilla bean buttercream with golden sprinkles and custom cake topper.',
    isPureVeg: true
  }
];

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'feather-wings', label: 'Feather Wings Signature' },
    { id: 'birthday', label: 'Birthday Cakes' },
    { id: 'wedding', label: 'Wedding & Tiers' },
    { id: 'celebration', label: 'Celebrations' },
    { id: 'custom-art', label: 'Custom Art' },
    { id: 'pure-veg', label: 'Pure Veg Specials' },
  ];

  const filteredPhotos = selectedCategory === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(p => p.categorySlug === selectedCategory);

  const lightboxItems: LightboxImageItem[] = filteredPhotos.map(p => ({
    id: p.id,
    url: p.url,
    title: p.title,
    category: p.category,
    description: p.caption,
  }));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBE6EC] text-[#C9365B] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bakery Visual Portfolio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#382722] tracking-tight">
            Our Cake Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#664E46] mt-2">
            Browse genuine cake designs baked and decorated right here for celebrations in Kavisuryanagar and Boirani. Tap any photo to zoom in full detail.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#C9365B] text-white shadow-xs'
                  : 'bg-white text-[#5A433B] border border-[#F0E5D8] hover:border-[#F5A5B8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Editorial Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className="group cursor-pointer bg-white rounded-3xl border border-[#F0E5D8] overflow-hidden bakery-card-shadow bakery-card-hover transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF5EF]">
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-xs text-[#382722] text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-4 h-4 text-[#C9365B]" />
                    <span>View in Lightbox</span>
                  </div>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-xs text-[#C9365B] shadow-xs">
                    {photo.category}
                  </span>
                </div>

                {photo.isPureVeg && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF7EA] text-[#55853B] border border-[#B8D4A5] shadow-xs flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      <span>Pure Veg</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#382722] group-hover:text-[#C9365B] transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-[#664E46] mt-1 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#FAF5EF] flex items-center justify-between text-xs text-[#C9365B] font-bold">
                  <span>Enquire about this cake &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <LightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          items={lightboxItems}
          currentIndex={currentIndex}
          onNavigate={setCurrentIndex}
        />

      </div>
    </div>
  );
};
