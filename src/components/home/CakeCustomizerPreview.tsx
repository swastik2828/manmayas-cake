import React, { useState } from 'react';
import { Sparkles, MessageCircle, Leaf, Check, RefreshCw } from 'lucide-react';
import { INITIAL_SITE_SETTINGS } from '../../data/siteSettings';

interface CakeCustomizerPreviewProps {
  onCustomEnquiry: (details: {
    flavor: string;
    weight: string;
    dietary: 'eggless' | 'regular' | 'pure_veg';
    frosting: string;
    message: string;
    estimatedPrice: number;
  }) => void;
}

export const CakeCustomizerPreview: React.FC<CakeCustomizerPreviewProps> = ({ onCustomEnquiry }) => {
  const [flavor, setFlavor] = useState('Madagascar Vanilla & Strawberry');
  const [weight, setWeight] = useState('1.0 kg');
  const [dietary, setDietary] = useState<'eggless' | 'regular' | 'pure_veg'>('eggless');
  const [frosting, setFrosting] = useState('Strawberry Blush & Vanilla Swirl');
  const [message, setMessage] = useState('Happy Birthday!');

  // Pricing calculations
  const basePrices: Record<string, number> = {
    '0.5 kg': 450,
    '1.0 kg': 750,
    '2.0 kg': 1350,
    '2-Tier (3.0 kg)': 2100,
  };

  const flavorAddons: Record<string, number> = {
    'Madagascar Vanilla & Strawberry': 0,
    'Belgian Dark Chocolate Truffle': 50,
    'Royal Red Velvet Cream Cheese': 80,
    'Roasted Pistachio & White Cream': 100,
    'Kesar Mango Velvet (Pure Veg)': 70,
  };

  const estimatedPrice = (basePrices[weight] || 750) + (flavorAddons[flavor] || 0);

  // Dynamic frosting color for the preview
  const frostingColors: Record<string, { top: string; drip: string; text: string }> = {
    'Strawberry Blush & Vanilla Swirl': { top: '#FCEBEF', drip: '#F5A5B8', text: '#C9365B' },
    'Belgian Dark Cocoa Ganache': { top: '#4A332B', drip: '#2C1D17', text: '#FFE7A3' },
    'Golden Honey Buttercream': { top: '#FEF6D8', drip: '#FCD872', text: '#5A433B' },
    'Pistachio Blossom Swirl': { top: '#EFF7EA', drip: '#B8D4A5', text: '#3E5C27' },
  };

  const currentTheme = frostingColors[frosting] || frostingColors['Strawberry Blush & Vanilla Swirl'];

  const handleLaunchEnquiry = () => {
    onCustomEnquiry({
      flavor,
      weight,
      dietary,
      frosting,
      message,
      estimatedPrice,
    });
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `Hello Manmaya's Cake Delights,\nI customized a cake on your website builder!\n\nFlavor: ${flavor}\nWeight: ${weight}\nDietary: ${dietary === 'eggless' ? '100% Eggless' : dietary === 'pure_veg' ? '100% Pure Veg Guaranteed' : 'Regular'}\nFrosting: ${frosting}\nPiped Message: "${message}"\nEstimated Quote: Approx ₹${estimatedPrice}\n\nPlease confirm availability and booking. Thank you!`
    );
    window.open(`https://wa.me/${INITIAL_SITE_SETTINGS.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FFFDF9] border-b border-[#F0E5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBE6EC] text-[#C9365B] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Cake Builder</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#382722] tracking-tight">
            Design your dream cake in seconds
          </h2>
          <p className="text-sm sm:text-base text-[#664E46] mt-2">
            Experiment with flavors, tiers, eggless preferences, and custom messages. Watch your cake update in real time!
          </p>
        </div>

        {/* Interactive Customizer Card */}
        <div className="bg-white rounded-3xl border border-[#F0E5D8] shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left: Realtime Visual Cake Canvas */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#FFF9F2] via-[#FAF5EF] to-[#FFF2E2] p-6 sm:p-10 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-[#F0E5D8] relative">
              
              <div className="w-full flex items-center justify-between text-xs font-bold text-[#8A7269]">
                <span className="uppercase tracking-wider">Live Preview</span>
                <span className="flex items-center gap-1 text-[#55853B]">
                  {dietary !== 'regular' && (
                    <>
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Eggless Guaranteed</span>
                    </>
                  )}
                </span>
              </div>

              {/* Graphical Cake Illustration that reacts to user input */}
              <div className="relative my-8 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                
                {/* Cake Stand */}
                <div className="absolute bottom-6 w-48 sm:w-56 h-4 bg-[#EAD9C9] rounded-full shadow-md" />
                <div className="absolute bottom-3 w-16 h-8 bg-[#DFCEBC] rounded-b-lg shadow-sm" />
                <div className="absolute bottom-0 w-32 h-3 bg-[#D4C3B1] rounded-full" />

                {/* Cake Base Tier */}
                <div 
                  className="absolute bottom-10 w-44 sm:w-52 h-28 sm:h-32 rounded-2xl transition-all duration-300 shadow-lg border border-black/5 flex flex-col justify-between overflow-hidden"
                  style={{ backgroundColor: currentTheme.top }}
                >
                  {/* Drip Glaze */}
                  <div 
                    className="w-full h-8 transition-colors duration-300 flex items-start justify-around pt-1"
                    style={{ backgroundColor: currentTheme.drip }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-4 rounded-b-full opacity-80"
                        style={{ 
                          height: `${12 + (i % 3) * 6}px`, 
                          backgroundColor: currentTheme.drip 
                        }} 
                      />
                    ))}
                  </div>

                  {/* Piped Custom Message */}
                  <div className="px-3 py-2 text-center my-auto">
                    <span 
                      className="font-serif italic font-bold text-sm sm:text-base transition-colors duration-300 drop-shadow-xs block line-clamp-2 px-2 py-0.5 rounded-md"
                      style={{ color: currentTheme.text }}
                    >
                      "{message || 'Your Message Here'}"
                    </span>
                  </div>

                  {/* Bottom Border Piping */}
                  <div className="flex justify-between px-2 pb-1">
                    {[...Array(9)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-2.5 h-2.5 rounded-full bg-white shadow-xs border border-[#F0E5D8]" 
                      />
                    ))}
                  </div>
                </div>

                {/* Additional Tier if 2-Tier is selected */}
                {weight.includes('2-Tier') && (
                  <div 
                    className="absolute bottom-36 w-32 h-18 rounded-xl transition-all duration-300 shadow-md border border-black/5 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: currentTheme.top }}
                  >
                    <div 
                      className="w-full h-5 absolute top-0"
                      style={{ backgroundColor: currentTheme.drip }}
                    />
                    <Sparkles className="w-4 h-4 text-[#C9365B] mt-2 animate-bounce" />
                  </div>
                )}

                {/* Strawberry / Cherry Topper */}
                <div className="absolute top-10 sm:top-12 flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-[#C9365B] shadow-sm animate-pulse-warm" />
                  <div className="w-3 h-3 rounded-full bg-[#FFE7A3] shadow-xs" />
                </div>
              </div>

              {/* Price Estimate Pill */}
              <div className="w-full p-4 rounded-2xl bg-white border border-[#F0E5D8] flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A7269]">
                    Estimated Indicative Price
                  </div>
                  <div className="text-xl font-extrabold text-[#C9365B]">
                    ₹{estimatedPrice} <span className="text-xs font-normal text-[#8A7269]">(Approx)</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#8A7269] bg-[#FFF9F2] px-2.5 py-1 rounded-lg border border-[#F0E5D8]">
                  Final quote verified by baker
                </span>
              </div>

            </div>

            {/* Right: Controls & Options */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
              
              {/* Flavor Selector */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-2">
                  1. Choose Cake Flavor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Madagascar Vanilla & Strawberry',
                    'Belgian Dark Chocolate Truffle',
                    'Royal Red Velvet Cream Cheese',
                    'Roasted Pistachio & White Cream',
                    'Kesar Mango Velvet (Pure Veg)'
                  ].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFlavor(f)}
                      className={`text-left p-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                        flavor === f
                          ? 'bg-[#FBE6EC] border-[#C9365B] text-[#C9365B] font-bold shadow-xs'
                          : 'bg-white border-[#F0E5D8] text-[#5A433B] hover:border-[#F5A5B8]'
                      }`}
                    >
                      <span className="truncate pr-1">{f}</span>
                      {flavor === f && <Check className="w-3.5 h-3.5 shrink-0 text-[#C9365B]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight / Size */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-2">
                  2. Select Size & Servings
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: '0.5 kg', note: '3–4 guests' },
                    { label: '1.0 kg', note: '6–8 guests' },
                    { label: '2.0 kg', note: '14–16 guests' },
                    { label: '2-Tier (3.0 kg)', note: '25+ guests' }
                  ].map((w) => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => setWeight(w.label)}
                      className={`p-2.5 rounded-xl text-center border transition-all ${
                        weight === w.label
                          ? 'bg-[#FFE7A3]/50 border-[#FCD872] text-[#382722] font-bold shadow-xs'
                          : 'bg-white border-[#F0E5D8] text-[#5A433B] hover:border-[#FFE7A3]'
                      }`}
                    >
                      <div className="text-xs font-bold">{w.label}</div>
                      <div className="text-[10px] text-[#8A7269]">{w.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Requirement */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-2">
                  3. Dietary Preference
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDietary('eggless')}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                      dietary === 'eggless'
                        ? 'bg-[#EFF7EA] border-[#55853B] text-[#382722] font-bold shadow-xs'
                        : 'bg-white border-[#F0E5D8] text-[#5A433B]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#55853B]/10 flex items-center justify-center text-[#55853B] shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">100% Eggless (Pure Veg)</div>
                      <div className="text-[10px] text-[#55853B]">Dedicated hygienic prep</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDietary('regular')}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                      dietary === 'regular'
                        ? 'bg-[#FFF2E2] border-[#C9365B] text-[#382722] font-bold shadow-xs'
                        : 'bg-white border-[#F0E5D8] text-[#5A433B]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#C9365B]/10 flex items-center justify-center text-[#C9365B] shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Regular Classic Sponge</div>
                      <div className="text-[10px] text-[#8A7269]">Bakery traditional</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Frosting & Finish */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-2">
                  4. Frosting Style & Palette
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Strawberry Blush & Vanilla Swirl',
                    'Belgian Dark Cocoa Ganache',
                    'Golden Honey Buttercream',
                    'Pistachio Blossom Swirl'
                  ].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFrosting(style)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all truncate ${
                        frosting === style
                          ? 'bg-[#FBE6EC] border-[#C9365B] text-[#C9365B] font-bold'
                          : 'bg-white border-[#F0E5D8] text-[#5A433B]'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-1">
                  5. Piped Message On Cake
                </label>
                <input
                  type="text"
                  maxLength={35}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Happy 10th Birthday Ananya!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                />
                <span className="text-[10px] text-[#8A7269] mt-0.5 block text-right">
                  {message.length}/35 characters
                </span>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleLaunchEnquiry}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-sm shadow-md shadow-[#C9365B]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Enquire With These Specs</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
