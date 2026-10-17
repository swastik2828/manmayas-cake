import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquareHeart, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { REVIEWS_DATA, GOOGLE_RATING_SUMMARY } from '../../data/reviewsData';

interface VerifiedReviewsProps {
  onOpenGoogleReviewModal: () => void;
}

export const VerifiedReviews: React.FC<VerifiedReviewsProps> = ({ onOpenGoogleReviewModal }) => {
  return (
    <section className="py-14 sm:py-20 bg-[#FFF9F2] border-b border-[#F0E5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rating Hero Block */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E5D8] shadow-lg mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Score Card */}
            <div className="lg:col-span-5 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#F0E5D8] pb-6 lg:pb-0 lg:pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF7EA] text-[#55853B] text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Google Maps Listing</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                <span className="font-serif text-5xl sm:text-6xl font-extrabold text-[#382722]">
                  5.0
                </span>
                <div className="text-left">
                  <div className="flex items-center text-[#FCD872] mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FCD872]" />
                    ))}
                  </div>
                  <div className="text-xs font-bold text-[#8A7269]">
                    Based on 66 Verified Reviews
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#664E46] leading-relaxed">
                Ranked with 100% 5-star feedback by local families in Kavisuryanagar and Boirani for fresh custom cakes and reliable celebration service.
              </p>
            </div>

            {/* Right Action CTAs */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-center justify-between gap-4 lg:pl-4">
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#382722]">
                  Have you tasted our cakes recently?
                </h3>
                <p className="text-xs sm:text-sm text-[#8A7269]">
                  Share your experience on Google to help neighbors find great cakes!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={onOpenGoogleReviewModal}
                  className="px-5 py-3 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#C9365B]/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquareHeart className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Write a Google Review</span>
                </button>

                <a
                  href={GOOGLE_RATING_SUMMARY.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl bg-white border border-[#F0E5D8] hover:border-[#F5A5B8] text-[#382722] hover:text-[#C9365B] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS_DATA.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 border border-[#F0E5D8] bakery-card-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-[#FCD872]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FCD872]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-[#8A7269]">
                    {review.timeAgo}
                  </span>
                </div>

                <p className="text-sm text-[#382722] italic font-medium leading-relaxed mb-4">
                  "{review.reviewText}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#FAF5EF] flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#382722]">
                    {review.name}
                  </h4>
                  <span className="text-[11px] text-[#8A7269]">
                    {review.occasionTag}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF7EA] text-[#55853B] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View all reviews CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/reviews"
            className="text-xs sm:text-sm font-bold text-[#C9365B] hover:text-[#A92244] underline decoration-2 underline-offset-4"
          >
            Read all customer testimonials & Google review highlights &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
};
