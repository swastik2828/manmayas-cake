import { Cake, Enquiry, SiteSettings, Review, EnquiryStatus } from '../types';
import { INITIAL_CAKES } from './cakesData';
import { INITIAL_SITE_SETTINGS } from './siteSettings';
import { REVIEWS_DATA } from './reviewsData';
import { playChimeSound } from '../utils/soundEffects';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';

// In-memory reactive state holding live Firestore data
let cakesCache: Cake[] = [...INITIAL_CAKES];
let enquiriesCache: Enquiry[] = [];
let settingsCache: SiteSettings = { ...INITIAL_SITE_SETTINGS };
let reviewsCache: Review[] = [...REVIEWS_DATA];

// Cross-tab broadcast channel for instant multi-tab reactivity
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('mcd_firebase_store_channel');
  } catch {
    broadcastChannel = null;
  }
}

function notifyStoreChange(action: string, payload?: unknown) {
  if (typeof window === 'undefined') return;

  // Local window event
  window.dispatchEvent(new CustomEvent('mcd-store-updated', { detail: { action, payload } }));

  // Cross-tab broadcast
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ action, payload, timestamp: Date.now() });
    } catch {
      // ignore
    }
  }
}

export function subscribeToStoreEvents(callback: (action: string, payload?: unknown) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const ce = e as CustomEvent;
    callback(ce.detail?.action || 'update', ce.detail?.payload);
  };

  const handleBroadcast = (e: MessageEvent) => {
    callback(e.data?.action || 'update', e.data?.payload);
  };

  window.addEventListener('mcd-store-updated', handleCustomEvent);
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    window.removeEventListener('mcd-store-updated', handleCustomEvent);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}

/**
 * Deeply sanitizes data objects before persisting to Firestore,
 * ensuring no 'undefined' fields violate Firestore write constraints.
 */
function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        clean[key] = cleanFirestoreData(val);
      } else {
        clean[key] = val;
      }
    }
  }
  return clean as T;
}

// -------------------------------------------------------------
// FIRESTORE REAL-TIME SYNCHRONIZATION INITIALIZATION
// -------------------------------------------------------------

let isInitialized = false;

function initializeFirestoreListeners() {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  try {
    // 1. Live Cakes Synchronization
    const cakesCol = collection(db, 'cakes');
    onSnapshot(cakesCol, async (snapshot) => {
      if (snapshot.empty) {
        // Auto-seed Firebase Firestore with initial artisanal catalogue if empty
        console.log('[Firebase] Cakes collection empty. Seeding initial cakes catalogue...');
        for (const cake of INITIAL_CAKES) {
          await setDoc(doc(db, 'cakes', cake.id), cleanFirestoreData(cake));
        }
      } else {
        const loadedCakes = snapshot.docs.map((d) => d.data() as Cake);
        cakesCache = loadedCakes;
        notifyStoreChange('cakes_updated', cakesCache);
      }
    }, (error) => {
      console.warn('[Firebase] Error in cakes listener:', error);
    });

    // 2. Live Enquiries Synchronization (Ordered by createdAt desc)
    const enquiriesCol = collection(db, 'enquiries');
    onSnapshot(enquiriesCol, (snapshot) => {
      const loadedEnquiries = snapshot.docs.map((d) => d.data() as Enquiry);
      loadedEnquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      enquiriesCache = loadedEnquiries;
      notifyStoreChange('enquiries_updated', enquiriesCache);
    }, (error) => {
      console.warn('[Firebase] Error in enquiries listener:', error);
    });

    // 3. Live Site Settings Synchronization
    const settingsDocRef = doc(db, 'siteSettings', 'global');
    onSnapshot(settingsDocRef, async (docSnap) => {
      if (!docSnap.exists()) {
        console.log('[Firebase] Site settings document not found. Seeding initial settings...');
        await setDoc(settingsDocRef, cleanFirestoreData(INITIAL_SITE_SETTINGS));
      } else {
        settingsCache = { ...INITIAL_SITE_SETTINGS, ...(docSnap.data() as SiteSettings) };
        notifyStoreChange('settings_updated', settingsCache);
      }
    }, (error) => {
      console.warn('[Firebase] Error in settings listener:', error);
    });

    // 4. Live Reviews Synchronization
    const reviewsCol = collection(db, 'reviews');
    onSnapshot(reviewsCol, async (snapshot) => {
      if (snapshot.empty) {
        console.log('[Firebase] Reviews collection empty. Seeding verified reviews...');
        for (const rev of REVIEWS_DATA) {
          await setDoc(doc(db, 'reviews', rev.id), cleanFirestoreData(rev));
        }
      } else {
        const loadedReviews = snapshot.docs.map((d) => d.data() as Review);
        reviewsCache = loadedReviews;
        notifyStoreChange('reviews_updated', reviewsCache);
      }
    }, (error) => {
      console.warn('[Firebase] Error in reviews listener:', error);
    });

  } catch (err) {
    console.error('[Firebase] Failed to initialize Firestore real-time listeners:', err);
  }
}

// Auto-run Firestore listener setup
initializeFirestoreListeners();

// -------------------------------------------------------------
// CAKES CATALOGUE MANAGEMENT (CRUD via Firebase Firestore)
// -------------------------------------------------------------

export function getStoredCakes(): Cake[] {
  return cakesCache;
}

export async function fetchCakes(): Promise<Cake[]> {
  try {
    const snap = await getDocs(collection(db, 'cakes'));
    if (!snap.empty) {
      cakesCache = snap.docs.map((d) => d.data() as Cake);
    }
  } catch (err) {
    console.error('[Firebase] Error fetching cakes:', err);
  }
  return cakesCache;
}

export async function saveStoredCakes(cakes: Cake[]): Promise<void> {
  cakesCache = cakes;
  notifyStoreChange('cakes_updated', cakes);
  try {
    const batch = writeBatch(db);
    for (const cake of cakes) {
      batch.set(doc(db, 'cakes', cake.id), cleanFirestoreData(cake));
    }
    await batch.commit();
  } catch (err) {
    console.error('[Firebase] Failed to save cakes batch:', err);
  }
}

export async function addCake(cake: Omit<Cake, 'id' | 'slug'>): Promise<Cake> {
  const slug = cake.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `cake-${Date.now()}`;
  const newCake: Cake = {
    ...cake,
    id,
    slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
  };

  // Optimistic cache update
  cakesCache = [newCake, ...cakesCache.filter(c => c.id !== id)];
  notifyStoreChange('cakes_updated', cakesCache);

  // Firestore write
  try {
    await setDoc(doc(db, 'cakes', id), cleanFirestoreData(newCake));
  } catch (err) {
    console.error('[Firebase] Failed to add cake to Firestore:', err);
  }

  return newCake;
}

export async function updateCake(id: string, updates: Partial<Cake>): Promise<Cake | undefined> {
  const idx = cakesCache.findIndex(c => c.id === id);
  if (idx === -1) return undefined;

  const updatedCake = { ...cakesCache[idx], ...updates };
  cakesCache[idx] = updatedCake;
  notifyStoreChange('cakes_updated', cakesCache);

  try {
    await setDoc(doc(db, 'cakes', id), cleanFirestoreData(updates), { merge: true });
  } catch (err) {
    console.error('[Firebase] Failed to update cake in Firestore:', err);
  }

  return updatedCake;
}

export async function deleteCake(id: string): Promise<boolean> {
  const prevCount = cakesCache.length;
  cakesCache = cakesCache.filter(c => c.id !== id);
  if (cakesCache.length === prevCount) return false;

  notifyStoreChange('cakes_updated', cakesCache);

  try {
    await deleteDoc(doc(db, 'cakes', id));
  } catch (err) {
    console.error('[Firebase] Failed to delete cake in Firestore:', err);
  }

  return true;
}

export async function resetCakesToDefault(): Promise<Cake[]> {
  cakesCache = [...INITIAL_CAKES];
  notifyStoreChange('cakes_updated', cakesCache);

  try {
    // Delete existing cakes and replace with INITIAL_CAKES
    const snap = await getDocs(collection(db, 'cakes'));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    for (const cake of INITIAL_CAKES) {
      batch.set(doc(db, 'cakes', cake.id), cleanFirestoreData(cake));
    }
    await batch.commit();
  } catch (err) {
    console.error('[Firebase] Failed to reset cakes in Firestore:', err);
  }

  return cakesCache;
}

// -------------------------------------------------------------
// ENQUIRIES / CUSTOM ORDERS MANAGEMENT (CRUD via Firebase Firestore)
// -------------------------------------------------------------

export function getStoredEnquiries(): Enquiry[] {
  return enquiriesCache;
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  try {
    const snap = await getDocs(collection(db, 'enquiries'));
    const loaded = snap.docs.map((d) => d.data() as Enquiry);
    loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    enquiriesCache = loaded;
  } catch (err) {
    console.error('[Firebase] Error fetching enquiries:', err);
  }
  return enquiriesCache;
}

export async function saveStoredEnquiries(enquiries: Enquiry[]): Promise<void> {
  enquiriesCache = enquiries;
  notifyStoreChange('enquiries_updated', enquiries);
  try {
    const batch = writeBatch(db);
    for (const enq of enquiries) {
      batch.set(doc(db, 'enquiries', enq.id), cleanFirestoreData(enq));
    }
    await batch.commit();
  } catch (err) {
    console.error('[Firebase] Failed to save enquiries batch:', err);
  }
}

/**
 * Creates an enquiry record in Firebase Firestore
 */
export async function createEnquiry(
  input: Omit<Enquiry, 'id' | 'referenceCode' | 'createdAt' | 'status'>
): Promise<Enquiry> {
  const codeSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceCode = `MCD-2026-${codeSuffix}`;
  const id = `enq-${Date.now()}-${codeSuffix}`;

  const newEnquiry: Enquiry = {
    ...input,
    id,
    referenceCode,
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  // Optimistically update cache and notify UI
  enquiriesCache = [newEnquiry, ...enquiriesCache];
  notifyStoreChange('enquiries_updated', enquiriesCache);

  playChimeSound();

  // Persist directly to Firebase Firestore
  try {
    await setDoc(doc(db, 'enquiries', id), cleanFirestoreData(newEnquiry));
  } catch (err) {
    console.error('[Firebase] Failed to save enquiry to Firestore:', err);
  }

  return newEnquiry;
}

export function findEnquiryByReference(refCode: string): Enquiry | undefined {
  const trimmed = refCode.trim().toUpperCase();
  return enquiriesCache.find(e => e.referenceCode.toUpperCase() === trimmed);
}

/**
 * Direct Firebase query to find an enquiry by reference code across devices
 */
export async function fetchEnquiryByReference(refCode: string): Promise<Enquiry | undefined> {
  const trimmed = refCode.trim().toUpperCase();
  const cached = enquiriesCache.find(e => e.referenceCode.toUpperCase() === trimmed);
  if (cached) return cached;

  try {
    const q = query(collection(db, 'enquiries'), where('referenceCode', '==', trimmed));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const enq = snap.docs[0].data() as Enquiry;
      // Add to cache if not present
      if (!enquiriesCache.some(e => e.id === enq.id)) {
        enquiriesCache = [enq, ...enquiriesCache];
      }
      return enq;
    }
  } catch (err) {
    console.error('[Firebase] Error querying enquiry by reference:', err);
  }

  return undefined;
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  adminNotes?: string
): Promise<Enquiry | undefined> {
  const index = enquiriesCache.findIndex(e => e.id === id);
  if (index === -1) return undefined;

  enquiriesCache[index] = {
    ...enquiriesCache[index],
    status,
    ...(adminNotes !== undefined ? { adminNotes } : {})
  };

  const updated = enquiriesCache[index];
  notifyStoreChange('enquiries_updated', enquiriesCache);

  try {
    const payload: Record<string, any> = { status };
    if (adminNotes !== undefined) {
      payload.adminNotes = adminNotes;
    }
    await updateDoc(doc(db, 'enquiries', id), cleanFirestoreData(payload));
  } catch (err) {
    console.error('[Firebase] Failed to update enquiry status in Firestore:', err);
  }

  return updated;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const prevCount = enquiriesCache.length;
  enquiriesCache = enquiriesCache.filter(e => e.id !== id);
  if (enquiriesCache.length === prevCount) return false;

  notifyStoreChange('enquiries_updated', enquiriesCache);

  try {
    await deleteDoc(doc(db, 'enquiries', id));
  } catch (err) {
    console.error('[Firebase] Failed to delete enquiry in Firestore:', err);
  }

  return true;
}

export async function clearAllEnquiries(): Promise<void> {
  enquiriesCache = [];
  notifyStoreChange('enquiries_updated', enquiriesCache);

  try {
    const snap = await getDocs(collection(db, 'enquiries'));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    console.error('[Firebase] Failed to clear enquiries in Firestore:', err);
  }
}

/**
 * Admin utility to load clean test samples directly to Firebase Firestore
 */
export async function seedSampleEnquiries(): Promise<Enquiry[]> {
  const sampleData: Enquiry[] = [
    {
      id: `enq-test-1`,
      referenceCode: 'MCD-2026-1011',
      name: 'Rohan Pattnaik',
      phone: '9861012345',
      email: 'rohan.p@gmail.com',
      occasion: 'Birthday',
      preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      preferredTime: '18:00',
      cakeName: 'Belgian Dark Truffle Tier',
      flavor: 'Belgian Dark Chocolate Ganache',
      weight: '1.5 kg (10–12 guests)',
      dietaryPreference: 'eggless',
      messageOnCake: 'Happy 1st Birthday Ayaan!',
      budgetRange: '₹800 - ₹1,200',
      notes: 'Please add gold shimmer and feather decor on top.',
      status: 'NEW',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: `enq-test-2`,
      referenceCode: 'MCD-2026-2022',
      name: 'Snigdha Mohanty',
      phone: '9437198765',
      occasion: 'Anniversary',
      preferredDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      cakeName: 'Rose Gold Floral Wedding Tier',
      flavor: 'Royal Red Velvet Cream Cheese',
      weight: '2.0 kg (15–18 guests)',
      dietaryPreference: 'pure_veg',
      messageOnCake: 'Happy 10th Anniversary',
      budgetRange: 'Above ₹1,200',
      notes: '100% pure vegetarian only please.',
      status: 'CONFIRMED',
      adminNotes: 'Advance confirmed via WhatsApp. Scheduled for 5 PM delivery.',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    }
  ];

  enquiriesCache = sampleData;
  notifyStoreChange('enquiries_updated', enquiriesCache);

  try {
    const batch = writeBatch(db);
    for (const enq of sampleData) {
      batch.set(doc(db, 'enquiries', enq.id), cleanFirestoreData(enq));
    }
    await batch.commit();
  } catch (err) {
    console.error('[Firebase] Failed to seed sample enquiries in Firestore:', err);
  }

  return sampleData;
}

// -------------------------------------------------------------
// SITE SETTINGS MANAGEMENT (CRUD via Firebase Firestore)
// -------------------------------------------------------------

export function getStoredSettings(): SiteSettings {
  return settingsCache;
}

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, 'siteSettings', 'global'));
    if (snap.exists()) {
      settingsCache = { ...INITIAL_SITE_SETTINGS, ...(snap.data() as SiteSettings) };
    }
  } catch (err) {
    console.error('[Firebase] Error fetching site settings:', err);
  }
  return settingsCache;
}

export async function saveStoredSettings(settings: SiteSettings): Promise<void> {
  settingsCache = settings;
  notifyStoreChange('settings_updated', settings);

  try {
    await setDoc(doc(db, 'siteSettings', 'global'), cleanFirestoreData(settings));
  } catch (err) {
    console.error('[Firebase] Failed to save site settings to Firestore:', err);
  }
}

// -------------------------------------------------------------
// REVIEWS / GUESTBOOK REVIEWS MANAGEMENT (CRUD via Firebase Firestore)
// -------------------------------------------------------------

export function getStoredReviews(): Review[] {
  return reviewsCache;
}

export async function fetchReviews(): Promise<Review[]> {
  try {
    const snap = await getDocs(collection(db, 'reviews'));
    if (!snap.empty) {
      reviewsCache = snap.docs.map((d) => d.data() as Review);
    }
  } catch (err) {
    console.error('[Firebase] Error fetching reviews:', err);
  }
  return reviewsCache;
}

export async function saveStoredReviews(reviews: Review[]): Promise<void> {
  reviewsCache = reviews;
  notifyStoreChange('reviews_updated', reviews);

  try {
    const batch = writeBatch(db);
    for (const rev of reviews) {
      batch.set(doc(db, 'reviews', rev.id), cleanFirestoreData(rev));
    }
    await batch.commit();
  } catch (err) {
    console.error('[Firebase] Failed to save reviews to Firestore:', err);
  }
}

export async function addCustomerReview(
  input: Omit<Review, 'id' | 'timeAgo' | 'source' | 'verified' | 'approved' | 'createdAt'>
): Promise<Review> {
  const newReview: Review = {
    ...input,
    id: `rev-${Date.now()}`,
    timeAgo: 'Just now',
    verified: true,
    source: 'Bakery Guestbook',
    approved: true, // auto-approved for interactive guestbook showcase
    createdAt: new Date().toISOString()
  };

  reviewsCache = [newReview, ...reviewsCache];
  notifyStoreChange('reviews_updated', reviewsCache);

  try {
    await setDoc(doc(db, 'reviews', newReview.id), cleanFirestoreData(newReview));
  } catch (err) {
    console.error('[Firebase] Failed to add review to Firestore:', err);
  }

  return newReview;
}
