// store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeState {
  isDarkMode: boolean;
}

export interface ThemeActions {
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDarkMode: true,
      
      toggleTheme: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },
      
      setTheme: (isDark) => {
        set({ isDarkMode: isDark });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Selector
export const selectIsDarkMode = (state: ThemeStore) => state.isDarkMode;