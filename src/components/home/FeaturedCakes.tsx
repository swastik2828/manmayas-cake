import React from 'react';
import { Link } from 'react-router-dom';
import { Cake as CakeType } from '../../types';
import { CakeCard } from '../common/CakeCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedCakesProps {
  cakes: CakeType[];
  onQuickView: (cake: CakeType) => void;
  onEnquire: (cake: CakeType) => void;
}

export const FeaturedCakes: React.FC<FeaturedCakesProps> = ({
  cakes,
  onQuickView,
  onEnquire,
}) => {
  const featuredList = cakes.filter((c) => c.featured).slice(0, 4);

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9F2] border-b border-[#F0E5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9365B] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artisan Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#382722] tracking-tight">
              Featured Cake Designs
            </h2>
            <p className="text-sm sm:text-base text-[#664E46] mt-1 max-w-xl">
              Hand-sculpted, fresh sponge baked every morning with local care and premium ingredients.
            </p>
          </div>

          <Link
            to="/cakes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-[#F0E5D8] hover:border-[#F5A5B8] text-sm font-bold text-[#382722] hover:text-[#C9365B] transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <span>Browse All {cakes.length} Cakes</span>
            <ArrowRight className="w-4 h-4 text-[#C9365B]" />
          </Link>
        </div>

        {/* Featured Cakes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredList.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              onQuickView={onQuickView}
              onEnquire={onEnquire}
            />
          ))}
        </div>

        {/* Custom Order Callout Banner */}
        <div className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFF2E2] via-[#FBE6EC] to-[#FFF2E2] border border-[#F0E5D8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#382722]">
              Have a custom Pinterest photo or unique theme?
            </h3>
            <p className="text-xs sm:text-sm text-[#664E46] mt-1 max-w-2xl">
              Send us your reference photo! We specialize in custom character toppers, floral buttercream palettes, and tailored weights for any celebration.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onEnquire(featuredList[0])}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-sm shadow-md shadow-[#C9365B]/20 transition-all hover:scale-105"
          >
            Request Custom Theme &rarr;
          </button>
        </div>

      </div>
    </section>
  );
};
