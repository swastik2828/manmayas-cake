import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Leaf, 
  AlertCircle 
} from 'lucide-react';
import { Cake, Enquiry } from '../../types';
import { createEnquiry } from '../../data/store';
import { INITIAL_SITE_SETTINGS } from '../../data/siteSettings';
import { playPopSound, playChimeSound } from '../../utils/soundEffects';

interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCake?: Cake | null;
}

export const QuickEnquiryModal: React.FC<QuickEnquiryModalProps> = ({
  isOpen,
  onClose,
  preselectedCake,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occasion, setOccasion] = useState('Birthday');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [cakeName, setCakeName] = useState('');
  const [flavor, setFlavor] = useState('');
  const [weight, setWeight] = useState('1.0 kg (6–8 guests)');
  const [dietary, setDietary] = useState<'eggless' | 'regular' | 'pure_veg'>('eggless');
  const [messageOnCake, setMessageOnCake] = useState('');
  const [budgetRange, setBudgetRange] = useState('₹500 - ₹1,000');
  const [notes, setNotes] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preselectedCake) {
      setCakeName(preselectedCake.name);
      if (preselectedCake.flavors.length > 0) {
        setFlavor(preselectedCake.flavors[0]);
      }
      if (preselectedCake.weightOptions.length > 0) {
        setWeight(preselectedCake.weightOptions[0]);
      }
      if (preselectedCake.isPureVegSpecial) {
        setDietary('pure_veg');
      }
    } else {
      setCakeName('Custom Celebration Cake');
      setFlavor('Madagascar Vanilla & Strawberry');
    }

    // Default preferred date to 2 days from now
    const d = new Date();
    d.setDate(d.getDate() + 2);
    setPreferredDate(d.toISOString().split('T')[0]);
  }, [preselectedCake, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please provide your full name.';
    
    // Normalize and validate Indian phone number (10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!occasion) errs.occasion = 'Please select the celebration occasion.';
    if (!preferredDate) errs.preferredDate = 'Please select a preferred celebration date.';
    if (!cakeName.trim()) errs.cakeName = 'Please enter or select a cake design.';
    if (!privacyAgreed) errs.privacy = 'Please accept the privacy note to submit your enquiry.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newEnq = await createEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      occasion,
      preferredDate,
      preferredTime: preferredTime || undefined,
      cakeId: preselectedCake?.id || 'custom-design',
      cakeName: cakeName.trim(),
      flavor,
      weight,
      dietaryPreference: dietary,
      messageOnCake: messageOnCake.trim() || undefined,
      budgetRange,
      notes: notes.trim() || undefined,
    });

    setSubmittedEnquiry(newEnq);

    // Trigger sweet celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getWhatsAppMessage = () => {
    if (!submittedEnquiry) return '';
    return encodeURIComponent(
      `Hello Manmaya's Cake Delights,\nI have submitted an enquiry on your website!\n\nReference: ${submittedEnquiry.referenceCode}\nName: ${submittedEnquiry.name}\nCake: ${submittedEnquiry.cakeName}\nOccasion: ${submittedEnquiry.occasion}\nDate: ${submittedEnquiry.preferredDate}\nDietary: ${submittedEnquiry.dietaryPreference}\nWeight: ${submittedEnquiry.weight || '1 kg'}\nNotes: ${submittedEnquiry.notes || 'None'}\n\nPlease confirm availability and quotation. Thank you!`
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#2C1D17]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl my-6 bg-[#FFF9F2] rounded-3xl border border-[#F0E5D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFF2E2] via-[#FBE6EC] to-[#FFF2E2] p-5 sm:p-6 border-b border-[#F0E5D8] relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#382722] hover:text-[#C9365B] shadow-xs transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9365B] mb-1">
            <Sparkles className="w-4 h-4 text-[#C9365B]" />
            <span>Manmaya’s Cake Delights • Kavisuryanagar</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#382722]">
            {submittedEnquiry ? 'Enquiry Received!' : 'Request a Custom Cake'}
          </h2>

          <p className="text-xs sm:text-sm text-[#664E46] mt-1">
            {submittedEnquiry
              ? 'We have recorded your cake request. Here are your details:'
              : 'Share your vision with our bakers. We will confirm availability & quotation promptly.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {submittedEnquiry ? (
            /* Success confirmation screen */
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#EFF7EA] border border-[#B8D4A5] flex items-center justify-center text-[#55853B]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A7269]">
                  Your Unique Enquiry Reference
                </span>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#C9365B] bg-white px-4 py-2 rounded-2xl border border-[#F5A5B8] shadow-xs">
                    {submittedEnquiry.referenceCode}
                  </span>
                  <button
                    type="button"
                    onClick={copyRefCode}
                    className="p-2.5 rounded-2xl bg-white border border-[#F0E5D8] hover:border-[#C9365B] text-[#382722] hover:text-[#C9365B] transition-colors"
                    title="Copy Reference Code"
                  >
                    {copied ? <Check className="w-5 h-5 text-[#55853B]" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F0E5D8] text-left text-xs sm:text-sm space-y-2">
                <div className="flex justify-between py-1 border-b border-[#FAF5EF]">
                  <span className="text-[#8A7269]">Name:</span>
                  <span className="font-bold text-[#382722]">{submittedEnquiry.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF5EF]">
                  <span className="text-[#8A7269]">Cake Design:</span>
                  <span className="font-bold text-[#382722]">{submittedEnquiry.cakeName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF5EF]">
                  <span className="text-[#8A7269]">Occasion & Date:</span>
                  <span className="font-bold text-[#382722]">
                    {submittedEnquiry.occasion} • {submittedEnquiry.preferredDate}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8A7269]">Dietary Preference:</span>
                  <span className="font-bold text-[#55853B] flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" />
                    {submittedEnquiry.dietaryPreference === 'pure_veg' 
                      ? '100% Pure Veg Guaranteed' 
                      : submittedEnquiry.dietaryPreference === 'eggless' 
                      ? 'Eggless Option' 
                      : 'Regular'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF2E2] border border-[#FFE7A3] text-xs text-[#664E46] text-left">
                <strong>Next Step:</strong> Our baker will review your design requirements and reach out via phone/WhatsApp to confirm available time slots and provide the exact quotation.
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${INITIAL_SITE_SETTINGS.whatsapp}?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send to WhatsApp Now
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-2xl bg-white border border-[#F0E5D8] hover:bg-[#FAF5EF] text-[#382722] font-bold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Selected Cake Notice */}
              <div className="p-3 bg-white rounded-2xl border border-[#F0E5D8] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A7269]">
                    Selected Cake Design
                  </span>
                  <div className="font-serif text-base font-bold text-[#C9365B]">
                    {cakeName}
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFF2E2] text-[#382722] border border-[#FFE7A3]">
                  Custom Order
                </span>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">
                    Your Full Name <span className="text-[#C9365B]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Swastik Jena"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8] ${
                      errors.name ? 'border-red-500 bg-red-50/30' : 'border-[#F0E5D8]'
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
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8] ${
                      errors.phone ? 'border-red-500 bg-red-50/30' : 'border-[#F0E5D8]'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Occasion & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">
                    Occasion <span className="text-[#C9365B]">*</span>
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                  >
                    <option value="Birthday">Birthday Celebration</option>
                    <option value="Wedding">Wedding Tier</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Kids Theme">Kids Theme & 3D</option>
                    <option value="Baby Shower">Baby Shower / Welcoming</option>
                    <option value="Festive / Special">Festive / Special Occasion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">
                    Preferred Date <span className="text-[#C9365B]">*</span>
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8] ${
                      errors.preferredDate ? 'border-red-500' : 'border-[#F0E5D8]'
                    }`}
                  />
                  {errors.preferredDate && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.preferredDate}</p>
                  )}
                </div>
              </div>

              {/* Weight & Dietary Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">
                    Cake Weight / Servings
                  </label>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
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
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setDietary('eggless');
                      }}
                      className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                        dietary === 'eggless'
                          ? 'bg-[#EFF7EA] border-[#55853B] text-[#55853B]'
                          : 'bg-white border-[#F0E5D8] text-[#5A433B]'
                      }`}
                    >
                      <Leaf className="w-3 h-3" />
                      Eggless
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setDietary('pure_veg');
                      }}
                      className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                        dietary === 'pure_veg'
                          ? 'bg-[#EFF7EA] border-[#55853B] text-[#55853B]'
                          : 'bg-white border-[#F0E5D8] text-[#5A433B]'
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
                      className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all ${
                        dietary === 'regular'
                          ? 'bg-[#FFF2E2] border-[#C9365B] text-[#C9365B]'
                          : 'bg-white border-[#F0E5D8] text-[#5A433B]'
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
                  Message on Cake (Optional)
                </label>
                <input
                  type="text"
                  value={messageOnCake}
                  onChange={(e) => setMessageOnCake(e.target.value)}
                  placeholder="e.g. Happy Birthday Riya (Edible Piping)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                />
              </div>

              {/* Special Notes & Requests */}
              <div>
                <label className="block text-xs font-bold text-[#382722] mb-1">
                  Design Details & Custom Wishes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us color preferences, topper ideas, pickup timing, etc."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#F0E5D8] text-sm text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                />
              </div>

              {/* Privacy acknowledgement */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-[#F0E5D8] text-[#C9365B] focus:ring-[#F5A5B8]"
                  />
                  <span className="text-xs text-[#664E46] leading-tight">
                    I understand this enquiry does not commit payment right now. The bakery team in Kavisuryanagar will contact me directly to confirm availability, final decoration, and quotation.
                  </span>
                </label>
                {errors.privacy && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.privacy}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-sm shadow-md shadow-[#C9365B]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Submit Custom Cake Enquiry</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
