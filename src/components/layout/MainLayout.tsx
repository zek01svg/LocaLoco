import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppSidebar } from '../AppSidebar';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import { ROUTES } from '../../constants/routes';

export const MainLayout = () => {
  const { logout, userId } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const { user, stats, updateUser } = useUser(userId || null);
  const isAuthenticated = !!userId; // Check if user is logged in

  const getCurrentView = () => {
    const path = location.pathname;
    if (path === ROUTES.MAP || path === ROUTES.HOME) return 'map';
    if (path === ROUTES.BUSINESSES) return 'list';
    if (path === ROUTES.BOOKMARKS) return 'bookmarks';
    if (path === ROUTES.PROFILE) return 'profile';
    if (path === ROUTES.FORUM) return 'forum';
    if (path === ROUTES.NOTIFICATIONS) return 'notifications';
    if (path === ROUTES.SETTINGS) return 'settings';
    if (path === ROUTES.VOUCHERS) return 'vouchers';
    return 'list';
  };

  const handleNavigate = (view: string) => {
    const routeMap: Record<string, string> = {
      map: ROUTES.MAP,
      list: ROUTES.BUSINESSES,
      bookmarks: ROUTES.BOOKMARKS,
      profile: user && 'businessName' in user ? ROUTES.BUSINESS_PROFILE : ROUTES.PROFILE,
      forum: ROUTES.FORUM,
      notifications: ROUTES.NOTIFICATIONS,
      settings: ROUTES.SETTINGS,
      vouchers: ROUTES.VOUCHERS,
      filters: ROUTES.BUSINESSES,
    };
    if (routeMap[view]) {
      navigate(routeMap[view]);
    }
  };

  // ✅ Helper function to safely get user info (with guest fallback)
  const getUserInfo = () => {
    if (!user) {
      // Guest user - return dummy data
      return {
        name: 'Guest',
        email: 'guest@localoco.com',
        avatarUrl: undefined,
        isGuest: true,
      };
    }

    if ('businessName' in user) {
      // It's a BusinessOwner
      return {
        name: user.businessName,
        email: user.businessEmail,
        avatarUrl: user.wallpaper,
        isGuest: false,
      };
    } else {
      // It's a regular User
      return {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isGuest: false,
      };
    }
  };

  const userInfo = getUserInfo();

  return (
    <>
      <AppSidebar
        onNavigate={handleNavigate}
        onLogout={logout}
        currentView={getCurrentView()}
        userName={userInfo.name}
        userEmail={userInfo.email}
        avatarUrl={userInfo.avatarUrl}
        onThemeToggle={toggleTheme}
        isAuthenticated={isAuthenticated} // ✅ Pass auth status
      />
      <div className="main-content md:ml-20 h-screen overflow-y-auto pb-20 md:pb-0">
        <Outlet context={{ user, stats, updateUser, isAuthenticated }} />
      </div>
    </>
  );
};