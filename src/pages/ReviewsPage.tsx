import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquareHeart, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Filter,
  MapPin,
  Heart,
  Sparkles
} from 'lucide-react';
import { GOOGLE_RATING_SUMMARY } from '../data/reviewsData';
import { getStoredReviews, subscribeToStoreEvents } from '../data/store';
import { Review } from '../types';
import { GoogleReviewModal } from '../components/common/GoogleReviewModal';

export const ReviewsPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(() => getStoredReviews());

  useEffect(() => {
    const unsubscribe = subscribeToStoreEvents((action) => {
      if (action === 'reviews_updated') {
        setReviews(getStoredReviews());
      }
    });
    return unsubscribe;
  }, []);

  const filters = [
    { id: 'all', label: 'All Reviews' },
    { id: 'Birthday', label: 'Birthday Cakes' },
    { id: 'Pure Veg', label: 'Pure Veg / Eggless' },
    { id: 'Anniversary', label: 'Anniversaries' },
    { id: 'Signature', label: 'Feather Wings & Signature' },
    { id: 'Guestbook', label: 'Bakery Guestbook' }
  ];

  const filteredReviews = selectedFilter === 'all'
    ? reviews
    : reviews.filter((r) => {
        if (selectedFilter === 'Birthday') return r.occasionTag.toLowerCase().includes('birthday');
        if (selectedFilter === 'Pure Veg') return r.occasionTag.toLowerCase().includes('veg') || r.reviewText.toLowerCase().includes('veg');
        if (selectedFilter === 'Anniversary') return r.occasionTag.toLowerCase().includes('anniversary');
        if (selectedFilter === 'Signature') return r.reviewText.toLowerCase().includes('feather') || r.occasionTag.toLowerCase().includes('signature');
        if (selectedFilter === 'Guestbook') return r.source === 'Bakery Guestbook';
        return true;
      });

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBE6EC] text-[#C9365B] text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#C9365B]" />
            <span>Community Love</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#382722] tracking-tight">
            Customer Reviews & Ratings
          </h1>
          <p className="text-sm sm:text-base text-[#664E46] mt-2">
            Read authentic feedback from families celebrating with Manmaya’s CAKE DELIGHTS across Kavisuryanagar, Boirani, and nearby areas.
          </p>
        </div>

        {/* Hero Rating Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E5D8] shadow-lg mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Big Score */}
            <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-[#F0E5D8] pb-6 md:pb-0 md:pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF7EA] text-[#55853B] text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Google Maps Listing</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <span className="font-serif text-5xl sm:text-6xl font-extrabold text-[#382722]">
                  {GOOGLE_RATING_SUMMARY.score.toFixed(1)}
                </span>
                <div className="text-left">
                  <div className="flex items-center text-[#FCD872] mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FCD872]" />
                    ))}
                  </div>
                  <div className="text-xs font-bold text-[#8A7269]">
                    {GOOGLE_RATING_SUMMARY.totalReviews} Reviews on Google
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#8A7269] flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C9365B]" />
                <span>Krupasindu Nagar Road, Kavisuryanagar</span>
              </div>
            </div>

            {/* Right Review CTA */}
            <div className="md:col-span-7 flex flex-col sm:flex-row items-center justify-between gap-4 md:pl-4">
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-xl font-bold text-[#382722]">
                  Did you enjoy your cake?
                </h3>
                <p className="text-xs sm:text-sm text-[#664E46] mt-0.5">
                  Write a review on Google or sign our digital guestbook!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquareHeart className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Leave a Review</span>
                </button>

                <a
                  href={GOOGLE_RATING_SUMMARY.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl bg-white border border-[#F0E5D8] hover:border-[#F5A5B8] text-[#382722] hover:text-[#C9365B] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === f.id
                  ? 'bg-[#C9365B] text-white shadow-xs'
                  : 'bg-white text-[#5A433B] border border-[#F0E5D8] hover:border-[#F5A5B8]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white rounded-3xl p-6 border border-[#F0E5D8] shadow-xs flex flex-col justify-between hover:border-[#F5A5B8] transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#FFF2E2] text-[#C9365B] font-serif font-bold text-sm flex items-center justify-center">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#382722]">
                        {review.name}
                      </div>
                      <div className="text-[10px] text-[#8A7269]">
                        {review.timeAgo}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#8A7269] border border-[#F0E5D8]">
                    {review.source}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center text-[#FCD872] mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FCD872]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#5A433B] leading-relaxed mb-4">
                  "{review.reviewText}"
                </p>
              </div>

              {/* Tag & Verified */}
              <div className="pt-3 border-t border-[#FAF5EF] flex items-center justify-between text-[11px]">
                <span className="text-[#C9365B] font-semibold bg-[#FBE6EC] px-2 py-0.5 rounded-md">
                  {review.occasionTag}
                </span>

                {review.verified && (
                  <span className="text-[#55853B] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Customer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      <GoogleReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};
