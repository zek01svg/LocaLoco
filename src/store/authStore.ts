// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '../types/auth'; // Import from your existing types

export interface BusinessModeState {
  isBusinessMode: boolean;
  currentBusinessUen: string | null;
  currentBusinessName: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  userId: string | null;
  token: string | null;
  businessMode: BusinessModeState;
}

export interface AuthActions {
  login: (userId: string, role: UserRole, token?: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  enableBusinessMode: (businessUen: string, businessName: string) => void;
  disableBusinessMode: () => void;
  switchBusiness: (businessUen: string, businessName: string) => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  userId: null,
  token: null,
  businessMode: {
    isBusinessMode: false,
    currentBusinessUen: null,
    currentBusinessName: null,
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      login: (userId, role, token) => {
        set({
          isAuthenticated: true,
          userId,
          role,
          token: token || null,
        });
      },

      logout: () => {
        set(initialState);
      },

      setRole: (role) => {
        set({ role });
      },

      enableBusinessMode: (businessUen, businessName) => {
        set({
          role: 'business', // Switch role to business (hides vouchers, shows business UI)
          businessMode: {
            isBusinessMode: true,
            currentBusinessUen: businessUen,
            currentBusinessName: businessName,
          },
        });
      },

      disableBusinessMode: () => {
        set({
          role: 'user', // Switch role back to user (shows vouchers, user UI)
          businessMode: {
            isBusinessMode: false,
            currentBusinessUen: null,
            currentBusinessName: null,
          },
        });
      },

      switchBusiness: (businessUen, businessName) => {
        set({
          role: 'business', // Ensure role stays as business when switching between businesses
          businessMode: {
            isBusinessMode: true,
            currentBusinessUen: businessUen,
            currentBusinessName: businessName,
          },
        });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        userId: state.userId,
        token: state.token,
        businessMode: state.businessMode,
      }),
    }
  )
);

// Selectors for better performance (use these in components)
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectUserRole = (state: AuthStore) => state.role;
export const selectUserId = (state: AuthStore) => state.userId;