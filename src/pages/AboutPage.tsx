import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Leaf, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Clock, 
  MapPin, 
  Phone,
  Cake,
  CheckCircle2 
} from 'lucide-react';
import { INITIAL_SITE_SETTINGS } from '../data/siteSettings';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF9F2] py-8 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Story Intro Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2E2] text-[#C9365B] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-[#C9365B]" />
            <span>Artisanal Patisserie in Kavisuryanagar</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#382722] tracking-tight">
            Our Story & Craft
          </h1>
          <p className="text-base sm:text-lg text-[#5A433B] leading-relaxed">
            Welcome to <strong>Manmaya’s CAKE DELIGHTS</strong>, where every cake is baked with genuine care to celebrate life's sweetest milestones.
          </p>
        </div>

        {/* Hero Visual Card */}
        <div className="bg-white rounded-3xl border border-[#F0E5D8] p-4 sm:p-6 shadow-xl overflow-hidden">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#FAF5EF]">
            <img
              src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1400&q=80"
              alt="Artisanal bakery prep at Manmaya's Cake Delights"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FFE7A3]">
                Handcrafted with Pride
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Freshly Baked on Krupasindu Nagar Road, Kavisuryanagar
              </h2>
            </div>
          </div>
        </div>

        {/* Narrative & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5D8] shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF2E2] text-[#C9365B] flex items-center justify-center">
              <Cake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#382722]">
              The Bakery Philosophy
            </h3>
            <p className="text-sm text-[#5A433B] leading-relaxed">
              Manmaya’s CAKE DELIGHTS was founded with a singular aim: to bring world-class, artistic celebration cakes to families across Kavisuryanagar and Boirani without compromising on freshness or authentic taste.
            </p>
            <p className="text-sm text-[#5A433B] leading-relaxed">
              Unlike mass commercial bakeries that rely on frozen sponges and premixes, every celebration cake ordered with us is baked fresh on the day of pickup. We take the time to hand-pipe intricate buttercream flowers, sculpt delicate feather wings, and balance rich chocolate ganaches.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5D8] shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF7EA] text-[#55853B] flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#382722]">
              Pure Vegetarian Dedication
            </h3>
            <p className="text-sm text-[#5A433B] leading-relaxed">
              We deeply respect our community’s religious practices, dietary choices, and family traditions. We provide dedicated 100% eggless preparation options with separate utensils and strict baking hygiene.
            </p>
            <p className="text-sm text-[#5A433B] leading-relaxed">
              Our eggless sponges are naturally tender, light, and airy, infused with real Madagascar vanilla beans, fresh fruit purees, and roasted nuts so you never have to compromise on texture or taste.
            </p>
          </div>

        </div>

        {/* Core Pillars */}
        <div className="bg-gradient-to-r from-[#FFF2E2] via-[#FBE6EC] to-[#FFF2E2] rounded-3xl p-8 sm:p-10 border border-[#F0E5D8]">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#382722] text-center mb-8">
            What Sets Manmaya’s Apart
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#F0E5D8] text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF2E2] text-[#C9365B] mx-auto flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#382722] mb-1">
                Feather Wings Art
              </h4>
              <p className="text-xs text-[#664E46]">
                Our signature angel wing designs have become the centerpiece of birthdays across Ganjam district.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#F0E5D8] text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE7A3]/60 text-[#382722] mx-auto flex items-center justify-center mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#382722] mb-1">
                5.0★ Google Verified
              </h4>
              <p className="text-xs text-[#664E46]">
                Over 66 genuine 5-star customer reviews vouching for taste, punctual delivery, and friendly care.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#F0E5D8] text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF7EA] text-[#55853B] mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#382722] mb-1">
                Fresh Ingredients Only
              </h4>
              <p className="text-xs text-[#664E46]">
                Pure Dutch cocoa, unadulterated cream, and real fruits without unnecessary synthetic chemical fillings.
              </p>
            </div>
          </div>
        </div>

        {/* Local Address & Contact Callout */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E5D8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#382722]">
              Visit or Call Our Bakery
            </h3>
            <p className="text-xs sm:text-sm text-[#664E46] mt-1">
              Krupasindu Nagar Road, Kavisuryanagar, Boirani, Odisha 761104 • Open daily 9:00 AM – 9:30 PM
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${INITIAL_SITE_SETTINGS.phone}`}
              className="px-5 py-3 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#FFE7A3]" />
              <span>Call +91 91758 24555</span>
            </a>

            <Link
              to="/contact"
              className="px-5 py-3 rounded-2xl bg-[#FFF9F2] border border-[#F0E5D8] hover:border-[#F5A5B8] text-[#382722] font-bold text-xs sm:text-sm transition-all"
            >
              Order a Custom Cake &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
