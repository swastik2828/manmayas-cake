import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, Heart, PartyPopper, Palette, Leaf } from 'lucide-react';

export const OccasionShortcuts: React.FC = () => {
  const occasions = [
    {
      title: 'Birthday Cakes',
      subtitle: 'From milestone 1st to 50th',
      category: 'birthday',
      icon: Gift,
      accent: 'from-[#FFE7A3] to-[#FCD872]',
      tag: 'Bestseller'
    },
    {
      title: 'Feather Wings',
      subtitle: 'Ethereal signature designs',
      category: 'feather-wings',
      icon: Sparkles,
      accent: 'from-[#F5A5B8] to-[#C9365B]',
      tag: 'Signature'
    },
    {
      title: 'Weddings & Tiers',
      subtitle: 'Multi-tier architectural art',
      category: 'wedding',
      icon: Heart,
      accent: 'from-[#FFF2E2] to-[#FFE7A3]',
      tag: 'Custom Luxury'
    },
    {
      title: 'Celebrations',
      subtitle: 'Anniversaries & family milestones',
      category: 'celebration',
      icon: PartyPopper,
      accent: 'from-[#FBE6EC] to-[#F5A5B8]',
      tag: 'Fresh Fruit'
    },
    {
      title: 'Custom 3D & Kids',
      subtitle: 'Cartoon, theme & sculpt cakes',
      category: 'custom-art',
      icon: Palette,
      accent: 'from-[#EFF7EA] to-[#B8D4A5]',
      tag: 'Fun Themes'
    },
    {
      title: '100% Pure Veg',
      subtitle: 'Eggless guaranteed with care',
      category: 'pure-veg',
      icon: Leaf,
      accent: 'from-[#EFF7EA] to-[#B8D4A5]',
      tag: 'Pure Veg'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FFF9F2] border-b border-[#F0E5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#C9365B] mb-1">
              Find Your Celebration
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#382722]">
              Explore by Occasion
            </h2>
          </div>

          <Link
            to="/cakes"
            className="text-xs sm:text-sm font-bold text-[#C9365B] hover:text-[#A92244] inline-flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* Shortcuts Horizontal Scroll / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {occasions.map((occ) => {
            const Icon = occ.icon;
            return (
              <Link
                key={occ.category}
                to={`/cakes?category=${occ.category}`}
                className="group p-4 rounded-2xl sm:rounded-3xl bg-white border border-[#F0E5D8] hover:border-[#F5A5B8] bakery-card-shadow bakery-card-hover flex flex-col justify-between transition-all"
              >
                <div>
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${occ.accent} flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-[#382722]" />
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#382722] group-hover:text-[#C9365B] transition-colors leading-tight">
                    {occ.title}
                  </h3>
                  <p className="text-[11px] text-[#8A7269] mt-1 leading-snug">
                    {occ.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-[#FAF5EF] flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9365B] bg-[#FFF2E2] px-1.5 py-0.5 rounded">
                    {occ.tag}
                  </span>
                  <span className="text-xs text-[#8A7269] group-hover:text-[#C9365B] transition-colors">
                    &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
