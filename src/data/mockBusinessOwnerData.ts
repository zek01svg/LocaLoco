// src/data/mockBusinessOwnerData.ts

export interface BusinessOwner {
  id: string;
  businessName: string;
  role: 'business_owner'; // ✅ Changed from 'business' to 'business_owner'
  address: string;
  operatingDays: string[];
  businessEmail: string;
  phone: string;
  website: string;
  socialMedia: string;
  wallpaper?: string;
  priceTier: '' | '$' | '$$' | '$$$' | '$$$$'; // ✅ Added empty string option
  offersDelivery: boolean;
  offersPickup: boolean;
  paymentOptions: string[];
  category: string;
  description: string;
}

// ✅ Keep your existing mock for backward compatibility
export const mockBusinessOwner: BusinessOwner = {
  id: 'business-1',
  role: 'business_owner', // ✅ Changed to 'business_owner'
  businessName: 'The Local Cafe',
  address: '123 Main Street, Singapore 123456',
  operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  businessEmail: 'contact@localcafe.com',
  phone: '+65 1234 5678',
  website: 'https://www.localcafe.com',
  socialMedia: 'https://instagram.com/localcafe',
  wallpaper: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
  priceTier: '$$',
  offersDelivery: true,
  offersPickup: true,
  paymentOptions: ['Cash', 'Credit/Debit Card', 'PayNow', 'Digital Wallets (Apple/Google/Samsung/GrabPay)'],
  category: 'fnb',
  description: 'A cozy local cafe serving artisan coffee and fresh pastries',
};

// ✅ Add a dictionary/Record for useUser to access
export const MOCK_BUSINESS_OWNERS: Record<string, BusinessOwner> = {
  'business-1': mockBusinessOwner,
  // Add more business owners as needed
  'business-2': {
    id: 'business-2',
    role: 'business_owner', // ✅ Added missing role
    businessName: 'Tech Solutions Hub',
    address: '456 Innovation Drive, Singapore 654321',
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    businessEmail: 'info@techsolutions.com',
    phone: '+65 9876 5432',
    website: 'https://www.techsolutions.com',
    socialMedia: 'https://linkedin.com/company/techsolutions',
    wallpaper: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    priceTier: '$$$',
    offersDelivery: false,
    offersPickup: false,
    paymentOptions: ['Credit/Debit Card', 'PayNow'],
    category: 'professional-services',
    description: 'Professional IT consulting and software development services',
  },
};
