import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStoredCakes, subscribeToStoreEvents } from '../data/store';
import { Cake } from '../types';
import { CakeCard } from '../components/common/CakeCard';
import { QuickEnquiryModal } from '../components/common/QuickEnquiryModal';
import { LightboxModal, LightboxImageItem } from '../components/common/LightboxModal';
import { INITIAL_SITE_SETTINGS } from '../data/siteSettings';
import { 
  Star, 
  Sparkles, 
  Leaf, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  ChevronRight, 
  Eye, 
  Users,
  Check
} from 'lucide-react';

export const CakeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [cakes, setCakes] = useState<Cake[]>(() => getStoredCakes());

  useEffect(() => {
    const unsubscribe = subscribeToStoreEvents((action) => {
      if (action === 'cakes_updated') {
        setCakes(getStoredCakes());
      }
    });
    return unsubscribe;
  }, []);

  const cake = cakes.find((c) => c.slug === slug);

  // Gallery active index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!cake) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FFF9F2]">
        <h2 className="font-serif text-3xl font-bold text-[#382722] mb-2">Cake Not Found</h2>
        <p className="text-sm text-[#664E46] mb-6">The cake design you requested might have been moved or updated.</p>
        <Link
          to="/cakes"
          className="px-5 py-2.5 rounded-xl bg-[#C9365B] text-white text-xs font-bold"
        >
          Back to Cake Catalogue
        </Link>
      </div>
    );
  }

  const allImages = cake.galleryImages.length > 0 ? cake.galleryImages : [cake.imageUrl];
  const relatedCakes = cakes.filter((c) => c.id !== cake.id && c.categoryId === cake.categoryId).slice(0, 3);

  const lightboxItems: LightboxImageItem[] = allImages.map((url, idx) => ({
    id: `${cake.id}-dtl-${idx}`,
    url,
    title: cake.name,
    category: cake.category,
    description: cake.description,
  }));

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Hello Manmaya's Cake Delights,\nI am viewing "${cake.name}" on your website.\n\nCould you please share the quotation and availability for my celebration date? Thank you!`
    );
    window.open(`https://wa.me/${INITIAL_SITE_SETTINGS.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#8A7269]">
          <Link to="/" className="hover:text-[#C9365B] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#C8B8AE]" />
          <Link to="/cakes" className="hover:text-[#C9365B] transition-colors">Our Cakes</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#C8B8AE]" />
          <span className="text-[#382722] truncate max-w-[200px] sm:max-w-none">{cake.name}</span>
        </nav>

        {/* Cake Main Details Card */}
        <div className="bg-white rounded-3xl border border-[#F0E5D8] p-5 sm:p-8 lg:p-10 shadow-lg mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Gallery Images */}
            <div className="lg:col-span-6 space-y-3">
              {/* Primary Image Viewport */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF5EF] border border-[#F0E5D8] group">
                <img
                  src={allImages[activeImageIndex]}
                  alt={cake.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs text-[#382722] text-xs font-bold shadow-md hover:bg-[#C9365B] hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Zoom Fullscreen</span>
                </button>

                {cake.isEgglessAvailable && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#EFF7EA]/95 backdrop-blur-xs text-[#55853B] text-xs font-bold border border-[#B8D4A5] flex items-center gap-1 shadow-xs">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>100% Eggless Option Available</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#C9365B] scale-105 shadow-xs'
                          : 'border-[#F0E5D8] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${cake.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Specifications & Enquiry Options */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9365B] bg-[#FBE6EC] px-3 py-1 rounded-full">
                    {cake.category}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#382722]">
                    <div className="flex items-center text-[#FCD872]">
                      <Star className="w-4 h-4 fill-[#FCD872]" />
                    </div>
                    <span>{cake.rating.toFixed(1)}</span>
                    <span className="text-[#8A7269]">({cake.reviewCount} reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#382722] leading-tight">
                  {cake.name}
                </h1>

                {/* Price Display */}
                <div className="mt-3 p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F0E5D8] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A7269]">
                      Quotation & Pricing
                    </div>
                    <div className="text-lg sm:text-xl font-extrabold text-[#C9365B]">
                      {cake.priceDisplay}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#8A7269] text-right max-w-[140px] leading-tight">
                    Indicative range. Final quote confirmed upon order.
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#5A433B] leading-relaxed">
                {cake.description}
              </p>

              {/* Verified Baker Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-[#F0E5D8]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8A7269] mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#C9365B]" />
                    <span>Preparation Lead Time</span>
                  </div>
                  <div className="text-xs font-bold text-[#382722]">
                    {cake.leadTime}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#EFF7EA]/50 border border-[#B8D4A5]/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#55853B] mb-1">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Dietary Preparation</span>
                  </div>
                  <div className="text-xs font-bold text-[#382722]">
                    {cake.isEgglessAvailable ? '100% Pure Veg (Eggless) Available' : 'Traditional Sponge'}
                  </div>
                </div>

              </div>

              {/* Confirmed Available Flavors */}
              <div>
                <h4 className="text-xs font-bold text-[#382722] uppercase tracking-wider mb-2">
                  Available Flavors for this Design
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {cake.flavors.map((flavor, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-[#FFF2E2] text-[#382722] text-xs font-semibold border border-[#F0E5D8]"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Sizes / Servings */}
              <div>
                <h4 className="text-xs font-bold text-[#382722] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#8A7269]" />
                  <span>Size & Serving Options</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {cake.weightOptions.map((wt, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#5A433B] text-xs font-medium border border-[#F0E5D8]"
                    >
                      {wt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#F0E5D8] flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsEnquiryOpen(true)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-sm shadow-md shadow-[#C9365B]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Enquire About This Cake</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppEnquiry}
                  className="py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Quote</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Related Designs Section */}
        {relatedCakes.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#382722]">
                Similar Designs You Might Love
              </h3>
              <Link to="/cakes" className="text-xs font-bold text-[#C9365B] hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCakes.map((relCake) => (
                <CakeCard
                  key={relCake.id}
                  cake={relCake}
                  onEnquire={() => {
                    navigate(`/contact?cake=${encodeURIComponent(relCake.name)}&id=${relCake.id}`);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        <LightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          items={lightboxItems}
          currentIndex={activeImageIndex}
          onNavigate={setActiveImageIndex}
        />

        {/* Enquiry Modal */}
        <QuickEnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          preselectedCake={cake}
        />

      </div>
    </div>
  );
};
