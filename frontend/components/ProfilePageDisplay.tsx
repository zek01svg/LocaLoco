import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useTheme } from '../hooks/useTheme';
import { useBusinessByUen } from '../hooks/useBusinessByUen';
import { useAuthStore } from '../store/authStore';
import { ProfilePage } from './pages/ProfilePage';
import { BusinessProfilePage } from './pages/BusinessProfilePage';
import { ROUTES } from '../constants/routes';
import { Business } from '../types/business';
import { BusinessOwner } from '../data/mockBusinessOwnerData'; // ✅ Import BusinessOwner
import { useState, useEffect } from 'react';
import { useUserPointsStore } from '../store/userStore';


const MOCK_BOOKMARKED_BUSINESSES: Business[] = [];

export function ProfilePageDisplay() {
  const navigate = useNavigate();
  const { userId, role } = useAuth(); // ✅ Get role from useAuth
  const { isDarkMode } = useTheme();
  const { setPoints } = useUserPointsStore(); // ✅ Correct
  const [bookmarkedBusinesses] = useState<Business[]>(MOCK_BOOKMARKED_BUSINESSES);

  // Get business mode state
  const businessMode = useAuthStore((state) => state.businessMode);

  // Call useUser hook unconditionally for user data
  const { user, stats, updateUser } = useUser(userId);

  // Fetch business data when in business mode
  const { business, loading: businessLoading } = useBusinessByUen(
    businessMode.isBusinessMode ? businessMode.currentBusinessUen : null
  );

  // ✅ DEBUG LOGS
  console.log('════════════════════════════════════');
  console.log('📊 ProfilePageDisplay Debug Info:');
  console.log('userId:', userId);
  console.log('role:', role);
  console.log('user:', user);
  console.log('user type check:');
  console.log('  - has businessName?', user && 'businessName' in user);
  console.log('  - has name?', user && 'name' in user);
  console.log('  - has phone?', user && 'phone' in user);
  console.log('  - has operatingDays?', user && 'operatingDays' in user);
  console.log('════════════════════════════════════');

  // Sync loyalty points with user points store
  useEffect(() => {
    if (stats?.loyaltyPoints !== undefined) {
      setPoints(stats.loyaltyPoints); // ✅ Correct
    }
  }, [stats?.loyaltyPoints, setPoints]);

  // Navigation handlers
  const handleBack = () => navigate(ROUTES.BUSINESSES);
  const handleViewBusinessDetails = (business: Business) => navigate(`${ROUTES.BUSINESSES}/${business.uen}`);
  const handleBookmarkToggle = (businessId: string) => console.log('Toggle bookmark for:', businessId);
  const handleNavigateToVouchers = () => navigate(ROUTES.VOUCHERS);

  // Loading state - show if no userId or no user data yet
  if (!userId || !user) {
    console.log('⏳ Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#3a3a3a' : '#f9fafb' }}>
        <div style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>Loading profile...</div>
      </div>
    );
  }

  // ✅ Check if in business mode - fetch and show business profile
  if (role === 'business' && businessMode.isBusinessMode) {
    console.log('🏢 Business mode active');
    console.log('🏢 Current business UEN:', businessMode.currentBusinessUen);
    console.log('🏢 Business data:', business);

    // Show loading while fetching business data
    if (businessLoading || !business) {
      console.log('⏳ Loading business data...');
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#3a3a3a' : '#f9fafb' }}>
          <div style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>Loading business profile...</div>
        </div>
      );
    }

    // Convert business data to BusinessOwner format
    const businessOwner: BusinessOwner = {
      id: userId || '',
      role: 'business_owner',
      businessName: business.businessName,
      address: business.address || '',
      operatingDays: Object.keys(business.openingHours || {}),
      businessEmail: business.email || '',
      phone: business.phoneNumber || '',
      website: business.websiteLink || '',
      socialMedia: business.socialMediaLink || '',
      wallpaper: business.wallpaper,
      priceTier: (business.priceTier || '') as any,
      offersDelivery: business.offersDelivery || false,
      offersPickup: business.offersPickup || false,
      paymentOptions: business.paymentOptions || [],
      category: business.businessCategory || '',
      description: business.description || '',
    };

    console.log('🏢 Rendering BusinessProfilePage with:', businessOwner);

    return (
      <BusinessProfilePage
        businessOwner={businessOwner}
        onBack={handleBack}
        onUpdateBusiness={updateUser}
      />
    );
  }

  // ✅ Regular user profile
  console.log('👤 Rendering regular ProfilePage');
  return (
    <ProfilePage
      user={user as any}
      stats={stats}
      bookmarkedBusinesses={bookmarkedBusinesses}
      onBack={handleBack}
      onUpdateUser={updateUser}
      onViewBusinessDetails={handleViewBusinessDetails}
      onBookmarkToggle={handleBookmarkToggle}
      onNavigateToVouchers={handleNavigateToVouchers}
    />
  );
}
