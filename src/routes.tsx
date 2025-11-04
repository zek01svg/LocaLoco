// routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';

// Layout components
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth pages
import { WelcomeModal } from './components/pages/WelcomeModal';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
// import { BusinessVerification } from './components/pages/BusinessVerification'; // Legacy - not used

// Main pages
import { MapDiscoveryPage } from './components/MapDiscoveryPage';
import { ProfilePageDisplay } from './components/ProfilePageDisplay';
import { BusinessProfilePage } from './components/pages/BusinessProfilePage';
import { ForumPage } from './components/ForumPage';
import { SettingsPage } from './components/SettingsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { VouchersPage } from './components/VouchersPage';
import { WriteReviewPage } from './components/WriteReviewPage';
import { ErrorPage } from './components/pages/ErrorPage';
import ErrorBoundary from './components/pages/ErrorBoundary';

import { useNavigate } from "react-router-dom";

export const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <WelcomeModal
      open={true}
      onClose={() => {}}
      onLogin={() => navigate(ROUTES.LOGIN)}
      onSignUp={() => navigate(ROUTES.SIGNUP)}
    />
  );
};

import { BusinessListPage } from './components/BusinessListPage';
import { BusinessDetailPage } from './components/BusinessDetailPage';
import { BookmarksPage } from './components/BookmarksPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - No Auth Required */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

      {/* Public Routes with Layout - Guests can browse */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<MapDiscoveryPage />} />
        <Route path={ROUTES.MAP} element={<MapDiscoveryPage />} />
        <Route path={ROUTES.BUSINESSES} element={<BusinessListPage />} />
        <Route path={ROUTES.BUSINESS} element={<BusinessDetailPage />} />
      </Route>

      {/* Protected Routes with Layout - Auth Required */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path={ROUTES.BOOKMARKS} element={<BookmarksPage />} />
        <Route
            path={ROUTES.PROFILE}
            element={
              <ErrorBoundary>
                <ProfilePageDisplay />
              </ErrorBoundary>}
        />
        <Route path={ROUTES.BUSINESS_PROFILE} element={<BusinessProfilePage />} />
        <Route path={ROUTES.FORUM} element={<ForumPage/>} />
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        <Route path={ROUTES.VOUCHERS} element={<VouchersPage />} />
        <Route path={ROUTES.REVIEW} element={<WriteReviewPage />} />
      </Route>

      {/* Error Routes */}
      <Route path="/404" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
