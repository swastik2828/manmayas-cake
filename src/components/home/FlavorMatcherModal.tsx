import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, Heart } from 'lucide-react';
import { Cake } from '../../types';
import { getStoredCakes } from '../../data/store';
import { playPopSound, playChimeSound } from '../../utils/soundEffects';

interface FlavorMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCake: (cake: Cake) => void;
}

export const FlavorMatcherModal: React.FC<FlavorMatcherModalProps> = ({
  isOpen,
  onClose,
  onSelectCake,
}) => {
  const [step, setStep] = useState<number>(1);
  const [occasion, setOccasion] = useState<string>('Birthday');
  const [flavorMood, setFlavorMood] = useState<string>('chocolate');
  const [dietary, setDietary] = useState<string>('eggless');

  if (!isOpen) return null;

  const cakes = getStoredCakes();

  const handleNext = () => {
    playPopSound();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4); // Result
      playChimeSound();
    }
  };

  const handleReset = () => {
    playPopSound();
    setStep(1);
  };

  // Find best match cake based on choices
  const getMatchedCake = (): Cake => {
    let matched = cakes.find(c => {
      if (flavorMood === 'chocolate' && c.flavors.some(f => f.toLowerCase().includes('chocolate') || f.toLowerCase().includes('truffle'))) return true;
      if (flavorMood === 'berry' && c.flavors.some(f => f.toLowerCase().includes('berry') || f.toLowerCase().includes('strawberry'))) return true;
      if (flavorMood === 'pistachio' && c.flavors.some(f => f.toLowerCase().includes('pistachio'))) return true;
      if (flavorMood === 'mango' && c.flavors.some(f => f.toLowerCase().includes('mango'))) return true;
      return false;
    });

    if (!matched) {
      matched = cakes[0]; // fallback
    }
    return matched;
  };

  const matchedCake = getMatchedCake();

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#2C1D17]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FFF9F2] rounded-3xl border border-[#F0E5D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFF2E2] via-[#FBE6EC] to-[#FFF2E2] p-5 sm:p-6 border-b border-[#F0E5D8] relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#382722] hover:text-[#C9365B] shadow-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9365B] mb-1">
            <Sparkles className="w-4 h-4 text-[#C9365B]" />
            <span>Interactive Cake Matcher</span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#382722]">
            Find Your Ideal Celebration Cake
          </h2>
          <p className="text-xs text-[#664E46] mt-0.5">
            Answer 3 quick sweet questions and we'll match the perfect artisanal design for your party.
          </p>

          {/* Stepper bar */}
          <div className="flex items-center gap-1.5 mt-3">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  step >= s ? 'bg-[#C9365B]' : 'bg-[#F0E5D8]'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#382722]">
                1. What are you celebrating?
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'Birthday', label: '🎂 Birthday Party' },
                  { id: 'Anniversary', label: '💍 Anniversary / Wedding' },
                  { id: 'Kids Theme', label: '🎈 Kids 3D Theme' },
                  { id: 'Family Gathering', label: '✨ Sweet Family Gathering' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setOccasion(opt.id);
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      occasion === opt.id
                        ? 'bg-[#C9365B] text-white border-[#C9365B] shadow-sm'
                        : 'bg-white text-[#382722] border-[#F0E5D8] hover:border-[#F5A5B8]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full mt-4 py-3 rounded-xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Continue to Flavor Mood</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#382722]">
                2. What flavor mood are you craving?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'chocolate', label: '🍫 Rich Belgian Dark Truffle', desc: 'Deep cocoa ganache' },
                  { id: 'berry', label: '🍓 Fresh Strawberry Velvet', desc: 'Light, fruity & romantic' },
                  { id: 'pistachio', label: '🌿 Roasted Pistachio & Cream', desc: 'Nutty royal decadence' },
                  { id: 'mango', label: '🥭 Kesar Mango Glow', desc: 'Exotic golden sweetness' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setFlavorMood(opt.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      flavorMood === opt.id
                        ? 'bg-[#C9365B] text-white border-[#C9365B] shadow-sm'
                        : 'bg-white text-[#382722] border-[#F0E5D8] hover:border-[#F5A5B8]'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className={`text-[10px] mt-0.5 ${flavorMood === opt.id ? 'text-white/80' : 'text-[#8A7269]'}`}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-white border border-[#F0E5D8] text-xs font-bold text-[#5A433B]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <span>Continue to Dietary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#382722]">
                3. Any special dietary preference?
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'eggless', label: '🌿 100% Eggless Guaranteed', desc: 'Prepared with certified egg-free patisserie methods' },
                  { id: 'pure_veg', label: '🌱 100% Pure Vegetarian Special', desc: 'Dedicated vegetarian kitchen cookware & zero animal products' },
                  { id: 'regular', label: '🍰 Classic Traditional Sponge', desc: 'Traditional artisan baker sponge' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setDietary(opt.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      dietary === opt.id
                        ? 'bg-[#C9365B] text-white border-[#C9365B] shadow-sm'
                        : 'bg-white text-[#382722] border-[#F0E5D8] hover:border-[#F5A5B8]'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className={`text-[11px] mt-0.5 ${dietary === opt.id ? 'text-white/80' : 'text-[#8A7269]'}`}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl bg-white border border-[#F0E5D8] text-xs font-bold text-[#5A433B]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Reveal My Cake Match</span>
                </button>
              </div>
            </div>
          )}

          {step === 4 && matchedCake && (
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF7EA] text-[#55853B] text-xs font-bold">
                <Heart className="w-3.5 h-3.5 fill-[#55853B]" />
                <span>Perfect Match Found!</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F0E5D8] shadow-xs text-left flex gap-4 items-center">
                <img
                  src={matchedCake.imageUrl}
                  alt={matchedCake.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#F0E5D8]"
                />
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#C9365B]">
                    {matchedCake.category}
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#382722]">
                    {matchedCake.name}
                  </h4>
                  <div className="text-xs font-extrabold text-[#C9365B] mt-0.5">
                    {matchedCake.priceDisplay}
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#664E46]">
                Matched for your <strong>{occasion}</strong> celebration with <strong>{flavorMood}</strong> notes and <strong>{dietary === 'eggless' ? '100% Eggless' : dietary === 'pure_veg' ? '100% Pure Veg' : 'Regular'}</strong> promise.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-3 rounded-xl bg-white border border-[#F0E5D8] text-xs font-bold text-[#5A433B] flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Again</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectCake(matchedCake);
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Enquire This Matched Cake</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
