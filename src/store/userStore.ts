// store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPointsState {
  currentPoints: number;
  addPoints: (points: number) => void;
  deductPoints: (points: number) => void; // ✅ Add this
  setPoints: (points: number) => void;
}

export const useUserPointsStore = create<UserPointsState>()(
  persist(
    (set) => ({
      currentPoints: 350, // Default points for user-1
      
      addPoints: (points) =>
        set((state) => ({ 
          currentPoints: state.currentPoints + points 
        })),
      
      // ✅ Add this function
      deductPoints: (points) =>
        set((state) => {
          const newPoints = Math.max(0, state.currentPoints - points);
          console.log(`💰 Deducting ${points} points. ${state.currentPoints} → ${newPoints}`);
          return { currentPoints: newPoints };
        }),
      
      setPoints: (points) =>
        set({ currentPoints: points }),
    }),
    {
      name: 'user-points-storage',
    }
  )
);
