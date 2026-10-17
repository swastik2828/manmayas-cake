import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cake, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  Heart,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { INITIAL_SITE_SETTINGS } from '../../data/siteSettings';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2C1D17] text-[#EDE2D8] border-t border-[#3E2C24] pt-16 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#443128]">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C9365B] flex items-center justify-center text-white shadow-md shadow-[#C9365B]/30">
                <Cake className="w-5 h-5 text-[#FFE7A3]" />
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-white tracking-tight leading-none">
                  Manmaya's
                </span>
                <span className="text-[10px] tracking-widest font-bold uppercase text-[#F5A5B8]">
                  Cake Delights
                </span>
              </div>
            </div>
            
            <p className="text-sm text-[#C8B8AE] leading-relaxed">
              Handcrafted custom birthday cakes, signature feather wings creations, wedding tiers, and pure-vegetarian celebration cakes baked with love in Kavisuryanagar, Odisha.
            </p>

            {/* Google Rating Pill */}
            <a 
              href={INITIAL_SITE_SETTINGS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3D2B23] border border-[#503A30] hover:border-[#F5A5B8] text-white text-xs font-semibold transition-all group"
            >
              <div className="flex items-center text-[#FCD872]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FCD872]" />
                ))}
              </div>
              <span className="font-bold">5.0 / 5</span>
              <span className="text-[#A79388]">• 66 Google Reviews</span>
              <ExternalLink className="w-3 h-3 text-[#A79388] group-hover:text-white" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5A5B8]" />
              Explore Bakery
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/cakes" className="text-[#C8B8AE] hover:text-[#FFE7A3] transition-colors">
                  Cake Catalogue & Flavors
                </Link>
              </li>
              <li>
                <Link to="/cakes?category=feather-wings" className="text-[#C8B8AE] hover:text-[#FFE7A3] transition-colors">
                  Feather Wings Signature
                </Link>
              </li>
              <li>
                <Link to="/cakes?category=wedding" className="text-[#C8B8AE] hover:text-[#FFE7A3] transition-colors">
                  Wedding & Anniversary Tiers
                </Link>
              </li>
              <li>
                <Link to="/cakes?category=pure-veg" className="text-[#C8B8AE] hover:text-[#FFE7A3] transition-colors flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#55853B]"></span>
                  100% Pure Veg Cakes
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-[#C8B8AE] hover:text-[#FFE7A3] transition-colors">
                  Photo Gallery & Lightbox
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-[#C8B8AE] hover:text-[#FFE7A3] transition-colors">
                  Customer Reviews & Ratings
                </Link>
              </li>
            </ul>
          </div>

          {/* Address & Hours */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F5A5B8]" />
              Visit Bakery
            </h4>
            <div className="space-y-3 text-sm text-[#C8B8AE]">
              <p className="leading-snug">
                <strong className="text-white block font-medium">Manmaya’s CAKE DELIGHTS</strong>
                Krupasindu Nagar Road, Kavisuryanagar, Boirani, Odisha 761104
              </p>
              
              <div className="flex items-center gap-2 text-xs text-[#EAD9C9] pt-1">
                <Clock className="w-4 h-4 text-[#FFE7A3] shrink-0" />
                <span>Mon – Sun: 9:00 AM – 9:30 PM</span>
              </div>

              <div className="pt-2">
                <a
                  href={INITIAL_SITE_SETTINGS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFE7A3] hover:underline"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Open in Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Direct Phone & Ordering */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#F5A5B8]" />
              Direct Orders
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${INITIAL_SITE_SETTINGS.phone}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#3D2B23] border border-[#503A30] hover:border-[#F5A5B8] text-white transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#C9365B] flex items-center justify-center text-white shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-[#A79388] font-medium">Call the Baker</div>
                  <div className="text-sm font-bold text-white group-hover:text-[#FFE7A3]">+91 91758 24555</div>
                </div>
              </a>

              <a
                href={`https://wa.me/${INITIAL_SITE_SETTINGS.whatsapp}?text=${encodeURIComponent("Hello Manmaya's Cake Delights, I would like to order a custom cake.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366] text-white transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#25D366] flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-[#25D366] font-medium">WhatsApp Quotation</div>
                  <div className="text-sm font-bold text-white">Quick Chat on WhatsApp</div>
                </div>
              </a>

              <Link
                to="/contact"
                className="block text-center w-full py-2.5 px-3 rounded-xl bg-[#C9365B] hover:bg-[#A92244] text-white text-xs font-bold transition-all"
              >
                Submit Custom Cake Form &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Dietary & Verification Transparency Note as required by PRD Section 2 & 5 */}
        <div className="mt-8 p-4 rounded-2xl bg-[#38261F] border border-[#483329] text-xs text-[#BFAFA5] leading-relaxed flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#55853B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-medium">Dietary & Pricing Note: </strong>
              Prices shown are indicative ranges (approx ₹400–₹1,400 depending on design complexity, weight, and tiers). Pure-vegetarian (eggless) preparations are available on request; please confirm exact dietary preferences with our team when confirming your order.
            </div>
          </div>
          <Link
            to="/admin"
            className="text-[11px] text-[#A79388] hover:text-white underline shrink-0 font-medium"
          >
            Baker Portal
          </Link>
        </div>

        {/* Bottom Copyright & Credits */}
        <div className="mt-8 pt-6 border-t border-[#3E2C24] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8F7C73]">
          <p>© {new Date().getFullYear()} Manmaya’s CAKE DELIGHTS. All rights reserved. Kavisuryanagar, Boirani, Odisha.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white transition-colors">Our Story</Link>
            <span>•</span>
            <Link to="/reviews" className="hover:text-white transition-colors">Google Reviews (5.0★)</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">Order Enquiry</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
