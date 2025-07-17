import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import DashboardPageButtons from "../component/DashboardPageButtons";
import ProfileSettings from "./MainContent/ProfileSettings";

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'meal' | 'dieter';

// 仮のユーザー名取得（本来はContextやAPIから取得する想定）
const getAccountName = () => {
  // 例: localStorage.getItem("accountName") など
  return localStorage.getItem("accountName") || "ユーザー";
};

const DashboardPage: React.FC = () => {
  const accountName = getAccountName();
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewChange = (view: CurrentView) => {
    setCurrentView(view);
    if (view === "profile") {
      navigate("/ProfileSettings");
    } else if (view === "dashboard") {
      navigate("/Dashboard");
    }
    // 他のviewはURL変更なし
  };

  // URLに応じてcurrentViewを切り替え
  useEffect(() => {
    if (location.pathname === "/ProfileSettings") {
      setCurrentView("profile");
    } else if (location.pathname === "/Dashboard") {
      setCurrentView("dashboard");
    }
    // 他のviewは従来通り
  }, [location.pathname]);

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileSettings />;
      case 'exercise':
        return <div>運動記録画面（未実装）</div>;
      case 'weight':
        return <div>体重記録画面（未実装）</div>;
      case 'meal':
        return <div>食事記録画面（未実装）</div>;
      case 'dieter':
        return <div>dieter画面（未実装）</div>;
      default:
        return (
          <>
            <h1 style={{ marginBottom: "40px" }}>ようこそ {accountName} さん</h1>
            <DashboardPageButtons onViewChange={handleViewChange} />
          </>
        );
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default DashboardPage;
