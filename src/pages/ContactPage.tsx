import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Leaf, 
  Search, 
  UploadCloud, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Cake as CakeIcon,
  RotateCcw,
  ChefHat
} from 'lucide-react';
import { INITIAL_SITE_SETTINGS } from '../../src/data/siteSettings';
import { createEnquiry, findEnquiryByReference, fetchEnquiryByReference, subscribeToStoreEvents } from '../data/store';
import { Enquiry, EnquiryStatus } from '../types';
import { playChimeSound, playPopSound } from '../utils/soundEffects';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillCake = searchParams.get('cake') || '';
  const prefillId = searchParams.get('id') || '';
  const prefillFlavor = searchParams.get('flavor') || '';
  const prefillWeight = searchParams.get('weight') || '';
  const prefillDietary = searchParams.get('dietary') as 'eggless' | 'regular' | 'pure_veg' | null;

  // Form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occasion, setOccasion] = useState('Birthday');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('17:00');
  const [cakeName, setCakeName] = useState(prefillCake || 'Feather Wings Signature Cake');
  const [flavor, setFlavor] = useState(prefillFlavor || 'Madagascar Vanilla & Strawberry');
  const [weight, setWeight] = useState(prefillWeight || '1.0 kg (6–8 guests)');
  const [dietary, setDietary] = useState<'eggless' | 'regular' | 'pure_veg'>(prefillDietary || 'eggless');
  const [budgetRange, setBudgetRange] = useState('₹800 - ₹1,200');
  const [messageOnCake, setMessageOnCake] = useState('');
  const [notes, setNotes] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  
  // Reference photo upload
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [imageFileName, setImageFileName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [copied, setCopied] = useState(false);

  // Live Enquiry Status Lookup
  const [trackerCode, setTrackerCode] = useState('');
  const [trackedEnquiry, setTrackedEnquiry] = useState<Enquiry | null | 'NOT_FOUND'>(null);

  // Subscribe to real-time store changes (so if admin updates status, customer tracking updates live!)
  useEffect(() => {
    const unsubscribe = subscribeToStoreEvents((action) => {
      if (action === 'enquiries_updated' && trackerCode.trim()) {
        const found = findEnquiryByReference(trackerCode);
        if (found) {
          setTrackedEnquiry(found);
        }
      }
    });
    return unsubscribe;
  }, [trackerCode]);

  useEffect(() => {
    if (prefillCake) setCakeName(prefillCake);
    if (prefillFlavor) setFlavor(prefillFlavor);
    if (prefillWeight) setWeight(prefillWeight);
    if (prefillDietary) setDietary(prefillDietary);

    const d = new Date();
    d.setDate(d.getDate() + 2);
    setPreferredDate(d.toISOString().split('T')[0]);
  }, [prefillCake, prefillFlavor, prefillWeight, prefillDietary]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: 'File size must be under 5MB.' }));
        return;
      }

      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.file;
        return copy;
      });
      playPopSound();
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your full name.';
    
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!occasion) errs.occasion = 'Please choose the celebration occasion.';
    if (!preferredDate) errs.preferredDate = 'Please select a preferred celebration date.';
    if (!cakeName.trim()) errs.cakeName = 'Please enter your requested cake design or theme.';
    if (!privacyAgreed) errs.privacy = 'Please agree to the bakery booking note.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const enq = await createEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      occasion,
      preferredDate,
      preferredTime: preferredTime || undefined,
      cakeId: prefillId || 'custom-order',
      cakeName: cakeName.trim(),
      flavor,
      weight,
      dietaryPreference: dietary,
      budgetRange,
      messageOnCake: messageOnCake.trim() || undefined,
      referenceImageName: imageFileName || undefined,
      referenceImageUrl: imagePreviewUrl || undefined,
      notes: notes.trim() || undefined,
    });

    setSubmittedEnquiry(enq);
    setTrackerCode(enq.referenceCode);
    setTrackedEnquiry(enq);

    playChimeSound();

    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#F5A5B8', '#C9365B', '#FFE7A3', '#B8D4A5']
      });
    } catch {
      // ignore
    }
  };

  const copyRefCode = () => {
    if (submittedEnquiry) {
      navigator.clipboard.writeText(submittedEnquiry.referenceCode);
      setCopied(true);
      playPopSound();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTrackCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerCode.trim()) return;
    playPopSound();
    const found = await fetchEnquiryByReference(trackerCode) || findEnquiryByReference(trackerCode);
    setTrackedEnquiry(found || 'NOT_FOUND');
  };

  const getWhatsAppURL = () => {
    if (!submittedEnquiry) return '';
    const msg = encodeURIComponent(
      `Hello Manmaya's Cake Delights,\nI have submitted custom cake enquiry #${submittedEnquiry.referenceCode} on your website!\n\n` +
      `• Name: ${submittedEnquiry.name}\n` +
      `• Cake: ${submittedEnquiry.cakeName}\n` +
      `• Occasion: ${submittedEnquiry.occasion}\n` +
      `• Date: ${submittedEnquiry.preferredDate} (${submittedEnquiry.preferredTime || 'Evening'})\n` +
      `• Flavor: ${submittedEnquiry.flavor}\n` +
      `• Weight: ${submittedEnquiry.weight || '1 kg'}\n` +
      `• Dietary: ${submittedEnquiry.dietaryPreference === 'pure_veg' ? '100% Pure Veg' : submittedEnquiry.dietaryPreference === 'eggless' ? '100% Eggless' : 'Regular'}\n` +
      `• Piped Message: "${submittedEnquiry.messageOnCake || 'None'}"\n` +
      `• Special Notes: ${submittedEnquiry.notes || 'None'}\n\n` +
      `Please let me know availability and finalize my order quotation. Thank you!`
    );
    return `https://wa.me/${INITIAL_SITE_SETTINGS.whatsapp}?text=${msg}`;
  };

  // Status Stepper configuration
  const statusSteps: { key: EnquiryStatus; label: string; desc: string }[] = [
    { key: 'NEW', label: 'Enquiry Received', desc: 'Order received into kitchen queue' },
    { key: 'CONTACTED', label: 'Baker Reviewing', desc: 'Connecting via call / WhatsApp' },
    { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Date locked & slots reserved' },
    { key: 'IN_BAKING', label: 'Baking in Progress', desc: 'Handcrafted fresh in Kavisuryanagar' },
    { key: 'COMPLETED', label: 'Ready / Delivered', desc: 'Celebration ready!' },
  ];

  const getStepProgressIndex = (status: EnquiryStatus): number => {
    const idx = statusSteps.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBE6EC] text-[#C9365B] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Baker Communication</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#382722] tracking-tight">
            Order Enquiry & Contact
          </h1>
          <p className="text-sm sm:text-base text-[#664E46] mt-2">
            Submit your custom cake specifications below or track an existing order. We confirm availability and pricing promptly.
          </p>
        </div>

        {/* Live Reference Code Tracker Box */}
        <div className="bg-white rounded-3xl border border-[#F0E5D8] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0E5D8] pb-6">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C9365B]">
                <Clock className="w-3.5 h-3.5" />
                <span>Live Baker Status Tracker</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#382722] mt-0.5">
                Check Your Cake Order Progress
              </h2>
              <p className="text-xs text-[#8A7269]">
                Enter your booking reference code (e.g. <code className="font-mono text-[#C9365B] font-bold">MCD-2026-XXXX</code>) to view real-time kitchen status.
              </p>
            </div>

            {/* Tracker Search Input */}
            <form onSubmit={handleTrackCode} className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                value={trackerCode}
                onChange={(e) => setTrackerCode(e.target.value.toUpperCase())}
                placeholder="MCD-2026-XXXX"
                className="px-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs sm:text-sm font-mono tracking-wider text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8] uppercase w-full md:w-48"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#C9365B] hover:bg-[#A92244] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
            </form>
          </div>

          {/* Tracked Result Display */}
          {trackedEnquiry && trackedEnquiry !== 'NOT_FOUND' && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FFF9F2] p-4 rounded-2xl border border-[#F0E5D8]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A7269]">Order Reference</span>
                  <div className="font-mono text-lg font-extrabold text-[#C9365B]">
                    {trackedEnquiry.referenceCode}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A7269]">Customer</span>
                  <div className="font-bold text-xs text-[#382722]">{trackedEnquiry.name}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A7269]">Cake Design</span>
                  <div className="font-bold text-xs text-[#382722]">{trackedEnquiry.cakeName}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A7269]">Celebration Date</span>
                  <div className="font-bold text-xs text-[#382722]">{trackedEnquiry.preferredDate}</div>
                </div>
              </div>

              {/* 5-Stage Visual Stepper */}
              <div className="py-2">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                  {statusSteps.map((s, idx) => {
                    const currentIdx = getStepProgressIndex(trackedEnquiry.status);
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div 
                        key={s.key} 
                        className={`p-3 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-[#FBE6EC] border-[#C9365B] ring-2 ring-[#F5A5B8]/40 shadow-xs'
                            : isDone
                            ? 'bg-[#EFF7EA] border-[#B8D4A5]'
                            : 'bg-[#FAF5EF] border-[#F0E5D8] opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone ? 'bg-[#55853B] text-white' : 'bg-[#EAD9C9] text-[#664E46]'
                          }`}>
                            {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                        </div>
                        <div className="font-serif text-xs font-bold text-[#382722] leading-tight">
                          {s.label}
                        </div>
                        <div className="text-[10px] text-[#8A7269] mt-1 leading-tight">
                          {s.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Baker notes / status message */}
              {trackedEnquiry.adminNotes && (
                <div className="p-4 rounded-2xl bg-[#EFF7EA] border border-[#B8D4A5] text-xs text-[#3A5A27] flex items-start gap-2.5">
                  <ChefHat className="w-4 h-4 shrink-0 mt-0.5 text-[#55853B]" />
                  <div>
                    <strong>Baker's Note:</strong> {trackedEnquiry.adminNotes}
                  </div>
                </div>
              )}
            </div>
          )}

          {trackedEnquiry === 'NOT_FOUND' && (
            <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>No enquiry found matching code "{trackerCode}". Please verify your reference code or contact our bakery directly.</span>
            </div>
          )}
        </div>

        {/* Main Grid: Form / Confirmation + Bakery Location Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form / Success State */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#F0E5D8] p-6 sm:p-10 shadow-lg">
            
            {submittedEnquiry ? (
              /* Success Confirmation View */
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-[#EFF7EA] border border-[#B8D4A5] text-[#55853B] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8A7269]">
                    Enquiry Recorded into Bakery System
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-[#382722] mt-1">
                    Thank You, {submittedEnquiry.name}!
                  </h2>
                  <p className="text-sm text-[#664E46] mt-1 max-w-md mx-auto">
                    We have created your unique booking reference. Our team in Kavisuryanagar will contact you on {submittedEnquiry.phone} to confirm details.
                  </p>
                </div>

                {/* Reference Code Box */}
                <div className="bg-[#FFF9F2] p-6 rounded-3xl border border-[#F0E5D8] max-w-md mx-auto">
                  <div className="text-xs font-bold text-[#8A7269] mb-1">
                    Your Booking Reference Code
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-3xl font-extrabold text-[#C9365B] bg-white px-4 py-2 rounded-2xl border border-[#F5A5B8] shadow-xs">
                      {submittedEnquiry.referenceCode}
                    </span>
                    <button
                      type="button"
                      onClick={copyRefCode}
                      className="p-3 rounded-2xl bg-white border border-[#F0E5D8] hover:border-[#C9365B] text-[#382722] hover:text-[#C9365B] transition-colors"
                      title="Copy Reference Code"
                    >
                      {copied ? <Check className="w-5 h-5 text-[#55853B]" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Cake specifications recap */}
                <div className="bg-white p-5 rounded-2xl border border-[#F0E5D8] text-left text-xs sm:text-sm max-w-lg mx-auto space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-[#FAF5EF]">
                    <span className="text-[#8A7269]">Cake Design:</span>
                    <span className="font-bold text-[#382722]">{submittedEnquiry.cakeName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#FAF5EF]">
                    <span className="text-[#8A7269]">Occasion & Date:</span>
                    <span className="font-bold text-[#382722]">{submittedEnquiry.occasion} • {submittedEnquiry.preferredDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#FAF5EF]">
                    <span className="text-[#8A7269]">Flavor & Weight:</span>
                    <span className="font-bold text-[#382722]">{submittedEnquiry.flavor} ({submittedEnquiry.weight})</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#8A7269]">Dietary Guarantee:</span>
                    <span className="font-bold text-[#55853B] flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5" />
                      {submittedEnquiry.dietaryPreference === 'pure_veg' 
                        ? '100% Pure Veg Special' 
                        : submittedEnquiry.dietaryPreference === 'eggless' 
                        ? '100% Eggless' 
                        : 'Regular'}
                    </span>
                  </div>
                </div>

                {/* WhatsApp & Reset Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                  <a
                    href={getWhatsAppURL()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send to WhatsApp Now</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedEnquiry(null);
                      setName('');
                      setPhone('');
                      setMessageOnCake('');
                      setImagePreviewUrl('');
                      setImageFileName('');
                    }}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white border border-[#F0E5D8] hover:bg-[#FAF5EF] text-[#382722] font-bold text-sm"
                  >
                    Submit Another
                  </button>
                </div>
              </div>
            ) : (
              /* The Interactive Enquiry Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#382722]">
                    Custom Cake Booking Form
                  </h2>
                  <p className="text-xs text-[#8A7269] mt-0.5">
                    Provide your cake design preferences. Availability and final pricing are confirmed directly by the baker.
                  </p>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Full Name <span className="text-[#C9365B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Swastik Jena"
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8] ${
                        errors.name ? 'border-red-500 bg-red-50/20' : 'border-[#F0E5D8]'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Phone Number (WhatsApp) <span className="text-[#C9365B]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8] ${
                        errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#F0E5D8]'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Email & Occasion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. swastik@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Occasion <span className="text-[#C9365B]">*</span>
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                    >
                      <option value="Birthday">Birthday Celebration</option>
                      <option value="Wedding">Wedding Tier</option>
                      <option value="Anniversary">Anniversary Celebration</option>
                      <option value="Kids Theme">Kids Theme & 3D Art</option>
                      <option value="Baby Shower">Baby Shower / Naming Ceremony</option>
                      <option value="Festive / Special">Festive Celebration</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Date & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Preferred Date <span className="text-[#C9365B]">*</span>
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8] ${
                        errors.preferredDate ? 'border-red-500' : 'border-[#F0E5D8]'
                      }`}
                    />
                    {errors.preferredDate && <p className="text-[11px] text-red-600 mt-1">{errors.preferredDate}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Pickup / Delivery Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                    >
                      <option value="11:00">Morning (10:00 AM – 1:00 PM)</option>
                      <option value="15:00">Afternoon (2:00 PM – 5:00 PM)</option>
                      <option value="18:00">Evening (5:00 PM – 8:00 PM)</option>
                      <option value="20:30">Night (8:00 PM – 9:30 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Cake Design Theme & Flavor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Cake Design / Theme <span className="text-[#C9365B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={cakeName}
                      onChange={(e) => setCakeName(e.target.value)}
                      placeholder="e.g. Feather Wings Signature Cake"
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8] ${
                        errors.cakeName ? 'border-red-500' : 'border-[#F0E5D8]'
                      }`}
                    />
                    {errors.cakeName && <p className="text-[11px] text-red-600 mt-1">{errors.cakeName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Flavor & Sponge
                    </label>
                    <select
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                    >
                      <option value="Madagascar Vanilla & Strawberry">Madagascar Vanilla & Strawberry</option>
                      <option value="Belgian Dark Chocolate Truffle">Belgian Dark Chocolate Truffle</option>
                      <option value="Royal Red Velvet Cream Cheese">Royal Red Velvet Cream Cheese</option>
                      <option value="Roasted Pistachio & White Cream">Roasted Pistachio & White Cream</option>
                      <option value="Kesar Mango Velvet (Pure Veg)">Kesar Mango Velvet (Pure Veg)</option>
                      <option value="Butterscotch Crunch Delight">Butterscotch Crunch Delight</option>
                      <option value="Fresh Seasonal Mixed Fruit">Fresh Seasonal Mixed Fruit</option>
                    </select>
                  </div>
                </div>

                {/* Weight & Dietary Preference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Cake Weight / Tiers
                    </label>
                    <select
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                    >
                      <option value="0.5 kg (3–4 guests)">0.5 kg (3–4 guests)</option>
                      <option value="1.0 kg (6–8 guests)">1.0 kg (6–8 guests)</option>
                      <option value="1.5 kg (10–12 guests)">1.5 kg (10–12 guests)</option>
                      <option value="2.0 kg (15–18 guests)">2.0 kg (15–18 guests)</option>
                      <option value="2-Tier (25+ guests)">2-Tier (25+ guests)</option>
                      <option value="3-Tier (40+ guests)">3-Tier (40+ guests)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">
                      Dietary Requirement
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setDietary('eggless');
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          dietary === 'eggless'
                            ? 'bg-[#EFF7EA] border-[#55853B] text-[#55853B]'
                            : 'bg-[#FFF9F2] border-[#F0E5D8] text-[#5A433B]'
                        }`}
                      >
                        100% Eggless
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setDietary('pure_veg');
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          dietary === 'pure_veg'
                            ? 'bg-[#EFF7EA] border-[#55853B] text-[#55853B]'
                            : 'bg-[#FFF9F2] border-[#F0E5D8] text-[#5A433B]'
                        }`}
                      >
                        Pure Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setDietary('regular');
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          dietary === 'regular'
                            ? 'bg-[#FFF2E2] border-[#C9365B] text-[#C9365B]'
                            : 'bg-[#FFF9F2] border-[#F0E5D8] text-[#5A433B]'
                        }`}
                      >
                        Regular
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message on Cake */}
                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">
                    Edible Message on Cake (Optional)
                  </label>
                  <input
                    type="text"
                    value={messageOnCake}
                    onChange={(e) => setMessageOnCake(e.target.value)}
                    placeholder="e.g. Happy 5th Birthday Anvi!"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                  />
                </div>

                {/* Reference Photo Upload */}
                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">
                    Upload Inspiration / Reference Image (Optional, max 5MB)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 border-2 border-dashed border-[#F0E5D8] hover:border-[#F5A5B8] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#FFF9F2]">
                      <UploadCloud className="w-6 h-6 text-[#8A7269] mx-auto mb-1" />
                      <span className="text-xs font-semibold text-[#5A433B]">
                        {imageFileName ? imageFileName : 'Click to select reference image (PNG, JPG, WebP)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {imagePreviewUrl && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#F0E5D8] shrink-0">
                        <img src={imagePreviewUrl} alt="Upload preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  {errors.file && <p className="text-[11px] text-red-600 mt-1">{errors.file}</p>}
                </div>

                {/* Special Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">
                    Special Instructions / Color Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific color themes, floral ribbons, allergen warnings, or delivery notes..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                  />
                </div>

                {/* Privacy Agreement */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-[#F0E5D8] text-[#C9365B] focus:ring-[#F5A5B8]"
                    />
                    <span className="text-xs text-[#664E46] leading-tight">
                      I understand this enquiry submits specifications to the bakery. Manmaya’s CAKE DELIGHTS will confirm the booking availability, preparation time, and quotation with me directly.
                    </span>
                  </label>
                  {errors.privacy && <p className="text-[11px] text-red-600 mt-1">{errors.privacy}</p>}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-sm shadow-md shadow-[#C9365B]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Submit Custom Cake Enquiry</span>
                </button>

              </form>
            )}

          </div>

          {/* Right Column: Bakery Direct Contact & Location Info */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Direct Baker Contact Card */}
            <div className="bg-white rounded-3xl border border-[#F0E5D8] p-6 shadow-sm space-y-5">
              <h3 className="font-serif text-xl font-bold text-[#382722]">
                Bakery Contact & Hours
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF2E2] text-[#C9365B] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#382722]">Direct Phone Call</div>
                    <a href={`tel:${INITIAL_SITE_SETTINGS.phone}`} className="text-[#C9365B] font-semibold hover:underline">
                      {INITIAL_SITE_SETTINGS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EFF7EA] text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#382722]">Instant WhatsApp Chat</div>
                    <a 
                      href={`https://wa.me/${INITIAL_SITE_SETTINGS.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#25D366] font-semibold hover:underline"
                    >
                      Chat with Baker
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF2E2] text-[#C9365B] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#382722]">Bakery Address</div>
                    <p className="text-[#664E46] leading-relaxed">
                      {INITIAL_SITE_SETTINGS.address}, {INITIAL_SITE_SETTINGS.city}, {INITIAL_SITE_SETTINGS.state} {INITIAL_SITE_SETTINGS.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF2E2] text-[#C9365B] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#382722]">Opening Hours</div>
                    <p className="text-[#664E46]">{INITIAL_SITE_SETTINGS.openingHours}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={INITIAL_SITE_SETTINGS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FFF9F2] hover:bg-[#FFE7A3] border border-[#F0E5D8] text-xs font-bold text-[#382722] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C9365B]" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-[#8A7269]" />
                </a>
              </div>
            </div>

            {/* Pure Veg & Quality Guarantee */}
            <div className="bg-gradient-to-br from-[#EFF7EA] via-white to-[#EFF7EA] rounded-3xl border border-[#B8D4A5] p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#55853B]">
                <Leaf className="w-4 h-4" />
                <span>100% Pure Veg & Eggless Promise</span>
              </div>
              <p className="text-xs text-[#3E5C27] leading-relaxed">
                We take dietary requirements seriously. When you select pure-vegetarian or eggless, our bakers prepare your cake with dedicated cookware, ensuring peace of mind for you and your family.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
