import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Cake } from '../types';
import { getStoredCakes, subscribeToStoreEvents } from '../data/store';
import { HeroSection } from '../components/home/HeroSection';
import { OccasionShortcuts } from '../components/home/OccasionShortcuts';
import { FeaturedCakes } from '../components/home/FeaturedCakes';
import { ServingCalculator } from '../components/home/ServingCalculator';
import { FlavorMatcherModal } from '../components/home/FlavorMatcherModal';
import { HowItWorks } from '../components/home/HowItWorks';
import { VerifiedReviews } from '../components/home/VerifiedReviews';
import { BakeryStoryTeaser } from '../components/home/BakeryStoryTeaser';
import { MapLocationCard } from '../components/home/MapLocationCard';
import { QuickEnquiryModal } from '../components/common/QuickEnquiryModal';
import { LightboxModal, LightboxImageItem } from '../components/common/LightboxModal';
import { GoogleReviewModal } from '../components/common/GoogleReviewModal';
import { Sparkles } from 'lucide-react';

// Lazy-load Three.js 3D WebGL Studio for maximum page performance & instant first-contentful-paint
const CakeStudio3D = lazy(() => import('../components/3d/CakeStudio3D').then(m => ({ default: m.CakeStudio3D })));

function StudioLoadingSkeleton() {
  return (
    <div className="py-20 bg-gradient-to-b from-[#FFFDF9] to-[#FFF9F2] text-center">
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#F0E5D8] shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#FBE6EC] flex items-center justify-center text-[#C9365B] mx-auto animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg font-bold text-[#382722]">
          Loading 3D WebGL Cake Studio
        </h3>
        <p className="text-xs text-[#8A7269]">
          Preparing real-time 3D patisserie canvas...
        </p>
      </div>
    </div>
  );
}

export const HomePage: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>(() => getStoredCakes());
  
  // Modals state
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<LightboxImageItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [isGoogleReviewOpen, setIsGoogleReviewOpen] = useState(false);
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);

  // Subscribe to real-time catalogue updates
  useEffect(() => {
    const unsubscribe = subscribeToStoreEvents((action) => {
      if (action === 'cakes_updated') {
        setCakes(getStoredCakes());
      }
    });
    return unsubscribe;
  }, []);

  // Quick enquiry handler from any section
  const handleOpenEnquiry = (cake?: Cake) => {
    setSelectedCake(cake || null);
    setIsEnquiryOpen(true);
  };

  // Quick view / lightbox handler
  const handleQuickView = (cake: Cake) => {
    const items: LightboxImageItem[] = cake.galleryImages.map((url, idx) => ({
      id: `${cake.id}-img-${idx}`,
      url,
      title: cake.name,
      category: cake.category,
      description: cake.description,
      cakeSlug: cake.slug,
    }));

    if (items.length === 0) {
      items.push({
        id: `${cake.id}-img-0`,
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

  // From interactive 3D Cake Studio
  const handle3DCakeOrder = (specs: {
    flavor: string;
    weight: string;
    dietary: 'eggless' | 'regular' | 'pure_veg';
    frosting: string;
    message: string;
    estimatedPrice: number;
    toppings: string[];
    tiers: number;
  }) => {
    const toppingsLabel = specs.toppings.length > 0 ? specs.toppings.join(', ') : 'Classic finish';
    const virtualCake: Cake = {
      id: `custom-3d-${Date.now()}`,
      slug: 'custom-3d-cake',
      name: `Custom ${specs.tiers}-Tier ${specs.flavor}`,
      category: 'Custom Art & 3D',
      categoryId: 'custom-art',
      description: `Handcrafted ${specs.tiers}-Tier cake in ${specs.frosting}. Accented with ${toppingsLabel}. Piped inscription: “${specs.message}”.`,
      priceDisplay: `Approx ₹${specs.estimatedPrice}`,
      imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=900&q=80',
      galleryImages: [],
      featured: true,
      flavors: [specs.flavor],
      isEgglessAvailable: specs.dietary !== 'regular',
      isPureVegSpecial: specs.dietary === 'pure_veg',
      spongeOptions: [specs.flavor],
      weightOptions: [specs.weight],
      leadTime: 'Order 24h advance',
      rating: 5.0,
      reviewCount: 1,
      tags: ['3D Sculpted', 'Custom Design'],
    };

    setSelectedCake(virtualCake);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section with 3D Image Parallax and Matcher Trigger */}
      <HeroSection 
        onOpenEnquiry={() => handleOpenEnquiry()} 
        onOpenMatcher={() => setIsMatcherOpen(true)}
      />

      {/* 2. Occasion Shortcuts */}
      <OccasionShortcuts />

      {/* 3. Featured Cakes with 3D Perspective Tilt Cards */}
      <FeaturedCakes
        cakes={cakes}
        onQuickView={handleQuickView}
        onEnquire={handleOpenEnquiry}
      />

      {/* 4. High-Performance Interactive 3D WebGL Cake Studio (Lazy Loaded) */}
      <Suspense fallback={<StudioLoadingSkeleton />}>
        <CakeStudio3D onOrderCustomCake={handle3DCakeOrder} />
      </Suspense>

      {/* 5. Interactive Portion & Serving Calculator */}
      <ServingCalculator />

      {/* 6. 3-Step Ordering Process */}
      <HowItWorks />

      {/* 7. Verified Reviews & 5.0 Google Rating */}
      <VerifiedReviews onOpenGoogleReviewModal={() => setIsGoogleReviewOpen(true)} />

      {/* 8. Local Story & Baking Philosophy */}
      <BakeryStoryTeaser />

      {/* 9. Map & Location Card */}
      <MapLocationCard />

      {/* Interactive Modals */}
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

      <GoogleReviewModal
        isOpen={isGoogleReviewOpen}
        onClose={() => setIsGoogleReviewOpen(false)}
      />

      {/* Interactive Cake Matcher Quiz Modal */}
      <FlavorMatcherModal
        isOpen={isMatcherOpen}
        onClose={() => setIsMatcherOpen(false)}
        onSelectCake={(cake) => handleOpenEnquiry(cake)}
      />
    </div>
  );
};
