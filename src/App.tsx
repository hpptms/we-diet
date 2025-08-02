import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopPage } from './page/TopPage';
import LoginPage from './page/LoginPage';
import DashboardPage from './page/DashboardPage';
import RegisterCompletePage from './page/RegisterCompletePage';
import ProfileSettings from './page/MainContent/ProfileSettings';
import FoodLog from './page/MainContent/FoodLog';
import Dieter from './page/MainContent/Dieter';
import DashboardLayout from './component/DashboardLayout';

// 認証判定用のラップコンポーネント
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  // URLパラメータを確認（Googleログインのコールバック処理中の場合は認証をスキップ）
  const urlParams = new URLSearchParams(window.location.search);
  const hasGoogleLoginParams = urlParams.get('token') && urlParams.get('user_id') && urlParams.get('account_name');
  
  // 仮の認証判定: localStorageにaccountNameがあるか、Googleログインのパラメータがあればログイン済みとみなす
  const isAuthenticated = !!localStorage.getItem("accountName") || hasGoogleLoginParams;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/" element={<TopPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
