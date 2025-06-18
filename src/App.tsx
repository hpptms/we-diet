import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopPage } from './page/TopPage';
import LoginPage from './page/LoginPage';
import DashboardPage from './page/DashboardPage';
import RegisterCompletePage from './page/RegisterCompletePage';

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
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/register/complete" element={<RegisterCompletePage />} />
        <Route path="/" element={<TopPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
