import React, { useEffect, Suspense, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import DashboardLayout from './component/DashboardLayout';
import AMPRedirect from './component/AMPRedirect';
import { initGA, trackPageView } from './utils/googleAnalytics';
import { initPerformanceMonitoring } from './utils/performanceMonitoring';
import { notifyPageView } from './utils/indexNow';
import { LanguageProvider } from './context/LanguageContext';
import { useTranslation } from './hooks/useTranslation';

// Lazy load page components with better optimization
const LazyTopPage = React.lazy(() => 
  import('./page/TopPage').then(module => ({ default: module.TopPage }))
);
const LazyLoginPage = React.lazy(() => import('./page/LoginPage'));
const LazyRegisterPage = React.lazy(() => import('./page/RegisterPage'));
const LazyDashboardPage = React.lazy(() => import('./page/DashboardPage'));
const LazyRegisterCompletePage = React.lazy(() => import('./page/RegisterCompletePage'));
const LazyVerifyEmailPage = React.lazy(() => import('./page/VerifyEmailPage'));
const LazyPrivacyPolicy = React.lazy(() => import('./page/PrivacyPolicy'));
const LazyDataDeletion = React.lazy(() => import('./page/DataDeletion'));
const LazyTermsOfService = React.lazy(() => import('./page/TermsOfService'));
const LazyFAQPage = React.lazy(() => import('./page/FAQPage'));
const LazyHashtagFeed = React.lazy(() => import('./page/MainContent/HashtagFeed'));

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
  // URLパラメータを確認（ソーシャルログインのコールバック処理中の場合は認証をスキップ）
  const urlParams = new URLSearchParams(window.location.search);
  const hasSocialLoginParams = urlParams.get('token') && urlParams.get('user_id');
  
  // 仮の認証判定: localStorageにaccountNameがあるか、ソーシャルログインのパラメータがあればログイン済みとみなす
  const isAuthenticated = !!localStorage.getItem("accountName") || hasSocialLoginParams;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Component to track page views and notify IndexNow
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics tracking
    trackPageView(location.pathname + location.search, document.title);

    // IndexNow notification (本番環境のみ)
    notifyPageView(location.pathname);
  }, [location]);

  return null;
};

// Component to scroll to top on route change and disable browser scroll restoration
const ScrollToTop = () => {
  const location = useLocation();

  // ブラウザの自動スクロール復元を無効化
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // popstateイベント（ブラウザバック/フォワード）でもスクロールをリセット
    const handlePopState = () => {
      // 少し遅延させてブラウザのスクロール復元後に実行
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // 通常のルート変更時のスクロールリセット
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

// 統合されたダッシュボードルートコンポーネント
const DashboardRoute = React.memo(({ initialView, subView }: { initialView?: string; subView?: string }) => {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <Suspense fallback={<LoadingComponent />}>
          <LazyDashboardPage initialView={initialView as any} subView={subView} />
        </Suspense>
      </DashboardLayout>
    </PrivateRoute>
  );
});
DashboardRoute.displayName = 'DashboardRoute';

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
    <HelmetProvider>
      <LanguageProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <PageViewTracker />
          <ScrollToTop />
          <Routes>
        <Route path="/login" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyLoginPage />
          </Suspense>
        } />
        <Route path="/register" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyRegisterPage />
          </Suspense>
        } />
        
        {/* Dashboard Routes - 統合された動的ルーティング */}
        <Route path="/Dashboard" element={<DashboardRoute />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/ProfileSettings" element={<DashboardRoute initialView="profile" />} />
        <Route path="/Exercise" element={<DashboardRoute initialView="exercise" />} />
        <Route path="/WeightManagement" element={<DashboardRoute initialView="weight" />} />
        <Route path="/FoodLog" element={<DashboardRoute initialView="FoodLog" />} />
        <Route path="/Dieter" element={<DashboardRoute initialView="dieter" />} />
        <Route path="/Dieter/Follow" element={<DashboardRoute initialView="dieter" subView="follow" />} />
        <Route path="/hashtag/:hashtag" element={
          <PrivateRoute>
            <DashboardLayout>
              <Suspense fallback={<LoadingComponent />}>
                <LazyHashtagFeed />
              </Suspense>
            </DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/DebugLog" element={<DashboardRoute initialView="debug" />} />
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
          <AMPRedirect ampPath="/amp/privacy-policy.html" />
        } />
        <Route path="/data-deletion" element={
          <AMPRedirect ampPath="/amp/data-deletion.html" />
        } />
        <Route path="/terms-of-service" element={
          <AMPRedirect ampPath="/amp/terms-of-service.html" />
        } />
        <Route path="/faq" element={
          <Suspense fallback={<LoadingComponent />}>
            <LazyFAQPage />
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
    </HelmetProvider>
  );
}

export default App;
