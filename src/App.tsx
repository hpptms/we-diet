import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TopPage } from './page/TopPage';
import LoginPage from './page/LoginPage';
import DashboardPage from './page/DashboardPage';
import RegisterCompletePage from './page/RegisterCompletePage';
import VerifyEmailPage from './page/VerifyEmailPage';
import ProfileSettings from './page/MainContent/ProfileSettings';
import FoodLog from './page/MainContent/FoodLog';
import Dieter from './page/MainContent/Dieter';
import DashboardLayout from './component/DashboardLayout';
import PrivacyPolicy from './page/PrivacyPolicy';
import DataDeletion from './page/DataDeletion';
import TermsOfService from './page/TermsOfService';
import { initializeFacebookSDK } from './utils/facebookSDK';
import { initGA, trackPageView } from './utils/googleAnalytics';
import { initPerformanceMonitoring } from './utils/performanceMonitoring';

// 認証判定用のラップコンポーネント
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  // URLパラメータを確認（Googleログインのコールバック処理中の場合は認証をスキップ）
  const urlParams = new URLSearchParams(window.location.search);
  const hasGoogleLoginParams = urlParams.get('token') && urlParams.get('user_id') && urlParams.get('account_name');
  
  // 仮の認証判定: localStorageにaccountNameがあるか、Googleログインのパラメータがあればログイン済みとみなす
  const isAuthenticated = !!localStorage.getItem("accountName") || hasGoogleLoginParams;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Component to track page views
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
};

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
    
    // Initialize Facebook SDK when app starts
    // initializeFacebookSDK();
    
    // Initialize performance monitoring
    const performanceMonitor = initPerformanceMonitoring();
    
    // Register Service Worker for performance optimization
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
    
    // Cleanup function
    return () => {
      performanceMonitor.disconnect();
    };
  }, []);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <PageViewTracker />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Dashboard" element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </PrivateRoute>
        } />
        {/* 小文字のダッシュボードルートも追加（Googleログイン対応） */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/ProfileSettings" element={
          <PrivateRoute>
            <DashboardLayout>
              <ProfileSettings />
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/dashboard/profile-settings" element={
          <PrivateRoute>
            <DashboardLayout>
              <ProfileSettings />
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/Exercise" element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage initialView="exercise" />
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/WeightManagement" element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage initialView="weight" />
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/FoodLog" element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage initialView="FoodLog" />
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/Dieter" element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage initialView="dieter" />
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/Dieter/Follow" element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage initialView="dieter" subView="follow" />
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/register/complete" element={<RegisterCompletePage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/" element={<TopPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
