import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface LightboxImageItem {
  id: string;
  url: string;
  title: string;
  category?: string;
  description?: string;
  cakeSlug?: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxImageItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}) => {
  const navigate = useNavigate();

  // Keyboard navigation & escape to close (PRD Section 9 & 16)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % items.length);
      }
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const handleEnquire = () => {
    onClose();
    navigate(`/contact?cake=${encodeURIComponent(currentItem.title)}`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#2C1D17]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-xs transition-all focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate((currentIndex + 1) % items.length)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-xs transition-all focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Container */}
      <div className="max-w-4xl w-full max-h-[92vh] flex flex-col bg-[#FFF9F2] rounded-3xl overflow-hidden shadow-2xl border border-[#F0E5D8]">
        
        {/* Photo Viewport */}
        <div className="relative flex-1 min-h-[280px] max-h-[62vh] bg-[#1F1511] flex items-center justify-center overflow-hidden">
          <img
            src={currentItem.url}
            alt={currentItem.title}
            className="max-h-full max-w-full object-contain select-none"
          />

          {/* Counter pill */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        {/* Caption & Actions */}
        <div className="p-4 sm:p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {currentItem.category && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9365B] bg-[#FBE6EC] px-2 py-0.5 rounded-full">
                  {currentItem.category}
                </span>
              )}
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#382722]">
              {currentItem.title}
            </h3>
            {currentItem.description && (
              <p className="text-xs sm:text-sm text-[#664E46] mt-1 max-w-xl line-clamp-2">
                {currentItem.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleEnquire}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white text-sm font-bold shadow-md shadow-[#C9365B]/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
              <span>Enquire About This Design</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
