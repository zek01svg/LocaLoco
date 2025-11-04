// src/types/auth.ts

export type UserRole = 'user' | 'business';

import { BusinessOwner } from '../data/mockBusinessOwnerData';

export type { BusinessOwner } from '../data/mockBusinessOwnerData';

export type UserProfile = User | BusinessOwner;

export interface AuthState {
  
  isAuthenticated: boolean;
  role: UserRole | null;
  userId: string | null;
}

// ✅ User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Basic user signup data
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ✅ Complete business signup data (all 5 steps from SignupPage)
export interface BusinessSignupData {
  // Step 1: Basic Information
  uen: string;
  businessName: string;
  businessCategory: string;
  description: string;
  address: string;

  // Step 2: Contact Information
  phoneNumber: string;
  businessEmail: string;
  websiteLink?: string;
  socialMediaLink?: string;
  wallpaper?: File | null;

  // Step 3: Operating Hours
  open247: boolean;
  openingHours: {
    [day: string]: {
      open: string;
      close: string;
    };
  };

  // Step 4: Business Details
  priceTier: '$' | '$$' | '$$$' | '$$$$' | '';
  offersDelivery: boolean;
  offersPickup: boolean;
  paymentOptions: string[];

  // Step 5: Account Security
  password: string;
  confirmPassword: string;

  // Auto-generated
  dateOfCreation?: string;
  role?: UserRole;
  mode?: 'signup';
}

// ✅ Legacy interface - keep for backward compatibility but not actively used
export interface BusinessVerificationData {
  uen: string;
  businessName: string;
  businessCategory: string;
  description: string;
  address: string;
  open247: boolean;
  openingHours: {
    [day: string]: {
      open: string;
      close: string;
    };
  };
  email: string;
  phoneNumber: string;
  websiteLink?: string;
  socialMediaLink?: string;
  wallpaper?: File | null;
  priceTier: '$' | '$$' | '$$$' | '$$$$' | '';
  offersDelivery: boolean;
  offersPickup: boolean;
  paymentOptions: string[];
  dateOfCreation?: string;
}
