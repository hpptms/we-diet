import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../component/Header";
import Footer from "../component/Footer";
import DashboardPageButtons from "../component/DashboardPageButtons";
import ProfileSettings from "./MainContent/ProfileSettings";
import ExerciseRecord from "./MainContent/ExerciseRecord";
import WeightManagement from "./MainContent/WeightManagement";
import FoodLog from "./MainContent/FoodLog";
import Dieter from "./MainContent/Dieter";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState } from "../recoil/darkModeAtom";
import { exerciseRecordState } from "../recoil/exerciseRecordAtom";
import { weightRecordedDateAtom } from "../recoil/weightRecordedDateAtom";
import { clearWeightCacheAtom, weightRecordCacheAtom } from "../recoil/weightRecordCacheAtom";
import { profileSettingsState, convertServerProfileToLocalProfile } from "../recoil/profileSettingsAtom";
import { UserProfile } from "../proto/user_profile_pb";

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

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
  const isDarkMode = useRecoilValue(darkModeState);

  // Recoil atomからweightRecordedDateを取得
  const weightRecordedDate = useRecoilValue(weightRecordedDateAtom);
  const setClearWeightCache = useSetRecoilState(clearWeightCacheAtom);
  const setWeightCache = useSetRecoilState(weightRecordCacheAtom);
  const setProfileSettings = useSetRecoilState(profileSettingsState);
  const todayStr = new Date().toISOString().slice(0, 10);
  const hasWeightInput = weightRecordedDate === todayStr;

  // サーバーからプロフィール情報を取得する関数
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('プロフィール取得開始:', { userId });
      
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}proto/user_profile/${userId}`);

      if (response.ok) {
        const responseData = await response.json();
        console.log('サーバーからプロフィール情報を取得:', responseData);
        
        if (responseData.profile) {
          // UserProfileからProfileSettingsStateに変換してRecoilに設定
          const convertedProfile = convertServerProfileToLocalProfile(responseData.profile);
          setProfileSettings(convertedProfile);
          console.log('プロフィール情報をRecoilに設定:', convertedProfile);
        }
      } else if (response.status === 404) {
        console.log('プロフィールが見つかりません（初回ログイン）');
      } else {
        console.error('プロフィール取得に失敗:', response.status);
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    }
  };

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
    } else if (view === "FoodLog") {
      navigate("/FoodLog");
    } else if (view === "dieter") {
      navigate("/Dieter");
    }
    // 他のviewはURL変更なし
  };

  // Googleログインのコールバック処理
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('user_id');
    const accountName = urlParams.get('account_name');
    const error = urlParams.get('error');

    if (error) {
      console.error('Google login error:', error);
      alert('Googleログインでエラーが発生しました: ' + error);
      navigate('/login');
      return;
    }

    if (token && userId && accountName) {
      console.log('Google login success:', { token, userId, accountName });
      // localStorageに保存
      localStorage.setItem('accountName', accountName);
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_id', userId);
      
      // サーバーからプロフィール情報を取得
      fetchUserProfile(userId);
      
      // URLからパラメータを削除してダッシュボードを表示
      navigate('/Dashboard', { replace: true });
    }
  }, [location.search, navigate]);

  // 既存ユーザーの場合、初回読み込み時にプロフィール情報を取得
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('jwt_token');
    
    if (userId && token && !location.search.includes('token=')) {
      // Googleログインのコールバックでない場合のみ実行
      console.log('既存ユーザーのプロフィール情報を取得中...');
      fetchUserProfile(userId);
    }
  }, []); // 初回のみ実行

  // URLに応じてcurrentViewを切り替え
  useEffect(() => {
    if (location.pathname === "/ProfileSettings") {
      setCurrentView("profile");
    } else if (location.pathname === "/Dashboard") {
      setCurrentView("dashboard");
    } else if (location.pathname === "/WeightManagement") {
      setCurrentView("weight");
    } else if (location.pathname === "/FoodLog") {
      setCurrentView("FoodLog");
    } else if (location.pathname === "/Dieter") {
      setCurrentView("dieter");
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
      case 'FoodLog':
        return <FoodLog onBack={() => { setCurrentView('dashboard'); navigate('/Dashboard'); }} />;
      case 'dieter':
        return <Dieter 
          onBack={() => { setCurrentView('dashboard'); navigate('/Dashboard'); }}
          onViewChange={handleViewChange}
        />;
      default:
        return (
          <>
            <DashboardPageButtons onViewChange={handleViewChange} hasWeightInput={hasWeightInput} />
          </>
        );
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: isDarkMode ? '#000000' : 'transparent',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      color: isDarkMode ? '#ffffff' : 'inherit',
      '& > *': {
        backgroundColor: isDarkMode ? '#000000' : 'inherit'
      }
    }}>
      {renderContent()}
    </Box>
  );
};

export default DashboardPage;
