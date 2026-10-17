import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cake as CakeType } from '../../types';
import { Star, Sparkles, Leaf, Eye, ArrowRight } from 'lucide-react';
import { playPopSound } from '../../utils/soundEffects';

interface CakeCardProps {
  cake: CakeType;
  onQuickView?: (cake: CakeType) => void;
  onEnquire?: (cake: CakeType) => void;
}

export const CakeCard: React.FC<CakeCardProps> = ({ cake, onQuickView, onEnquire }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<{ opacity: number; x: number; y: number }>({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`);
    setGlareStyle({
      opacity: 0.15,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setGlareStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform: transformStyle,
        transition: transformStyle ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
      }}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#F0E5D8] overflow-hidden bakery-card-shadow flex flex-col h-full will-change-transform"
    >
      {/* 3D dynamic gloss glare */}
      <div 
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          opacity: glareStyle.opacity,
          background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 65%)`
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF5EF]">
        <img
          src={cake.imageUrl}
          alt={cake.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-xs text-[#C9365B] shadow-xs">
            {cake.category}
          </span>

          <div className="flex items-center gap-1.5">
            {cake.isEgglessAvailable && (
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF7EA] text-[#55853B] border border-[#B8D4A5] shadow-xs flex items-center gap-1"
                title="100% Eggless / Vegetarian Option Available"
              >
                <Leaf className="w-3 h-3 text-[#55853B]" />
                <span>Eggless Avail.</span>
              </span>
            )}
            
            {cake.featured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE7A3] text-[#382722] border border-[#FCD872] shadow-xs flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-[#E09F1F]" />
                <span>Signature</span>
              </span>
            )}
          </div>
        </div>

        {/* Quick View Floating Button */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => {
              playPopSound();
              onQuickView(cake);
            }}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-[#382722] hover:bg-[#C9365B] hover:text-white transition-all shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transform sm:translate-y-2 sm:group-hover:translate-y-0 z-20"
            title="Quick View Cake Design"
            aria-label={`Quick view ${cake.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between z-10 bg-white">
        <div>
          {/* Rating & Occasion */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-[#8A7269]">
              <div className="flex items-center text-[#FCD872]">
                <Star className="w-3.5 h-3.5 fill-[#FCD872]" />
              </div>
              <span className="text-[#382722] font-bold">{cake.rating.toFixed(1)}</span>
              <span>({cake.reviewCount})</span>
            </div>
            
            <span className="text-[11px] font-medium text-[#8A7269] bg-[#FFF9F2] px-2 py-0.5 rounded-md border border-[#F0E5D8]">
              {cake.leadTime.split(' ')[0]} {cake.leadTime.split(' ')[1]} lead
            </span>
          </div>

          {/* Cake Title */}
          <Link to={`/cakes/${cake.slug}`} className="block group-hover:text-[#C9365B] transition-colors">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#382722] leading-snug line-clamp-1 mb-1.5">
              {cake.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#664E46] line-clamp-2 leading-relaxed mb-3">
            {cake.description}
          </p>

          {/* Flavor Chips */}
          <div className="flex flex-wrap gap-1 mb-4">
            {cake.flavors.slice(0, 2).map((flavor, idx) => (
              <span 
                key={idx} 
                className="text-[11px] px-2 py-0.5 rounded-md bg-[#FFF2E2] text-[#5A433B] border border-[#F0E5D8]/80 font-medium"
              >
                {flavor}
              </span>
            ))}
            {cake.flavors.length > 2 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FAF5EF] text-[#8A7269] font-medium">
                +{cake.flavors.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[#F0E5D8] flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A7269]">
              Pricing
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#C9365B]">
              {cake.priceDisplay.includes('(') 
                ? cake.priceDisplay.split('(')[0].trim() 
                : cake.priceDisplay}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/cakes/${cake.slug}`}
              className="p-2 rounded-xl text-xs font-semibold text-[#5A433B] hover:bg-[#FFF2E2] border border-[#F0E5D8] transition-colors"
              title="View full cake details"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {onEnquire ? (
              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  onEnquire(cake);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#C9365B] hover:bg-[#A92244] shadow-xs hover:shadow-md transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#FFE7A3]" />
                <span>Enquire</span>
              </button>
            ) : (
              <Link
                to={`/contact?cake=${encodeURIComponent(cake.name)}&id=${cake.id}`}
                className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#C9365B] hover:bg-[#A92244] shadow-xs hover:shadow-md transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#FFE7A3]" />
                <span>Enquire</span>
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
