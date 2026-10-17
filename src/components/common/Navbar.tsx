import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, 
  Menu, 
  X, 
  Cake as CakeIcon, 
  Sparkles, 
  MessageCircle, 
  MapPin,
  Volume2,
  VolumeX,
  Search
} from 'lucide-react';
import { getStoredSettings, subscribeToStoreEvents } from '../../data/store';
import { SiteSettings } from '../../types';
import { isAudioMuted, toggleAudioMute, playPopSound } from '../../utils/soundEffects';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(() => getStoredSettings());
  const [muted, setMuted] = useState<boolean>(() => isAudioMuted());
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = subscribeToStoreEvents((action) => {
      if (action === 'settings_updated') {
        setSettings(getStoredSettings());
      }
    });

    const handleMuteEvent = (e: Event) => {
      const ce = e as CustomEvent;
      setMuted(ce.detail?.muted);
    };

    window.addEventListener('mcd-audio-mute-changed', handleMuteEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('mcd-audio-mute-changed', handleMuteEvent);
    };
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Our Cakes', path: '/cakes' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Our Story', path: '/about' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Track & Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleAudioToggle = () => {
    const next = toggleAudioMute();
    setMuted(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF9F2]/95 backdrop-blur-md border-b border-[#F0E5D8]">
      {/* Top Announcement Bar (Live Reactive) */}
      {settings.announcement.enabled && (
        <div className="bg-[#C9365B] text-white text-xs sm:text-sm py-1.5 px-3 sm:px-4 text-center font-medium flex items-center justify-center gap-2">
          <span className="bg-[#FFE7A3] text-[#382722] px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            {settings.announcement.badge || 'Booking Notice'}
          </span>
          <span className="truncate max-w-[85vw] sm:max-w-none">
            {settings.announcement.text}
          </span>
          <Link to="/contact" className="hidden sm:inline-block underline font-semibold ml-1 hover:text-[#FFE7A3]">
            Enquire Now &rarr;
          </Link>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group text-left">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F5A5B8] to-[#C9365B] flex items-center justify-center shadow-md shadow-[#F5A5B8]/30 group-hover:scale-105 transition-transform duration-200">
              <CakeIcon className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#382722] leading-none group-hover:text-[#C9365B] transition-colors">
                Manmaya's
              </span>
              <span className="block text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#C9365B] mt-1">
                Cake Delights • Kavisuryanagar
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive(item.path)
                    ? 'bg-[#FBE6EC] text-[#C9365B] shadow-xs'
                    : 'text-[#5A433B] hover:text-[#C9365B] hover:bg-[#FFF2E2]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleAudioToggle}
              className="p-2.5 rounded-xl bg-white border border-[#F0E5D8] hover:border-[#F5A5B8] text-[#5A433B] transition-colors shadow-xs"
              title={muted ? 'Enable Patisserie Sounds' : 'Mute Sounds'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#C9365B]" />}
            </button>

            {/* Quick Phone Call */}
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#5A433B] bg-white border border-[#F0E5D8] hover:border-[#F5A5B8] hover:text-[#C9365B] transition-all shadow-xs"
              title="Call Bakery Directly"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9365B]" />
              <span>+91 91758 24555</span>
            </a>

            {/* Order CTA */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#C9365B] hover:bg-[#A92244] shadow-md shadow-[#C9365B]/20 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
              <span>Order Custom Cake</span>
            </Link>
          </div>

          {/* Mobile Right Quick Action & Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={handleAudioToggle}
              className="p-2 rounded-xl bg-white border border-[#F0E5D8] text-[#5A433B]"
              aria-label="Toggle Audio"
            >
              {muted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#C9365B]" />}
            </button>

            <a
              href={`tel:${settings.phone}`}
              className="p-2.5 rounded-xl bg-white border border-[#F0E5D8] text-[#C9365B] active:bg-[#FBE6EC]"
              aria-label="Call bakery"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#FFF2E2] text-[#382722] hover:text-[#C9365B] border border-[#F0E5D8] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#F0E5D8] bg-[#FFF9F2] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5 mb-4">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive(item.path)
                    ? 'bg-[#C9365B] text-white shadow-sm'
                    : 'text-[#382722] hover:bg-[#FFF2E2] hover:text-[#C9365B]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F0E5D8] space-y-2.5">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C9365B] text-white font-bold text-center shadow-md shadow-[#C9365B]/20"
            >
              <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
              Order a Custom Cake
            </Link>

            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello Manmaya's Cake Delights, I would like to enquire about ordering a cake.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] text-white font-bold text-center text-sm shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>

            <div className="text-xs text-[#8A7269] flex items-center justify-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C9365B]" />
              <span>{settings.address}, {settings.city}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
