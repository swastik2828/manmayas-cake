import React, { useState } from 'react';
import { Users, Sparkles, Scale, Cake as CakeIcon, Check } from 'lucide-react';
import { playPopSound } from '../../utils/soundEffects';

interface ServingGuideItem {
  weightKg: number;
  weightLabel: string;
  servings: string;
  diameterInches: number;
  tiers: number;
  occasion: string;
  recommendedPrice: string;
}

const SERVING_TIERS: ServingGuideItem[] = [
  { weightKg: 0.5, weightLabel: '0.5 kg (Bento / Petite)', servings: '3–4 guests', diameterInches: 5, tiers: 1, occasion: 'Intimate Cake Cut, Kids Birthday', recommendedPrice: '₹450 – ₹600' },
  { weightKg: 1.0, weightLabel: '1.0 kg (Classic Standard)', servings: '6–8 guests', diameterInches: 7, tiers: 1, occasion: 'Family Birthday, Home Gathering', recommendedPrice: '₹750 – ₹950' },
  { weightKg: 1.5, weightLabel: '1.5 kg (Medium Celebration)', servings: '10–12 guests', diameterInches: 8.5, tiers: 1, occasion: 'Small Party, Milestone Celebrations', recommendedPrice: '₹1,150 – ₹1,400' },
  { weightKg: 2.0, weightLabel: '2.0 kg (Grand / 2-Tier)', servings: '15–18 guests', diameterInches: 10, tiers: 2, occasion: 'Silver Jubilee, Big Birthday Bash', recommendedPrice: '₹1,550 – ₹1,900' },
  { weightKg: 3.0, weightLabel: '3.0 kg (Royal 2-Tier)', servings: '24–28 guests', diameterInches: 11, tiers: 2, occasion: 'Engagement, Wedding Reception', recommendedPrice: '₹2,350 – ₹2,900' },
  { weightKg: 4.0, weightLabel: '4.0+ kg (3-Tier Regal)', servings: '35–45+ guests', diameterInches: 12, tiers: 3, occasion: 'Grand Wedding Tier, Gala Event', recommendedPrice: '₹3,200 – ₹4,200' },
];

export const ServingCalculator: React.FC = () => {
  const [sliderIndex, setSliderIndex] = useState<number>(1); // default 1.0kg

  const current = SERVING_TIERS[sliderIndex];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#F0E5D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF7EA] text-[#55853B] text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Portion & Weight Planner</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#382722] tracking-tight">
            How much cake do you need?
          </h2>
          <p className="text-sm sm:text-base text-[#664E46] mt-2">
            Slide according to your guest count to calculate exact cake weight, tier sizing, and diameter.
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="bg-[#FFF9F2] rounded-3xl border border-[#F0E5D8] p-6 sm:p-10 shadow-lg">
          
          {/* Slider Control */}
          <div className="max-w-xl mx-auto space-y-4 mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-[#8A7269]">
              <span>Petite (0.5kg)</span>
              <span className="text-[#C9365B] font-extrabold text-sm sm:text-base">
                Selected: {current.weightLabel}
              </span>
              <span>Regal (4.0kg+)</span>
            </div>

            <input
              type="range"
              min={0}
              max={SERVING_TIERS.length - 1}
              value={sliderIndex}
              onChange={(e) => {
                playPopSound();
                setSliderIndex(Number(e.target.value));
              }}
              className="w-full h-3 bg-[#FFE7A3] rounded-lg appearance-none cursor-pointer accent-[#C9365B]"
            />

            <div className="flex justify-between text-[11px] text-[#8A7269] px-1 font-mono">
              {SERVING_TIERS.map((tier, idx) => (
                <span
                  key={tier.weightKg}
                  onClick={() => {
                    playPopSound();
                    setSliderIndex(idx);
                  }}
                  className={`cursor-pointer transition-colors ${
                    sliderIndex === idx ? 'text-[#C9365B] font-bold' : 'hover:text-[#382722]'
                  }`}
                >
                  {tier.weightKg}k
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Visual Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Visual Cake Scale Graphic */}
            <div className="bg-white p-6 rounded-2xl border border-[#F0E5D8] flex flex-col items-center justify-center text-center shadow-xs h-64 relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A7269] mb-4">
                Visual Scale Proportion
              </span>

              {/* Dynamic Stacked Cake Rings */}
              <div className="relative flex flex-col items-center justify-end h-32 w-full mb-4">
                {current.tiers >= 3 && (
                  <div className="w-16 h-8 rounded-t-lg bg-[#FFE7A3] border border-[#F0E5D8] shadow-xs flex items-center justify-center text-[10px] font-bold text-[#382722] animate-in fade-in zoom-in-75 duration-200">
                    Tier 3
                  </div>
                )}
                {current.tiers >= 2 && (
                  <div className="w-24 h-10 rounded-t-lg bg-[#FBE6EC] border border-[#F0E5D8] shadow-xs flex items-center justify-center text-xs font-bold text-[#C9365B] animate-in fade-in zoom-in-75 duration-200">
                    Tier 2
                  </div>
                )}
                <div 
                  className="h-12 rounded-2xl bg-[#FFF2E2] border border-[#F0E5D8] shadow-md flex items-center justify-center text-xs font-bold text-[#382722] transition-all duration-300"
                  style={{ width: `${Math.min(100, current.diameterInches * 9)}%` }}
                >
                  {current.diameterInches}″ Base Platter
                </div>
              </div>

              <div className="text-xs font-bold text-[#382722]">
                {current.tiers} {current.tiers === 1 ? 'Single Tier' : `${current.tiers}-Tier Layered Design`}
              </div>
            </div>

            {/* Middle Stats Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#F0E5D8] space-y-4 shadow-xs h-64 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A7269]">
                  Recommended Servings
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-6 h-6 text-[#C9365B]" />
                  <span className="font-serif text-3xl font-extrabold text-[#382722]">
                    {current.servings}
                  </span>
                </div>
                <p className="text-xs text-[#664E46] mt-1">
                  Based on generous party dessert slice portions (approx 120–150g per guest).
                </p>
              </div>

              <div className="pt-3 border-t border-[#FAF5EF]">
                <div className="text-[11px] font-bold text-[#8A7269]">Ideal For:</div>
                <div className="text-xs font-semibold text-[#382722] mt-0.5">
                  {current.occasion}
                </div>
              </div>
            </div>

            {/* Right Card: Indicative Price & Direct Enquiry */}
            <div className="bg-gradient-to-br from-[#FFF2E2] via-[#FBE6EC] to-[#FFF2E2] p-6 rounded-2xl border border-[#F5A5B8] space-y-4 shadow-xs h-64 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C9365B] mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Fresh Patisserie Pricing</span>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#382722]">
                  {current.recommendedPrice}
                </div>
                <div className="text-[11px] text-[#664E46] mt-1">
                  Includes personalized edible name piping & 100% pure veg / eggless guarantee.
                </div>
              </div>

              <a
                href={`/contact?weight=${encodeURIComponent(current.weightLabel)}`}
                className="w-full py-3 px-4 rounded-xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs shadow-md transition-all text-center block"
              >
                Enquire for {current.servings}
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
