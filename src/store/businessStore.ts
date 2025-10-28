// src/store/businessStore.ts - DEBUG VERSION
import { create } from 'zustand';
import { Business, BookmarkedBusiness } from '../types/business';
import { checkBusinessOpenStatus } from '../utils/businessUtils';

export interface BusinessFilters {
  searchTerm: string;
  selectedCategories: string[];
  selectedPrices: string[];
  openNowOnly: boolean;
}

export interface BusinessState {
  businesses: Business[];
  selectedBusiness: Business | null;
  bookmarkedBusinesses: BookmarkedBusiness[];
  filters: BusinessFilters;
  isLoading: boolean;
  error: string | null;
}

export interface BusinessActions {
  setBusinesses: (businesses: Business[]) => void;
  setSelectedBusiness: (business: Business | null) => void;
  toggleBookmark: (businessId: string) => void;
  isBookmarked: (businessId: string) => boolean;
  setFilters: (filters: Partial<BusinessFilters>) => void;
  resetFilters: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export type BusinessStore = BusinessState & BusinessActions;

const initialFilters: BusinessFilters = {
  searchTerm: '',
  selectedCategories: [],
  selectedPrices: [],
  openNowOnly: false,
};

let updateCount = 0;

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  businesses: [],
  selectedBusiness: null,
  bookmarkedBusinesses: [],
  filters: initialFilters,
  isLoading: false,
  error: null,

  setBusinesses: (businesses) => {
    updateCount++;
    console.log(`🏪 [${updateCount}] BusinessStore.setBusinesses called:`, businesses.length);
    set({ businesses });
  },

  setSelectedBusiness: (business) => {
    updateCount++;
    console.log(`🏪 [${updateCount}] BusinessStore.setSelectedBusiness:`, business?.id);
    set({ selectedBusiness: business });
  },

  toggleBookmark: (businessId) => {
    updateCount++;
    console.log(`🔖 [${updateCount}] BusinessStore.toggleBookmark:`, businessId);

    set((state) => {
      const isBookmarked = state.bookmarkedBusinesses.some(
        (b) => b.businessId === businessId
      );

      if (isBookmarked) {
        return {
          bookmarkedBusinesses: state.bookmarkedBusinesses.filter(
            (b) => b.businessId !== businessId
          ),
        };
      } else {
        return {
          bookmarkedBusinesses: [
            ...state.bookmarkedBusinesses,
            { businessId, dateBookmarked: new Date().toISOString() },
          ],
        };
      }
    });
  },

  isBookmarked: (businessId) => {
    return get().bookmarkedBusinesses.some((b) => b.businessId === businessId);
  },

  setFilters: (newFilters) => {
    updateCount++;
    console.log(`🔍 [${updateCount}] BusinessStore.setFilters:`, newFilters);
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
  },

  resetFilters: () => {
    updateCount++;
    console.log(`🔄 [${updateCount}] BusinessStore.resetFilters`);
    set({ filters: initialFilters });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },
}));

// Add subscription logger
useBusinessStore.subscribe((state) => {
  console.log('📊 BusinessStore changed:', {
    businessCount: state.businesses.length,
    bookmarkCount: state.bookmarkedBusinesses.length,
    hasFilters: state.filters.searchTerm !== '',
  });
});

// Selectors
export const selectFilteredBusinesses = (state: BusinessStore) => {
  const { businesses, filters } = state;
  return businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      business.address.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesCategory =
      filters.selectedCategories.length === 0 ||
      filters.selectedCategories.includes(business.category);

    const matchesPrice =
      filters.selectedPrices.length === 0 ||
      filters.selectedPrices.includes(business.priceRange);

    const matchesOpen = !filters.openNowOnly || checkBusinessOpenStatus(business).isOpen;

    return matchesSearch && matchesCategory && matchesPrice && matchesOpen;
  });
};

export const selectBookmarkedBusinesses = (state: BusinessStore) => {
  const bookmarkedIds = state.bookmarkedBusinesses.map((b) => b.businessId);
  return state.businesses.filter((business) =>
    bookmarkedIds.includes(business.id)
  );
};
