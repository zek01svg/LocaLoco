// hooks/useUser.ts
import { useState, useEffect, useCallback } from 'react';
import { User, UserStats } from '../types/user';
import { BusinessOwner } from '../types/auth.store.types';

const API_BASE_URL = 'http://localhost:3000'; 

export const useUser = (userId: string | null) => {
  const [user, setUser] = useState<User | BusinessOwner | null>(null);
  const [stats, setStats] = useState<UserStats>({
    vouchersCount: 0,
    reviewsCount: 0,
    loyaltyPoints: 0,
  });
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 useUser - userId:', userId);

    if (!userId) {
      setUser(null);
      setStats({ vouchersCount: 0, reviewsCount: 0, loyaltyPoints: 0 });
      return;
    }

    const fetchUserProfile = async (signal: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        console.log('🌐 Fetching user profile for userId:', userId);

        const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          signal: signal, // Pass abort signal to fetch
        });

        console.log('📡 Response status:', response.status, response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error:', errorText);
          throw new Error(`Failed to fetch user profile: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Raw API response:', data);

        // ✅ Handle both response structures:
        // 1. Direct user object: { id, name, email, ... }
        // 2. Wrapped object: { profile: { id, name, email, ... }, vouchers: [...] }
        const profileData = data.profile || data;

        if (!profileData || !profileData.id) {
          console.error('❌ API response invalid:', data);
          throw new Error('Invalid API response: missing user id');
        }

        // ✅ Map API response to User type
        const userData: User = {
          id: profileData.id,
          role: 'user',
          name: profileData.name || 'User',
          email: profileData.email || 'user@email.com',
          avatarUrl: profileData.image || undefined,
          memberSince: profileData.createdAt
            ? profileData.createdAt.split('T')[0]
            : new Date().toISOString().split('T')[0],
          bio: profileData.bio || '',
          location: profileData.location || 'Singapore',
        };

        console.log('✅ Mapped user data:', userData);
        setUser(userData);

        // ✅ Set vouchers from response
        setVouchers(data.vouchers || []);

        // ✅ Set stats from response (or defaults for new users)
        setStats({
          vouchersCount: data.vouchers?.length || 0,
          reviewsCount: data.reviews?.length || 0,
          loyaltyPoints: data.points || 0,
        });

      } catch (err) {
        // Ignore abort errors (happens during logout/unmount)
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('🛑 Fetch aborted (user logged out or component unmounted)');
          return;
        }

        console.error('❌ Error fetching user profile:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setUser(null); // Clear user on error instead of creating fallback
      } finally {
        setLoading(false);
      }
    };

    // Add abort controller to cancel fetch on unmount/logout
    const controller = new AbortController();
    fetchUserProfile(controller.signal);

    // Cleanup function to abort fetch if component unmounts or userId changes
    return () => {
      controller.abort();
    };
  }, [userId]);

  const updateUser = useCallback(
    async (updatedUser: User | BusinessOwner) => {
      console.log('🔄 updateUser called:', updatedUser);

      try {
        // ✅ Determine user type
        const isBusinessOwner = 'businessName' in updatedUser;
        const userName = isBusinessOwner 
          ? (updatedUser as BusinessOwner).businessName 
          : (updatedUser as User).name;

        const response = await fetch(`${API_BASE_URL}/api/user/update-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: updatedUser.id,
            name: userName,
            image: 'image' in updatedUser ? updatedUser.image : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update user profile');
        }

        const data = await response.json();
        console.log('✅ Profile updated:', data);

        // ✅ Update local state
        setUser({ ...updatedUser });
        
      } catch (err) {
        console.error('❌ Error updating user:', err);
        setError(err instanceof Error ? err.message : 'Update failed');
      }
    },
    []
  );

  return { user, stats, vouchers, updateUser, loading, error };
};
