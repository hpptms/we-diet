import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import DashboardPageButtons from "../component/DashboardPageButtons";
import ProfileSettings from "./MainContent/ProfileSettings";
import ExerciseRecord from "./MainContent/ExerciseRecord";
import WeightManagement from "./MainContent/WeightManagement";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { exerciseRecordState } from "../recoil/exerciseRecordAtom";
import { weightRecordedDateAtom } from "../recoil/weightRecordedDateAtom";
import { clearWeightCacheAtom, weightRecordCacheAtom } from "../recoil/weightRecordCacheAtom";

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'meal' | 'dieter';

// 仮のユーザー名取得（本来はContextやAPIから取得する想定）
const getAccountName = () => {
  // 例: localStorage.getItem("accountName") など
  return localStorage.getItem("accountName") || "ユーザー";
};

interface DashboardPageProps {
  initialView?: CurrentView;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ initialView }) => {
  const accountName = getAccountName();
  const [currentView, setCurrentView] = useState<CurrentView>(initialView || 'dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  // Recoil atomからweightRecordedDateを取得
  const weightRecordedDate = useRecoilValue(weightRecordedDateAtom);
  const setClearWeightCache = useSetRecoilState(clearWeightCacheAtom);
  const setWeightCache = useSetRecoilState(weightRecordCacheAtom);
  const todayStr = new Date().toISOString().slice(0, 10);
  const hasWeightInput = weightRecordedDate === todayStr;

  const handleViewChange = (view: CurrentView) => {
    // ダッシュボードに戻る時にWeightManagementのキャッシュをクリア
    if (view === "dashboard" && currentView === "weight") {
      setClearWeightCache(true);
      setWeightCache({
        monthlyRecords: {},
        yearlyRecords: {},
        currentDate: new Date(),
        viewPeriod: 'month'
      });
    }
    
    setCurrentView(view);
    if (view === "profile") {
      navigate("/ProfileSettings");
    } else if (view === "dashboard") {
      navigate("/Dashboard");
    } else if (view === "exercise") {
      navigate("/Exercise");
    } else if (view === "weight") {
      navigate("/WeightManagement");
    }
    // 他のviewはURL変更なし
  };

  // URLに応じてcurrentViewを切り替え
  useEffect(() => {
    if (location.pathname === "/ProfileSettings") {
      setCurrentView("profile");
    } else if (location.pathname === "/Dashboard") {
      setCurrentView("dashboard");
    } else if (location.pathname === "/WeightManagement") {
      setCurrentView("weight");
    }
    // 他のviewは従来通り
  }, [location.pathname]);

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileSettings />;
      case 'exercise':
        return <ExerciseRecord onBack={() => { setCurrentView('dashboard'); navigate('/Dashboard'); }} />;
      case 'weight':
        return <WeightManagement onBack={() => { 
          setClearWeightCache(true);
          setWeightCache({
            monthlyRecords: {},
            yearlyRecords: {},
            currentDate: new Date(),
            viewPeriod: 'month'
          });
          setCurrentView('dashboard'); 
          navigate('/Dashboard'); 
        }} />;
      case 'meal':
        return <div>食事記録画面（未実装）</div>;
      case 'dieter':
        return <div>dieter画面（未実装）</div>;
      default:
        return (
          <>
            <h1 style={{ marginBottom: "40px" }}>ようこそ {accountName} さん</h1>
            <DashboardPageButtons onViewChange={handleViewChange} hasWeightInput={hasWeightInput} />
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
