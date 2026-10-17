import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Sparkles } from 'lucide-react';
import { INITIAL_SITE_SETTINGS } from '../../data/siteSettings';

interface MobileStickyBarProps {
  onOpenQuickEnquiry?: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOpenQuickEnquiry }) => {
  const whatsappUrl = `https://wa.me/${INITIAL_SITE_SETTINGS.whatsapp}?text=${encodeURIComponent(
    "Hello Manmaya's Cake Delights, I would like to enquire about ordering a custom cake for my upcoming celebration."
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#FFF9F2]/95 backdrop-blur-lg border-t border-[#F0E5D8] px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto items-center">
        {/* Call Button */}
        <a
          href={`tel:${INITIAL_SITE_SETTINGS.phone}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white border border-[#F0E5D8] text-[#382722] active:bg-[#FFF2E2] shadow-xs text-center"
        >
          <Phone className="w-4 h-4 text-[#C9365B] mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight leading-none">Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C7E] active:bg-[#25D366]/20 shadow-xs text-center"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366] mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight leading-none">WhatsApp</span>
        </a>

        {/* Order / Enquiry Button */}
        {onOpenQuickEnquiry ? (
          <button
            type="button"
            onClick={onOpenQuickEnquiry}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#C9365B] text-white active:bg-[#A92244] shadow-md shadow-[#C9365B]/20 text-center"
          >
            <Sparkles className="w-4 h-4 text-[#FFE7A3] mb-0.5" />
            <span className="text-[11px] font-bold tracking-tight leading-none">Order Cake</span>
          </button>
        ) : (
          <Link
            to="/contact"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#C9365B] text-white active:bg-[#A92244] shadow-md shadow-[#C9365B]/20 text-center"
          >
            <Sparkles className="w-4 h-4 text-[#FFE7A3] mb-0.5" />
            <span className="text-[11px] font-bold tracking-tight leading-none">Order Cake</span>
          </Link>
        )}
      </div>
    </div>
  );
};
