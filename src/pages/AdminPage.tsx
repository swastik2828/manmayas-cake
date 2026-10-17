import React, { useState, useEffect } from 'react';
import { 
  getStoredEnquiries, 
  updateEnquiryStatus, 
  deleteEnquiry,
  clearAllEnquiries,
  seedSampleEnquiries,
  getStoredSettings, 
  saveStoredSettings,
  getStoredCakes,
  addCake,
  updateCake,
  deleteCake,
  resetCakesToDefault,
  subscribeToStoreEvents
} from '../data/store';
import { Enquiry, SiteSettings, Cake, EnquiryStatus } from '../types';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Calendar, 
  MessageCircle, 
  Edit3, 
  Download, 
  Cake as CakeIcon, 
  Bell, 
  Filter, 
  Lock,
  LogOut,
  Save,
  Check,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  Eye,
  AlertCircle,
  Sparkles,
  Layers,
  ChefHat
} from 'lucide-react';
import { playChimeSound, playPopSound } from '../utils/soundEffects';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mcd_admin_auth') === 'true';
  });
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab: 'enquiries' | 'cakes' | 'settings'
  const [activeTab, setActiveTab] = useState<'enquiries' | 'cakes' | 'settings'>('enquiries');

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => getStoredEnquiries());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [viewImageModal, setViewImageModal] = useState<string | null>(null);

  // Cakes state
  const [cakes, setCakes] = useState<Cake[]>(() => getStoredCakes());
  const [isAddingCake, setIsAddingCake] = useState(false);
  const [newCakeName, setNewCakeName] = useState('');
  const [newCakeCategory, setNewCakeCategory] = useState<'birthday' | 'feather-wings' | 'wedding' | 'celebration' | 'custom-art' | 'pure-veg'>('birthday');
  const [newCakePrice, setNewCakePrice] = useState('₹750 (1 kg)');
  const [newCakeDesc, setNewCakeDesc] = useState('');
  const [newCakeImg, setNewCakeImg] = useState('');
  const [newCakeFlavors, setNewCakeFlavors] = useState('Vanilla, Chocolate Truffle');
  const [newCakeEggless, setNewCakeEggless] = useState(true);

  // Settings state
  const [settings, setSettings] = useState<SiteSettings>(() => getStoredSettings());
  const [announcementText, setAnnouncementText] = useState(settings.announcement.text);
  const [announcementBadge, setAnnouncementBadge] = useState(settings.announcement.badge);
  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcement.enabled);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Real-time reactive synchronization
  useEffect(() => {
    const unsubscribe = subscribeToStoreEvents((action) => {
      if (action === 'enquiries_updated') {
        setEnquiries(getStoredEnquiries());
      } else if (action === 'cakes_updated') {
        setCakes(getStoredCakes());
      } else if (action === 'settings_updated') {
        setSettings(getStoredSettings());
      }
    });
    return unsubscribe;
  }, []);

  // Update selected enquiry if enquiries list changes
  useEffect(() => {
    if (selectedEnquiry) {
      const refreshed = enquiries.find(e => e.id === selectedEnquiry.id);
      if (refreshed) {
        setSelectedEnquiry(refreshed);
      }
    }
  }, [enquiries]);

  // Baker Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2455' || pin === 'admin' || pin === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('mcd_admin_auth', 'true');
      setPinError('');
      playChimeSound();
    } else {
      setPinError('Incorrect PIN. (Tip: use 2455 or admin)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mcd_admin_auth');
  };

  // Enquiry Actions
  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    playPopSound();
    const updated = await updateEnquiryStatus(id, newStatus);
    if (updated) {
      setEnquiries(getStoredEnquiries());
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(updated);
      }
    }
  };

  const handleSaveNotes = async (id: string) => {
    playPopSound();
    const updated = await updateEnquiryStatus(id, selectedEnquiry?.status || 'NEW', adminNoteInput);
    if (updated) {
      setEnquiries(getStoredEnquiries());
      setSelectedEnquiry(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry record?')) {
      await deleteEnquiry(id);
      setEnquiries(getStoredEnquiries());
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      playPopSound();
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all enquiries? This will empty the inbox.')) {
      await clearAllEnquiries();
      setEnquiries([]);
      setSelectedEnquiry(null);
      playPopSound();
    }
  };

  const handleSeedSamples = async () => {
    const samples = await seedSampleEnquiries();
    setEnquiries(samples);
    setSelectedEnquiry(samples[0]);
    playChimeSound();
  };

  // Cake CRUD Actions
  const handleCreateCake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCakeName.trim()) return;

    await addCake({
      name: newCakeName.trim(),
      category: newCakeCategory.replace('-', ' ').toUpperCase(),
      categoryId: newCakeCategory,
      description: newCakeDesc.trim() || 'Freshly baked custom artisan cake made in Kavisuryanagar.',
      priceDisplay: newCakePrice.trim() || 'Ask for Price',
      imageUrl: newCakeImg.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
      galleryImages: [],
      featured: true,
      flavors: newCakeFlavors.split(',').map(f => f.trim()).filter(Boolean),
      isEgglessAvailable: newCakeEggless,
      isPureVegSpecial: newCakeCategory === 'pure-veg',
      spongeOptions: ['Vanilla', 'Chocolate'],
      weightOptions: ['1.0 kg', '2.0 kg'],
      leadTime: 'Order 24h advance',
      rating: 5.0,
      reviewCount: 1,
      tags: ['New Creation', newCakeCategory],
    });

    setCakes(getStoredCakes());
    setIsAddingCake(false);
    setNewCakeName('');
    setNewCakeDesc('');
    setNewCakeImg('');
    playChimeSound();
  };

  const handleDeleteCake = async (id: string) => {
    if (window.confirm('Delete this cake design from the catalogue?')) {
      await deleteCake(id);
      setCakes(getStoredCakes());
      playPopSound();
    }
  };

  const handleResetCakes = async () => {
    if (window.confirm('Reset cake catalogue to initial artisanal menu?')) {
      const def = await resetCakesToDefault();
      setCakes(def);
      playChimeSound();
    }
  };

  // Settings Actions
  const handleSaveAnnouncement = async () => {
    const updated = {
      ...settings,
      announcement: {
        text: announcementText,
        badge: announcementBadge,
        enabled: announcementEnabled,
      }
    };
    await saveStoredSettings(updated);
    setSettings(updated);
    setSavedSuccess(true);
    playPopSound();
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Export to CSV & JSON
  const exportEnquiriesCSV = () => {
    const headers = ['Reference', 'Date', 'Customer', 'Phone', 'Occasion', 'Delivery Date', 'Time', 'Cake Design', 'Flavor', 'Weight', 'Dietary', 'Message', 'Status', 'Notes'];
    const rows = enquiries.map(e => [
      e.referenceCode,
      new Date(e.createdAt).toLocaleDateString(),
      `"${e.name}"`,
      `"${e.phone}"`,
      `"${e.occasion}"`,
      e.preferredDate,
      e.preferredTime || '',
      `"${e.cakeName || ''}"`,
      `"${e.flavor || ''}"`,
      `"${e.weight || ''}"`,
      e.dietaryPreference,
      `"${e.messageOnCake || ''}"`,
      e.status,
      `"${e.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `manmaya_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportEnquiriesJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(enquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `manmaya_enquiries_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter & Search Enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    if (filterStatus !== 'ALL' && e.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = e.name.toLowerCase().includes(q);
      const matchRef = e.referenceCode.toLowerCase().includes(q);
      const matchPhone = e.phone.includes(q);
      const matchCake = (e.cakeName || '').toLowerCase().includes(q);
      const matchOccasion = e.occasion.toLowerCase().includes(q);
      if (!matchName && !matchRef && !matchPhone && !matchCake && !matchOccasion) return false;
    }
    return true;
  });

  const statusCounts = {
    ALL: enquiries.length,
    NEW: enquiries.filter(e => e.status === 'NEW').length,
    CONTACTED: enquiries.filter(e => e.status === 'CONTACTED').length,
    CONFIRMED: enquiries.filter(e => e.status === 'CONFIRMED').length,
    IN_BAKING: enquiries.filter(e => e.status === 'IN_BAKING').length,
    COMPLETED: enquiries.filter(e => e.status === 'COMPLETED').length,
    ARCHIVED: enquiries.filter(e => e.status === 'ARCHIVED').length,
  };

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FFF9F2]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#F0E5D8] p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF2E2] text-[#C9365B] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-[#382722]">
              Baker's Management Portal
            </h2>
            <p className="text-xs text-[#8A7269] mt-1">
              Authorized bakery staff only. Enter your PIN to manage cake orders & catalogue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter Baker Access PIN"
              className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F2] border border-[#F0E5D8] text-center font-mono text-lg tracking-widest text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
              autoFocus
            />

            {pinError && <p className="text-xs text-red-600">{pinError}</p>}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-sm shadow-md transition-all"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="text-[11px] text-[#8A7269] pt-2">
            Baker PIN: <code className="bg-[#FFF2E2] px-1.5 py-0.5 rounded text-[#382722] font-mono">2455</code> or <code className="bg-[#FFF2E2] px-1.5 py-0.5 rounded text-[#382722] font-mono">admin</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F0E5D8] shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9365B]">
              <ChefHat className="w-4 h-4" />
              <span>Manmaya’s CAKE DELIGHTS • Baker Command Center</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#382722]">
              Bakery Operations & Order Manager
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportEnquiriesCSV}
              className="px-3.5 py-2 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] hover:border-[#F5A5B8] text-xs font-bold text-[#382722] flex items-center gap-1.5 shadow-xs"
              title="Download CSV for Excel / Kitchen Prep Schedule"
            >
              <Download className="w-3.5 h-3.5 text-[#55853B]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={exportEnquiriesJSON}
              className="px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] hover:border-[#F5A5B8] text-xs font-bold text-[#382722] flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C9365B]" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#F0E5D8] pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-2.5 rounded-2xl font-serif text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'bg-[#C9365B] text-white shadow-md'
                : 'bg-white text-[#5A433B] hover:bg-[#FAF5EF]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Enquiries Queue ({enquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cakes')}
            className={`px-5 py-2.5 rounded-2xl font-serif text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'cakes'
                ? 'bg-[#C9365B] text-white shadow-md'
                : 'bg-white text-[#5A433B] hover:bg-[#FAF5EF]'
            }`}
          >
            <CakeIcon className="w-4 h-4" />
            <span>Catalogue Manager ({cakes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-2xl font-serif text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#C9365B] text-white shadow-md'
                : 'bg-white text-[#5A433B] hover:bg-[#FAF5EF]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Announcement & Site Settings</span>
          </button>
        </div>

        {/* TAB 1: ENQUIRIES WORKFLOW */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-[#F0E5D8] shadow-xs">
                <span className="text-[10px] font-bold text-[#8A7269] uppercase tracking-wider">Total Enquiries</span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#382722] mt-0.5">
                  {enquiries.length}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F0E5D8] shadow-xs">
                <span className="text-[10px] font-bold text-[#C9365B] uppercase tracking-wider">New Incoming</span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#C9365B] mt-0.5">
                  {statusCounts.NEW}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F0E5D8] shadow-xs">
                <span className="text-[10px] font-bold text-[#E09F1F] uppercase tracking-wider">Contacted / Quoted</span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#E09F1F] mt-0.5">
                  {statusCounts.CONTACTED}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F0E5D8] shadow-xs">
                <span className="text-[10px] font-bold text-[#55853B] uppercase tracking-wider">Confirmed Orders</span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#55853B] mt-0.5">
                  {statusCounts.CONFIRMED}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F0E5D8] shadow-xs">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">In Baking Oven</span>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-purple-700 mt-0.5">
                  {statusCounts.IN_BAKING}
                </div>
              </div>
            </div>

            {/* Test Samples & Clean State Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FFF2E2] p-3 rounded-2xl border border-[#FFE7A3] text-xs">
              <span className="text-[#664E46] font-medium">
                Production mode: Enquiries submitted via website contact form or customizer appear here in real time.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSeedSamples}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#F0E5D8] text-[11px] font-bold text-[#382722] hover:bg-[#FAF5EF]"
                >
                  Seed Demo Orders
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-[11px] font-bold hover:bg-red-200"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Enquiries List Column */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Search & Status Filter */}
                <div className="bg-white p-4 rounded-2xl border border-[#F0E5D8] shadow-xs space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8A7269] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, phone, code, occasion..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                    />
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                    {(['ALL', 'NEW', 'CONTACTED', 'CONFIRMED', 'IN_BAKING', 'COMPLETED', 'ARCHIVED'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setFilterStatus(st);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                          filterStatus === st
                            ? 'bg-[#C9365B] text-white shadow-xs'
                            : 'bg-[#FFF9F2] text-[#5A433B] hover:bg-[#FAF5EF]'
                        }`}
                      >
                        {st} ({statusCounts[st as keyof typeof statusCounts] || 0})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Empty State */}
                {filteredEnquiries.length === 0 && (
                  <div className="bg-white rounded-2xl border border-[#F0E5D8] p-10 text-center space-y-3">
                    <Clock className="w-10 h-10 text-[#8A7269] mx-auto opacity-40" />
                    <h3 className="font-serif text-lg font-bold text-[#382722]">
                      No enquiries found
                    </h3>
                    <p className="text-xs text-[#8A7269] max-w-sm mx-auto">
                      {searchQuery ? 'No records match your search filter.' : 'Your customer enquiry inbox is currently clean. New customer submissions will appear here instantly.'}
                    </p>
                  </div>
                )}

                {/* Enquiries Cards */}
                <div className="space-y-3">
                  {filteredEnquiries.map((enq) => {
                    const isSelected = selectedEnquiry?.id === enq.id;
                    return (
                      <div
                        key={enq.id}
                        onClick={() => {
                          playPopSound();
                          setSelectedEnquiry(enq);
                          setAdminNoteInput(enq.adminNotes || '');
                        }}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-white border-[#C9365B] shadow-md ring-2 ring-[#F5A5B8]/30'
                            : 'bg-white border-[#F0E5D8] hover:border-[#F5A5B8]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-xs font-extrabold text-[#C9365B]">
                            {enq.referenceCode}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            enq.status === 'NEW'
                              ? 'bg-[#FBE6EC] text-[#C9365B] animate-pulse'
                              : enq.status === 'CONTACTED'
                              ? 'bg-[#FFE7A3] text-[#382722]'
                              : enq.status === 'CONFIRMED'
                              ? 'bg-[#EFF7EA] text-[#55853B]'
                              : enq.status === 'IN_BAKING'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {enq.status}
                          </span>
                        </div>

                        <div className="font-serif text-base font-bold text-[#382722]">
                          {enq.name}
                        </div>

                        <div className="text-xs text-[#5A433B] font-medium mt-0.5">
                          {enq.cakeName} • {enq.occasion} (Delivery: {enq.preferredDate})
                        </div>

                        <div className="mt-2 pt-2 border-t border-[#FAF5EF] flex items-center justify-between text-[11px] text-[#8A7269]">
                          <span>Phone: {enq.phone}</span>
                          <span>{new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Right Column: Detailed Inspection & Actions */}
              <div className="lg:col-span-5 space-y-6">
                {selectedEnquiry ? (
                  <div className="bg-white rounded-3xl border border-[#F0E5D8] p-6 shadow-sm space-y-5">
                    
                    {/* Header & Quick Call/WhatsApp */}
                    <div className="flex items-center justify-between border-b border-[#F0E5D8] pb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8A7269]">Selected Order</span>
                        <div className="font-mono text-xl font-extrabold text-[#C9365B]">
                          {selectedEnquiry.referenceCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${selectedEnquiry.phone}`}
                          className="p-2.5 rounded-xl bg-[#FFF2E2] text-[#C9365B] hover:bg-[#C9365B] hover:text-white transition-colors"
                          title="Call Customer Directly"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/91${selectedEnquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name}, this is Manmaya's Cake Delights regarding your enquiry #${selectedEnquiry.referenceCode} for ${selectedEnquiry.cakeName}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                          className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Status Workflow Selector */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#382722] uppercase tracking-wider mb-2">
                        Advance Order Status:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['NEW', 'CONTACTED', 'CONFIRMED', 'IN_BAKING', 'COMPLETED', 'ARCHIVED'] as EnquiryStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border ${
                              selectedEnquiry.status === st
                                ? 'bg-[#C9365B] text-white border-[#C9365B]'
                                : 'bg-[#FFF9F2] text-[#5A433B] border-[#F0E5D8] hover:border-[#F5A5B8]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customer Specifications Details */}
                    <div className="bg-[#FFF9F2] p-4 rounded-2xl border border-[#F0E5D8] text-xs space-y-2">
                      <div><strong>Customer:</strong> {selectedEnquiry.name}</div>
                      <div><strong>Phone:</strong> {selectedEnquiry.phone}</div>
                      {selectedEnquiry.email && <div><strong>Email:</strong> {selectedEnquiry.email}</div>}
                      <div><strong>Cake Theme:</strong> {selectedEnquiry.cakeName}</div>
                      <div><strong>Occasion:</strong> {selectedEnquiry.occasion}</div>
                      <div><strong>Date & Time:</strong> {selectedEnquiry.preferredDate} ({selectedEnquiry.preferredTime || 'Not set'})</div>
                      <div><strong>Flavor & Weight:</strong> {selectedEnquiry.flavor} ({selectedEnquiry.weight})</div>
                      <div><strong>Dietary:</strong> {selectedEnquiry.dietaryPreference}</div>
                      {selectedEnquiry.messageOnCake && (
                        <div><strong>Piped Message:</strong> “{selectedEnquiry.messageOnCake}”</div>
                      )}
                      {selectedEnquiry.notes && (
                        <div><strong>Customer Notes:</strong> {selectedEnquiry.notes}</div>
                      )}
                    </div>

                    {/* Uploaded Customer Reference Photo */}
                    {selectedEnquiry.referenceImageUrl && (
                      <div>
                        <label className="block text-[11px] font-bold text-[#382722] uppercase tracking-wider mb-1">
                          Customer Uploaded Reference Photo:
                        </label>
                        <div 
                          onClick={() => setViewImageModal(selectedEnquiry.referenceImageUrl || null)}
                          className="relative h-28 w-full rounded-2xl overflow-hidden border border-[#F0E5D8] cursor-pointer group"
                        >
                          <img 
                            src={selectedEnquiry.referenceImageUrl} 
                            alt="Reference" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold gap-1">
                            <Eye className="w-4 h-4" />
                            <span>Click to Zoom</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Internal Baker Notes */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-[#382722] uppercase tracking-wider">
                        Internal Baker Notes (Customer Tracker Viewable):
                      </label>
                      <textarea
                        rows={2}
                        value={adminNoteInput}
                        onChange={(e) => setAdminNoteInput(e.target.value)}
                        placeholder="e.g. Spoke with customer; requested extra gold leaf on top tier."
                        className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722] focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveNotes(selectedEnquiry.id)}
                        className="w-full py-2 px-3 rounded-xl bg-[#382722] hover:bg-[#5A433B] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Baker Notes</span>
                      </button>
                      {savedSuccess && (
                        <p className="text-[11px] text-[#55853B] font-bold text-center">
                          Notes updated successfully!
                        </p>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#F0E5D8] p-8 text-center text-[#8A7269] text-xs">
                    Select an enquiry from the list to view specifications, trigger calls, or update kitchen status.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CAKE CATALOGUE CRUD */}
        {activeTab === 'cakes' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F0E5D8]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#382722]">
                  Live Cake Catalogue Manager
                </h2>
                <p className="text-xs text-[#8A7269]">
                  Add new cake creations, update pricing displays, or remove retired items. Changes update the public website instantly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCake(!isAddingCake)}
                  className="px-4 py-2.5 rounded-xl bg-[#C9365B] hover:bg-[#A92244] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingCake ? 'Cancel' : 'Add New Cake'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCakes}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs font-bold text-[#5A433B] hover:bg-[#FAF5EF]"
                  title="Reset to default bakery catalogue"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Add Cake Form Modal / Drawer */}
            {isAddingCake && (
              <form onSubmit={handleCreateCake} className="bg-white rounded-3xl border border-[#F0E5D8] p-6 shadow-md space-y-4 animate-in fade-in duration-200">
                <h3 className="font-serif text-lg font-bold text-[#382722]">
                  Create New Cake Design
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">Cake Name *</label>
                    <input
                      type="text"
                      value={newCakeName}
                      onChange={(e) => setNewCakeName(e.target.value)}
                      placeholder="e.g. Royal Pistachio Velvet"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">Category *</label>
                    <select
                      value={newCakeCategory}
                      onChange={(e) => setNewCakeCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722]"
                    >
                      <option value="birthday">Birthday Cakes</option>
                      <option value="feather-wings">Feather Wings Signature</option>
                      <option value="wedding">Wedding & Multi-Tier</option>
                      <option value="celebration">Celebrations & Anniversaries</option>
                      <option value="custom-art">Custom 3D Art</option>
                      <option value="pure-veg">100% Pure Veg Special</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">Price Display *</label>
                    <input
                      type="text"
                      value={newCakePrice}
                      onChange={(e) => setNewCakePrice(e.target.value)}
                      placeholder="e.g. ₹850 (1.0 kg)"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">Image URL (Unsplash or direct URL) *</label>
                    <input
                      type="url"
                      value={newCakeImg}
                      onChange={(e) => setNewCakeImg(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382722] mb-1">Flavors (comma separated)</label>
                    <input
                      type="text"
                      value={newCakeFlavors}
                      onChange={(e) => setNewCakeFlavors(e.target.value)}
                      placeholder="Madagascar Vanilla, Roasted Pistachio"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#382722] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newCakeDesc}
                    onChange={(e) => setNewCakeDesc(e.target.value)}
                    placeholder="Artisanal description of the sponge, frosting, and handcrafted toppers..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCake(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-[#F0E5D8] text-xs font-bold text-[#5A433B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#C9365B] text-white text-xs font-bold shadow-xs hover:bg-[#A92244]"
                  >
                    Save Cake to Menu
                  </button>
                </div>
              </form>
            )}

            {/* Cake Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cakes.map((cake) => (
                <div key={cake.id} className="bg-white p-4 rounded-2xl border border-[#F0E5D8] shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="flex gap-3 items-center">
                    <img src={cake.imageUrl} alt={cake.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#F0E5D8]" />
                    <div className="overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-[#C9365B] block truncate">
                        {cake.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-[#382722] truncate">
                        {cake.name}
                      </h4>
                      <div className="text-xs font-extrabold text-[#C9365B]">
                        {cake.priceDisplay}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#664E46] line-clamp-2">
                    {cake.description}
                  </p>

                  <div className="pt-2 border-t border-[#FAF5EF] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={async () => {
                        await updateCake(cake.id, { featured: !cake.featured });
                        setCakes(getStoredCakes());
                        playPopSound();
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        cake.featured 
                          ? 'bg-[#FFE7A3] border-[#FCD872] text-[#382722]' 
                          : 'bg-white border-[#F0E5D8] text-[#8A7269]'
                      }`}
                    >
                      {cake.featured ? 'Featured ★' : 'Set Featured'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCake(cake.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      title="Delete Cake"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: SETTINGS & ANNOUNCEMENTS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-[#F0E5D8] shadow-sm space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#382722]">
                Announcement Banner Controller
              </h2>
              <p className="text-xs text-[#8A7269] mt-0.5">
                Displays a prominent festive or ordering banner across the top of all pages.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="rounded border-[#F0E5D8] text-[#C9365B] focus:ring-[#F5A5B8]"
                />
                <span className="text-xs font-bold text-[#382722]">
                  Enable Announcement Banner
                </span>
              </label>

              <div>
                <label className="block text-xs font-bold text-[#382722] mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={announcementBadge}
                  onChange={(e) => setAnnouncementBadge(e.target.value)}
                  placeholder="e.g. Booking Notice"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#382722] mb-1">
                  Announcement Message
                </label>
                <textarea
                  rows={2}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Taking custom celebration cake bookings 24–48 hours in advance for Kavisuryanagar."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-xs text-[#382722]"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveAnnouncement}
                className="py-3 px-6 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Banner Settings</span>
              </button>

              {savedSuccess && (
                <p className="text-xs text-[#55853B] font-bold">
                  Banner settings updated! Check the public header.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Reference Image Lightbox Modal */}
        {viewImageModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setViewImageModal(null)}
          >
            <div className="relative max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white p-2">
              <img src={viewImageModal} alt="Reference Full View" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
