import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileStickyBar } from './components/common/MobileStickyBar';
import { QuickEnquiryModal } from './components/common/QuickEnquiryModal';

// Route-level code-splitting for fast initial page load
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CakesPage = lazy(() => import('./pages/CakesPage').then(m => ({ default: m.CakesPage })));
const CakeDetailPage = lazy(() => import('./pages/CakeDetailPage').then(m => ({ default: m.CakeDetailPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage').then(m => ({ default: m.ReviewsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));

// Scroll to top automatically on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Elegant patisserie page loading placeholder
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FFF9F2]">
      <div className="w-12 h-12 rounded-2xl bg-[#FBE6EC] border border-[#F5A5B8] flex items-center justify-center text-[#C9365B] animate-pulse mb-3 shadow-xs">
        <span className="font-serif text-xl font-bold">M</span>
      </div>
      <div className="font-serif text-sm font-bold text-[#382722]">
        Manmaya’s CAKE DELIGHTS
      </div>
      <div className="text-[11px] text-[#8A7269] mt-0.5">
        Preparing fresh artisanal delights...
      </div>
    </div>
  );
}

export function App() {
  const [isMobileEnquiryOpen, setIsMobileEnquiryOpen] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FFF9F2] text-[#382722]">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Pages with Suspense */}
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cakes" element={<CakesPage />} />
              <Route path="/cakes/:slug" element={<CakeDetailPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Mobile Sticky Action Bar */}
        <MobileStickyBar onOpenQuickEnquiry={() => setIsMobileEnquiryOpen(true)} />

        {/* Mobile Quick Enquiry Drawer/Modal */}
        <QuickEnquiryModal
          isOpen={isMobileEnquiryOpen}
          onClose={() => setIsMobileEnquiryOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
