import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';

export const BakeryStoryTeaser: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#FFFDF9] border-b border-[#F0E5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Visual Imagery */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-white p-3 border border-[#F0E5D8] shadow-xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF5EF]">
                <img
                  src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=900&q=80"
                  alt="Manmaya's Cake Delights baking philosophy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFE7A3]">
                    Locally Grounded
                  </span>
                  <div className="font-serif text-lg font-bold">
                    Krupasindu Nagar Road, Kavisuryanagar
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2E2] text-[#C9365B] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-[#C9365B]" />
              <span>Our Baking Commitment</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#382722] tracking-tight">
              Baked fresh for the moments that matter most
            </h2>

            <p className="text-sm sm:text-base text-[#5A433B] leading-relaxed">
              At <strong>Manmaya’s CAKE DELIGHTS</strong>, we believe every birthday, milestone, and wedding anniversary deserves a cake that looks breathtaking on the celebration table and tastes just as delicious on the plate.
            </p>

            <p className="text-sm sm:text-base text-[#5A433B] leading-relaxed">
              Serving the warm community of Kavisuryanagar and Boirani in Odisha, we bake to order using carefully selected flours, real fruit compotes, and silky buttercreams. We honor our community’s dietary preferences with dedicated 100% eggless (pure-vegetarian) preparations.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#382722]">
                <div className="w-6 h-6 rounded-lg bg-[#EFF7EA] text-[#55853B] flex items-center justify-center shrink-0">
                  <Leaf className="w-3.5 h-3.5" />
                </div>
                <span>100% Eggless Pure Veg Options</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#382722]">
                <div className="w-6 h-6 rounded-lg bg-[#FFF2E2] text-[#C9365B] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Feather Wings Signature Sculpting</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#382722]">
                <div className="w-6 h-6 rounded-lg bg-[#FFF2E2] text-[#E09F1F] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>No Artificial Fillers or Preservatives</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#382722]">
                <div className="w-6 h-6 rounded-lg bg-[#FBE6EC] text-[#C9365B] flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <span>Punctual Pickup & Friendly Service</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-[#F0E5D8] hover:border-[#F5A5B8] text-sm font-bold text-[#382722] hover:text-[#C9365B] transition-all shadow-xs"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4 text-[#C9365B]" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
