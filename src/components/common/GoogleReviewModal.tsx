import React, { useState } from 'react';
import { X, Star, ExternalLink, Copy, Check, MessageSquareHeart, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_SITE_SETTINGS } from '../../data/siteSettings';
import { addCustomerReview } from '../../data/store';
import { playChimeSound, playPopSound } from '../../utils/soundEffects';

interface GoogleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleReviewModal: React.FC<GoogleReviewModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'google' | 'guestbook'>('google');

  // Guestbook inputs
  const [authorName, setAuthorName] = useState('');
  const [authorRating, setAuthorRating] = useState(5);
  const [authorOccasion, setAuthorOccasion] = useState('Birthday');
  const [authorText, setAuthorText] = useState('');
  const [guestbookSubmitted, setGuestbookSubmitted] = useState(false);

  if (!isOpen) return null;

  const reviewTemplates = [
    "Ordered a custom birthday cake from Manmaya's Cake Delights in Kavisuryanagar. The cake was fresh, beautifully decorated, and tasted amazing! 5-star experience.",
    "Best bakery in Boirani! Ordered their eggless chocolate truffle cake. Highly recommend them for family celebrations and timely preparation.",
    "Beautiful custom feather wings cake! Polite communication, authentic taste, and fresh sponge. Loved the service!"
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    playPopSound();
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorText.trim()) return;

    await addCustomerReview({
      name: authorName.trim(),
      rating: authorRating,
      occasionTag: authorOccasion,
      reviewText: authorText.trim(),
      highlight: 'Freshly Baked & Handcrafted in Kavisuryanagar',
    });

    setGuestbookSubmitted(true);
    playChimeSound();

    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F5A5B8', '#C9365B', '#FFE7A3', '#B8D4A5']
      });
    } catch {
      // ignore
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#2C1D17]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FFF9F2] rounded-3xl border border-[#F0E5D8] shadow-2xl p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#382722] hover:text-[#C9365B] shadow-xs transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FBE6EC] border border-[#F5A5B8] flex items-center justify-center text-[#C9365B] mb-3 shadow-xs">
            <MessageSquareHeart className="w-7 h-7" />
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#382722]">
            Share Your Cake Experience
          </h3>
          <p className="text-xs sm:text-sm text-[#664E46] mt-1 max-w-sm mx-auto">
            Your real feedback means the world to our patisserie in Kavisuryanagar!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#F0E5D8] mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'google'
                ? 'bg-[#C9365B] text-white shadow-xs'
                : 'text-[#5A433B] hover:text-[#382722]'
            }`}
          >
            Google Maps Review
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guestbook')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guestbook'
                ? 'bg-[#C9365B] text-white shadow-xs'
                : 'text-[#5A433B] hover:text-[#382722]'
            }`}
          >
            Sign Bakery Guestbook
          </button>
        </div>

        {activeTab === 'google' ? (
          <div>
            {/* Current rating summary */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#F0E5D8] flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#FCD872]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FCD872]" />
                  ))}
                </div>
                <span className="text-sm font-extrabold text-[#382722]">5.0 / 5</span>
              </div>
              <span className="text-xs font-semibold text-[#8A7269]">
                66 Verified Google Reviews
              </span>
            </div>

            {/* Helpful Starters */}
            <div className="mb-5">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#8A7269] mb-2">
                Need inspiration? Click to copy an idea:
              </span>
              <div className="space-y-2">
                {reviewTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopy(template, idx)}
                    className="w-full text-left p-2.5 rounded-xl bg-white border border-[#F0E5D8] hover:border-[#F5A5B8] text-xs text-[#5A433B] hover:text-[#382722] transition-colors flex items-center justify-between gap-2 group"
                  >
                    <span className="line-clamp-2">"{template}"</span>
                    <span className="shrink-0 text-[#C9365B] font-bold text-[11px] flex items-center gap-1">
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#55853B]" />
                          <span className="text-[#55853B]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#8A7269] group-hover:text-[#C9365B]" />
                          <span>Copy</span>
                        </>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Link to Google Maps */}
            <div className="space-y-2.5">
              <a
                href={INITIAL_SITE_SETTINGS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-sm shadow-md shadow-[#C9365B]/20 transition-all hover:scale-[1.01]"
              >
                <span>Open Google Maps & Write Review</span>
                <ExternalLink className="w-4 h-4 text-[#FFE7A3]" />
              </a>

              <div className="text-center">
                <span className="text-[11px] text-[#8A7269]">
                  Takes you directly to our verified Google Business listing in Kavisuryanagar.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {guestbookSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EFF7EA] border border-[#B8D4A5] flex items-center justify-center text-[#55853B]">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#382722]">
                  Thank You, {authorName}!
                </h4>
                <p className="text-xs text-[#664E46] max-w-xs mx-auto">
                  Your feedback has been added to our community guestbook. Feel free to copy it to Google Maps as well!
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-5 rounded-xl bg-[#C9365B] text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGuestbookSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Priyanka Mohapatra"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#F0E5D8] text-xs text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">Star Rating</label>
                    <div className="flex items-center gap-1 text-[#FCD872] pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => setAuthorRating(star)}
                          className={`w-5 h-5 cursor-pointer ${
                            star <= authorRating ? 'fill-[#FCD872]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">Occasion</label>
                    <select
                      value={authorOccasion}
                      onChange={(e) => setAuthorOccasion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#F0E5D8] text-xs text-[#382722]"
                    >
                      <option value="Birthday">Birthday</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Pure Veg Special">Pure Veg / Eggless</option>
                      <option value="Feather Wings Signature">Signature Cake</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">Your Review / Message *</label>
                  <textarea
                    rows={3}
                    value={authorText}
                    onChange={(e) => setAuthorText(e.target.value)}
                    placeholder="How was the taste, decoration, freshness, and delivery?"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#F0E5D8] text-xs text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Submit Guestbook Review</span>
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
