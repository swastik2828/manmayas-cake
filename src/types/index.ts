export interface Cake {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryId: 'birthday' | 'feather-wings' | 'wedding' | 'celebration' | 'custom-art' | 'pure-veg';
  description: string;
  priceDisplay: string;
  indicativePrice?: number;
  imageUrl: string;
  galleryImages: string[];
  featured: boolean;
  popular?: boolean;
  flavors: string[];
  isEgglessAvailable: boolean;
  isPureVegSpecial?: boolean;
  spongeOptions: string[];
  weightOptions: string[];
  leadTime: string;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  timeAgo: string;
  verified: boolean;
  reviewText: string;
  occasionTag: string;
  source: 'Google Maps' | 'Bakery Guestbook';
  highlight?: string;
  approved?: boolean;
  createdAt?: string;
}

export interface CakeCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  iconName: string;
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'IN_BAKING' | 'COMPLETED' | 'ARCHIVED';

export interface Enquiry {
  id: string;
  referenceCode: string;
  name: string;
  phone: string;
  email?: string;
  occasion: string;
  preferredDate: string;
  preferredTime?: string;
  cakeId?: string;
  cakeName?: string;
  flavor?: string;
  weight?: string;
  dietaryPreference: 'eggless' | 'regular' | 'pure_veg';
  messageOnCake?: string;
  budgetRange?: string;
  referenceImageUrl?: string;
  referenceImageName?: string;
  notes?: string;
  status: EnquiryStatus;
  createdAt: string;
  adminNotes?: string;
  custom3DSpecs?: {
    tiers: number;
    frosting: string;
    toppings: string[];
    isCutaway?: boolean;
    candleBlown?: boolean;
  };
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  googleReviewUrl: string;
  rating: number;
  reviewCount: number;
  verifiedDate: string;
  openingHours: string;
  announcement: {
    enabled: boolean;
    text: string;
    badge: string;
  };
}
