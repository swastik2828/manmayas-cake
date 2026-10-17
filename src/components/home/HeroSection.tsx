import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Star, 
  Phone, 
  ArrowRight, 
  Heart, 
  Leaf, 
  Rotate3d, 
  CheckCircle2,
  Clock,
  Compass,
  Palette
} from 'lucide-react';
import { INITIAL_SITE_SETTINGS } from '../../data/siteSettings';
import { playPopSound } from '../../utils/soundEffects';

interface HeroSectionProps {
  onOpenEnquiry: () => void;
  onOpenMatcher?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenEnquiry, onOpenMatcher }) => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  const [tiltStyle, setTiltStyle] = useState<string>('');
  const [glossOffset, setGlossOffset] = useState<number>(50);
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Interactive signature flavor spotlight pills
  const [activeFlavor, setActiveFlavor] = useState<string>('Strawberry Blush Velvet');

  const SIGNATURE_FLAVORS: Record<string, { note: string; color: string; badge: string }> = {
    'Strawberry Blush Velvet': {
      note: 'Fresh Mahabaleshwar strawberry reduction with silky Madagascar cream',
      color: '#C9365B',
      badge: 'Best Seller',
    },
    'Belgian Dark Chocolate': {
      note: '70% pure Callebaut chocolate ganache layered with moist chocolate sponge',
      color: '#3D2319',
      badge: 'Artisanal Classic',
    },
    'Roasted Pistachio Glow': {
      note: 'Fragrant Persian roasted pistachio cremeux with crunchy golden praline',
      color: '#3A5A27',
      badge: 'Chef Specialty',
    },
    'Madagascar Vanilla Cream': {
      note: 'Slow-infused whole Bourbon vanilla beans with light chantilly frosting',
      color: '#9E5B20',
      badge: 'Timeless Delicate',
    },
  };

  // 1. Haute-Patisserie Floating Canvas Engine (Sugar Crystals, 4-Point Sparkles, Gold Foil Flakes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Confectionery motes (sugar dust, gold flakes, strawberry blush crystal, pistachio powder)
    const particleColors = [
      'rgba(245, 165, 184, 0.55)', // strawberry pink
      'rgba(255, 231, 163, 0.70)', // golden butter
      'rgba(201, 54, 91, 0.40)',   // raspberry rose
      'rgba(184, 212, 165, 0.50)', // pistachio
      'rgba(255, 255, 255, 0.85)', // pure confectioner sugar
    ];

    const particles = Array.from({ length: 54 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.2 + Math.random() * 3.0,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      speedY: 0.25 + Math.random() * 0.45,
      speedX: (Math.random() - 0.5) * 0.35,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: 0.01 + Math.random() * 0.025,
      sparkleSpeed: 0.03 + Math.random() * 0.05,
      sparklePhase: Math.random() * Math.PI * 2,
      isStar: Math.random() > 0.75, // 25% are 4-point twinkling patisserie stars
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const draw4PointStar = (context: CanvasRenderingContext2D, cx: number, cy: number, size: number, rot: number) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(rot);
      context.beginPath();
      context.moveTo(0, -size);
      context.quadraticCurveTo(0, 0, size, 0);
      context.quadraticCurveTo(0, 0, 0, size);
      context.quadraticCurveTo(0, 0, -size, 0);
      context.quadraticCurveTo(0, 0, 0, -size);
      context.fill();
      context.restore();
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      const isMouseActive = mousePosRef.current.active;

      particles.forEach((p) => {
        // Natural gentle drift
        p.y -= p.speedY;
        p.angle += p.angularSpeed;
        p.rot += p.rotSpeed;
        p.x += Math.sin(p.angle) * 0.45 + p.speedX;
        p.sparklePhase += p.sparkleSpeed;

        // Wrap around canvas bounds
        if (p.y < -15) p.y = height + 15;
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Mouse vortex repulsion / gentle bakery breeze
        if (isMouseActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 0) {
            const force = (160 - dist) / 160;
            p.x += (dx / dist) * force * 3.2;
            p.y += (dy / dist) * force * 3.2;
          }
        }

        const alphaPulse = 0.45 + Math.sin(p.sparklePhase) * 0.45;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.12, alphaPulse);

        if (p.isStar) {
          draw4PointStar(ctx, p.x, p.y, p.radius * 2.2, p.rot);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Soft golden aura around larger sugar crystals
          if (p.radius > 2.6) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2.0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 231, 163, 0.18)';
            ctx.fill();
          }
        }
      });

      ctx.globalAlpha = 1.0;
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Mouse Move Parallax, Ambient Light Tracking & 3D Card Tilt
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const cRect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - cRect.left;
      const clientY = e.clientY - cRect.top;

      mousePosRef.current = { x: clientX, y: clientY, active: true };
      setMouseCoord({ x: clientX, y: clientY, active: true });

      const relX = (clientX - cRect.width / 2) / (cRect.width / 2);
      const relY = (clientY - cRect.top - cRect.height / 2) / (cRect.height / 2);
      setParallaxOffset({ x: relX * 22, y: relY * 22 });
    }

    if (imageCardRef.current) {
      const rect = imageCardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -11;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 11;
      setTiltStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`);
      setGlossOffset(((x / rect.width) * 100));
    }
  };

  const handleMouseLeave = () => {
    mousePosRef.current.active = false;
    setMouseCoord({ x: 0, y: 0, active: false });
    setTiltStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
    setParallaxOffset({ x: 0, y: 0 });
    setGlossOffset(50);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F2] to-[#FFF3E3] pt-8 pb-16 sm:py-20 lg:py-26 border-b border-[#F0E5D8]"
    >
      {/* 1. Interactive Golden-Honey Cursor Ambient Spotlight Aura */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          background: mouseCoord.active
            ? `radial-gradient(750px circle at ${mouseCoord.x}px ${mouseCoord.y}px, rgba(255, 231, 163, 0.28), rgba(245, 165, 184, 0.16) 35%, transparent 75%)`
            : 'radial-gradient(850px circle at 50% 30%, rgba(255, 231, 163, 0.22), rgba(245, 165, 184, 0.12) 40%, transparent 80%)',
        }}
      />

      {/* 2. Haute-Patisserie Sugar & Golden Dust Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-15" 
      />

      {/* 3. Luxury Artisanal Scalloped Patisserie Pattern */}
      <div className="absolute inset-0 patisserie-scallop-pattern opacity-35 pointer-events-none -z-0" />

      {/* 4. Elegant Patisserie Salon Arch & Sunburst Ray Geometry */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] pointer-events-none -z-0 opacity-20">
        <svg viewBox="0 0 1100 550" fill="none" className="w-full h-full stroke-[#F5A5B8]">
          <circle cx="550" cy="0" r="300" strokeWidth="1.5" strokeDasharray="4 6" />
          <circle cx="550" cy="0" r="420" strokeWidth="1.5" />
          <circle cx="550" cy="0" r="520" strokeWidth="1.5" strokeDasharray="6 8" />
        </svg>
      </div>

      {/* 5. Luxury Warm Patisserie Lighting Orbs with Dynamic Parallax */}
      <div 
        className="absolute -top-16 left-1/5 w-[560px] h-[360px] bg-gradient-to-tr from-[#F5A5B8]/30 via-[#FFE7A3]/40 to-[#B8D4A5]/25 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out -z-0"
        style={{ transform: `translate(${parallaxOffset.x * 0.9}px, ${parallaxOffset.y * 0.9}px)` }}
      />
      <div 
        className="absolute bottom-6 right-8 w-[480px] h-[400px] bg-gradient-to-bl from-[#FFE7A3]/45 via-[#F5A5B8]/25 to-transparent rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out -z-0"
        style={{ transform: `translate(${-parallaxOffset.x * 0.7}px, ${-parallaxOffset.y * 0.7}px)` }}
      />

      {/* 6. Luxury Floating Confectionery Badges with Parallax */}
      {/* Floating French Macaron Jewel Top Left */}
      <div 
        className="absolute top-24 left-6 sm:left-12 hidden sm:block animate-float-slow pointer-events-none select-none transition-transform duration-500 ease-out z-20"
        style={{ transform: `translate(${parallaxOffset.x * 1.6}px, ${parallaxOffset.y * 1.6}px)` }}
      >
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#F5A5B8] shadow-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F5A5B8] to-[#FFE7A3] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#C9365B]">
              Artisanal Studio
            </div>
            <div className="text-[10px] text-[#8A7269]">Custom Sculpted Cakes</div>
          </div>
        </div>
      </div>

      {/* Floating Live Bakery Status Top Right */}
      <div 
        className="absolute top-16 right-8 sm:right-24 hidden md:block animate-float-reverse pointer-events-none select-none transition-transform duration-500 ease-out z-20"
        style={{ transform: `translate(${-parallaxOffset.x * 1.3}px, ${-parallaxOffset.y * 1.3}px)` }}
      >
        <div className="px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#FFE7A3] shadow-lg flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#55853B] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#55853B]" />
          </span>
          <span className="text-[11px] font-extrabold text-[#382722] tracking-wider uppercase">
            Oven Fresh in Kavisuryanagar
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headlines & Editorial Story */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Verified Google Rating Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#F0E5D8] shadow-sm backdrop-blur-xs">
              <div className="flex items-center text-[#FCD872]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FCD872]" />
                ))}
              </div>
              <span className="text-xs font-extrabold text-[#382722]">
                5.0★ Verified on Google Maps
              </span>
              <span className="text-xs text-[#8A7269]">
                (66 Reviews • Kavisuryanagar, Boirani)
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#382722] tracking-tight leading-[1.12]">
              A little sweetness for your{' '}
              <span className="relative inline-block text-[#C9365B]">
                biggest moments.
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3.5 text-[#F5A5B8]"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C50 3 150 3 197 9"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Supporting line */}
            <p className="text-base sm:text-lg lg:text-xl text-[#5A433B] leading-relaxed max-w-2xl font-normal">
              Artisanal cakes for birthdays, weddings, anniversaries, and grand family celebrations. Handcrafted with rich Belgian chocolates, fresh fruit compotes, and certified 100% pure-veg preparation in Kavisuryanagar, Odisha.
            </p>

            {/* Sensory Tasting Notes Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: 'Feather Wings Signatures', icon: Sparkles, color: 'text-[#C9365B]' },
                { label: '100% Eggless Guaranteed', icon: Leaf, color: 'text-[#55853B]' },
                { label: '3D WebGL Studio Below', icon: Rotate3d, color: 'text-[#E09F1F]' },
              ].map((pill, idx) => {
                const IconComponent = pill.icon;
                return (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/95 border border-[#F0E5D8] text-xs font-bold text-[#382722] shadow-xs"
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${pill.color}`} />
                    <span>{pill.label}</span>
                  </span>
                );
              })}
            </div>

            {/* Interactive Signature Flavor Selector Preview */}
            <div className="p-3.5 rounded-2xl bg-white/90 border border-[#F0E5D8] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#8A7269]">
                <div className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#C9365B]" />
                  <span>Explore Signature Flavors</span>
                </div>
                <span className="text-[10px] text-[#C9365B] font-semibold">
                  {SIGNATURE_FLAVORS[activeFlavor]?.badge}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {Object.keys(SIGNATURE_FLAVORS).map((flav) => {
                  const isSelected = activeFlavor === flav;
                  const item = SIGNATURE_FLAVORS[flav];
                  return (
                    <button
                      key={flav}
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setActiveFlavor(flav);
                      }}
                      className={`px-2.5 py-2 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#FFF2E2] border-[#C9365B] text-[#382722] shadow-xs font-bold'
                          : 'bg-white border-[#F0E5D8] text-[#5A433B] hover:border-[#F5A5B8]'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-black/10" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="truncate">{flav.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#664E46] italic pt-0.5">
                {SIGNATURE_FLAVORS[activeFlavor]?.note}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onOpenEnquiry}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white text-base font-bold shadow-lg shadow-[#C9365B]/25 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-5 h-5 text-[#FFE7A3]" />
                <span>Order a Custom Cake</span>
              </button>

              <Link
                to="/cakes"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-[#FFF2E2] text-[#382722] text-base font-bold border border-[#F0E5D8] hover:border-[#F5A5B8] transition-all shadow-xs"
              >
                <span>Explore Cake Menu</span>
                <ArrowRight className="w-4 h-4 text-[#C9365B]" />
              </Link>

              {onOpenMatcher && (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    onOpenMatcher();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-4 rounded-2xl bg-[#EFF7EA] hover:bg-[#e2f1d8] text-[#55853B] text-xs font-bold border border-[#B8D4A5] transition-all shadow-xs"
                  title="Take the cake quiz"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cake Matcher Quiz</span>
                </button>
              )}
            </div>

            {/* Quick Contact & Direct Phone */}
            <div className="flex items-center gap-3 text-xs text-[#8A7269] pt-1">
              <span>Have an urgent celebration order?</span>
              <a
                href={`tel:${INITIAL_SITE_SETTINGS.phone}`}
                className="inline-flex items-center gap-1 font-bold text-[#C9365B] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call +91 91758 24555</span>
              </a>
            </div>

          </div>

          {/* Right Column: Hero Visual with Cake Photography & Interactive 3D Perspective Tilt */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Cake Image Card with 3D perspective tilt & gold frame */}
              <div 
                ref={imageCardRef}
                style={{ 
                  transform: tiltStyle,
                  transition: tiltStyle ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
                }}
                className="relative rounded-3xl overflow-hidden bg-white p-3.5 border-2 border-[#F0E5D8] shadow-2xl will-change-transform group"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF5EF]">
                  <img
                    src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=900&q=80"
                    alt="Manmaya's Cake Delights signature cake"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                  
                  {/* Dynamic Specular Gloss Light Sheen */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-40 transition-opacity group-hover:opacity-60"
                    style={{
                      background: `linear-gradient(${110 + (glossOffset - 50) * 0.5}deg, rgba(255,255,255,0.4) 0%, transparent 45%, rgba(255,255,255,0.15) 100%)`,
                    }}
                  />

                  {/* Photo Overlay Caption */}
                  <div className="absolute bottom-5 left-5 right-5 text-white pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C9365B] text-white uppercase tracking-wider inline-block mb-1.5 shadow-sm">
                      Signature Creation
                    </span>
                    <h3 className="font-serif text-2xl font-bold leading-tight drop-shadow-sm">
                      Feather Wings Birthday Cake
                    </h3>
                    <p className="text-xs text-white/90 mt-1">
                      Silky Madagascar vanilla buttercream & handcrafted sculpted feather wings
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Top Badge with Parallax Depth */}
              <div 
                className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#F0E5D8] shadow-xl flex items-center gap-3 animate-float-gentle"
                style={{ transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)` }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF7EA] border border-[#B8D4A5] flex items-center justify-center text-[#55853B] shadow-xs">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#382722]">100% Pure Veg Care</div>
                  <div className="text-[10px] text-[#8A7269]">Dedicated Eggless Utensils</div>
                </div>
              </div>

              {/* Floating Bottom Badge with Parallax Depth */}
              <div 
                className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#F0E5D8] shadow-xl flex items-center gap-3 animate-float-reverse"
                style={{ transform: `translate(${-parallaxOffset.x * 0.4}px, ${-parallaxOffset.y * 0.4}px)` }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFE7A3] border border-[#FCD872] flex items-center justify-center text-[#E09F1F] shadow-xs">
                  <Star className="w-5 h-5 fill-[#E09F1F]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#382722]">5.0 / 5★ Rating</div>
                  <div className="text-[10px] text-[#8A7269]">66 Verified Google Reviews</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
