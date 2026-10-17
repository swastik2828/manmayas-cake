import React from 'react';
import { MapPin, Phone, Clock, Navigation, ExternalLink, MessageCircle } from 'lucide-react';
import { INITIAL_SITE_SETTINGS } from '../../data/siteSettings';

export const MapLocationCard: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#FFF9F2] border-b border-[#F0E5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl border border-[#F0E5D8] shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Info Column */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2E2] text-[#C9365B] text-xs font-bold uppercase tracking-wider mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Bakery Location</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#382722] tracking-tight mb-4">
                  Visit Manmaya’s CAKE DELIGHTS
                </h2>

                <p className="text-sm sm:text-base text-[#664E46] leading-relaxed mb-6">
                  Conveniently situated on Krupasindu Nagar Road in Kavisuryanagar, Boirani. Drop by to discuss your custom design, pick up fresh cake orders, or plan your next family milestone celebration.
                </p>

                <div className="space-y-4 text-sm text-[#382722]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF2E2] text-[#C9365B] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs uppercase font-bold text-[#8A7269]">
                        Bakery Address
                      </strong>
                      <span>Krupasindu Nagar Road, Kavisuryanagar, Boirani, Odisha 761104</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FFE7A3]/60 text-[#382722] flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs uppercase font-bold text-[#8A7269]">
                        Opening Hours
                      </strong>
                      <span>Monday – Sunday: 9:00 AM – 9:30 PM</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EFF7EA] text-[#55853B] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs uppercase font-bold text-[#8A7269]">
                        Phone / Direct Ordering
                      </strong>
                      <a href={`tel:${INITIAL_SITE_SETTINGS.phone}`} className="font-bold text-[#C9365B] hover:underline">
                        +91 91758 24555
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-[#F0E5D8] flex flex-col sm:flex-row gap-3">
                <a
                  href={INITIAL_SITE_SETTINGS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-sm shadow-md shadow-[#C9365B]/20 transition-all hover:scale-[1.01]"
                >
                  <Navigation className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Get Driving Directions</span>
                </a>

                <a
                  href={`https://wa.me/${INITIAL_SITE_SETTINGS.whatsapp}?text=${encodeURIComponent("Hello! I need directions to Manmaya's Cake Delights in Kavisuryanagar.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Location</span>
                </a>
              </div>

            </div>

            {/* Right Map Visual / Embed */}
            <div className="lg:col-span-6 bg-[#FAF5EF] min-h-[320px] lg:min-h-[480px] relative border-t lg:border-t-0 lg:border-l border-[#F0E5D8]">
              <iframe
                title="Google Maps Location of Manmaya's CAKE DELIGHTS"
                src="https://maps.google.com/maps?q=19.5851832,84.7466853&hl=en&z=16&output=embed"
                className="w-full h-full min-h-[320px] lg:min-h-[480px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating pill over map */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-[#F0E5D8] shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#C9365B] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#382722]">Manmaya’s CAKE DELIGHTS</div>
                  <div className="text-[10px] text-[#8A7269]">Kavisuryanagar, Boirani, Odisha</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
