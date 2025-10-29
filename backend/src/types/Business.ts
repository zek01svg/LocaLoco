export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface HourEntry {
    open: string; 
    close: string; 
}

export interface BusinessPaymentOption {
    uen: string;
    paymentOption: string;
}

export interface Business {
    uen: string; 
    businessName: string;
    businessCategory: string;
    description: string;
    address: string;
    open247: boolean | number; 
    openingHours: Record<DayOfWeek, HourEntry>; 
    email: string;
    phoneNumber: string;
    websiteLink: string | null; 
    socialMediaLink: string | null; 
    wallpaper: string; 
    dateOfCreation: string; 
    priceTier: string;
    offersDelivery: boolean | number;
    offersPickup: boolean | number;
    paymentOptions: string[];
}