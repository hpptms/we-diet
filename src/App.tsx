import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import DashboardLayout from './component/DashboardLayout';
import { initGA, trackPageView } from './utils/googleAnalytics';
import { initPerformanceMonitoring } from './utils/performanceMonitoring';
import { LanguageProvider } from './context/LanguageContext';
import { useTranslation } from './hooks/useTranslation';

// Lazy load heavy components for better performance
import { 
  LazyDieter, 
  LazyExerciseRecord, 
  LazyFoodLog, 
  LazyWeightManagement, 
  LazyProfileSettings 
} from './utils/LazyComponents';

// Lazy load page components
const LazyTopPage = React.lazy(() => import('./page/TopPage').then(module => ({ default: module.TopPage })));
const LazyLoginPage = React.lazy(() => import('./page/LoginPage'));
const LazyDashboardPage = React.lazy(() => import('./page/DashboardPage'));
const LazyRegisterCompletePage = React.lazy(() => import('./page/RegisterCompletePage'));
const LazyVerifyEmailPage = React.lazy(() => import('./page/VerifyEmailPage'));
const LazyPrivacyPolicy = React.lazy(() => import('./page/PrivacyPolicy'));
const LazyDataDeletion = React.lazy(() => import('./page/DataDeletion'));
const LazyTermsOfService = React.lazy(() => import('./page/TermsOfService'));

// Loading component for suspense
const LoadingComponent = () => {
  const { t } = useTranslation();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <CircularProgress size={40} sx={{ color: '#29b6f6' }} />
      <Box sx={{ 
        color: '#666', 
        fontSize: '0.9rem',
        textAlign: 'center' 
      }}>
        {t('common', 'loading')}
      </Box>
    </Box>
  );
};

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
    
    // Register Service Worker for performance optimization (excluding iOS Safari)
    if ('serviceWorker' in navigator) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      // iOSのSafariではService Workerを登録しない
      if (!isIOS || !isSafari) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              // Service Worker registered successfully - silent handling
            })
            .catch((registrationError) => {
              // Service Worker registration failed - silent handling
            });
        });
      }
    }
    
    // Cleanup function
    return () => {
      performanceMonitor.disconnect();
    };
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <PageViewTracker />
        <Routes>
        <Route path="/login" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyLoginPage />
          </Suspense>
        } />
        <Route path="/Dashboard" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyDashboardPage />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        {/* 小文字のダッシュボードルートも追加（Googleログイン対応） */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyDashboardPage />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/ProfileSettings" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyDashboardPage initialView="profile" />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/Exercise" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyDashboardPage initialView="exercise" />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/WeightManagement" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyDashboardPage initialView="weight" />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/FoodLog" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyDashboardPage initialView="FoodLog" />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/Dieter" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyDashboardPage initialView="dieter" />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/Dieter/Follow" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyDashboardPage initialView="dieter" subView="follow" />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/DebugLog" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyDashboardPage initialView="debug" />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/register/complete" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyRegisterCompletePage />
          </Suspense>
        } />
        <Route path="/verify-email" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyVerifyEmailPage />
          </Suspense>
        } />
        <Route path="/privacy-policy" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyPrivacyPolicy />
          </Suspense>
        } />
        <Route path="/data-deletion" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyDataDeletion />
          </Suspense>
        } />
        <Route path="/terms-of-service" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyTermsOfService />
          </Suspense>
        } />
        <Route path="/" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyTopPage />
          </Suspense>
        } />
        {/* 404ページのフォールバック - 不正なルートをトップページにリダイレクト */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
