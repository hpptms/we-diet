import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopPage } from './page/TopPage';
import LoginPage from './page/LoginPage';
import DashboardPage from './page/DashboardPage';
import RegisterCompletePage from './page/RegisterCompletePage';
import ProfileSettings from './page/MainContent/ProfileSettings';
import DashboardLayout from './component/DashboardLayout';

// 認証判定用のラップコンポーネント
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  // 仮の認証判定: localStorageにaccountNameがあればログイン済みとみなす
  const isAuthenticated = !!localStorage.getItem("accountName");
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
        <Route path="/register/complete" element={<RegisterCompletePage />} />
        <Route path="/" element={<TopPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
