import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { Add as AddIcon, Home as HomeIcon } from "@mui/icons-material";
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
  subView?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ initialView, subView }) => {
  const accountName = getAccountName();
  const [currentView, setCurrentView] = useState<CurrentView>(initialView || 'dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useRecoilValue(darkModeState);

  // PWA Install関連の状態
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [installSnackbar, setInstallSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'info' | 'warning' | 'error' });

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/proto/user_profile/${userId}`);

      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData.profile) {
          // UserProfileからProfileSettingsStateに変換してRecoilに設定
          const convertedProfile = convertServerProfileToLocalProfile(responseData.profile);
          setProfileSettings(convertedProfile);
        }
      } else if (response.status === 404) {
        // プロフィールが見つからない（初回ログイン）
        // ログ出力なし
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

  // ダッシュボードに戻った時に一番上にスクロール
  useEffect(() => {
    if (currentView === 'dashboard') {
      window.scrollTo(0, 0);
    }
  }, [currentView]);

  // PWAインストールプロンプトの処理
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt イベントが発生しました');
      // デフォルトのプロンプトを防ぐ
      e.preventDefault();
      // 後で使用するためにイベントを保存
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log('PWAアプリがインストールされました');
      setInstallSnackbar({ 
        open: true, 
        message: 'We Dietがホーム画面に追加されました！', 
        severity: 'success' 
      });
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    // 既にPWAとしてインストールされているかチェック
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone;
    
    console.log('PWA状態チェック:', { isStandalone, isIOSStandalone });
    
    if (isStandalone || isIOSStandalone) {
      console.log('既にPWAとしてインストール済み');
      setShowInstallButton(false);
    } else {
      console.log('PWAインストールボタンを表示');
      // PWAインストールボタンを常に表示（PC、Mobile問わず）
      setShowInstallButton(true);
      
      // イベントリスナーを追加
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      
      // PWA条件を強制的にトリガー（開発用）
      const checkPWAReadiness = async () => {
        const manifestLink = document.head.querySelector('link[rel="manifest"]');
        const serviceWorkerSupported = 'serviceWorker' in navigator;
        
        console.log('PWA チェック結果:', {
          serviceWorkerSupported,
          manifestLinkExists: !!manifestLink,
          isHTTPS: window.location.protocol === 'https:' || window.location.hostname === 'localhost'
        });
        
        if (serviceWorkerSupported && manifestLink) {
          console.log('PWA要件が満たされています');
          
          // Service Worker強制登録
          try {
            if ('serviceWorker' in navigator) {
              const registration = await navigator.serviceWorker.register('/sw.js');
              console.log('Service Worker登録成功:', registration);
              
              // Service Workerが更新されたかチェック
              registration.addEventListener('updatefound', () => {
                console.log('Service Workerの更新が見つかりました');
              });
            }
          } catch (error) {
            console.error('Service Worker登録エラー:', error);
          }
          
          // ユーザーエンゲージメントをシミュレート（クリック後に実行）
          const triggerInstallPrompt = () => {
            console.log('ユーザーエンゲージメント発生 - PWAプロンプトを待機中');
            setTimeout(() => {
              if (!deferredPrompt) {
                console.log('beforeinstallpromptが発生しませんでした - 手動プロンプト戦略を使用');
                console.log('可能な原因: ');
                console.log('1. PWAがすでにインストール済み');
                console.log('2. ブラウザがPWAインストールバナーの表示を決定しない');
                console.log('3. HTTPSでない、またはその他のPWA要件が満たされていない');
              }
            }, 2000);
          };
          
          // 最初のクリック等でエンゲージメントをトリガー
          document.addEventListener('click', triggerInstallPrompt, { once: true });
          
        } else {
          console.log('PWA要件が満たされていません');
        }
      };
      
      checkPWAReadiness();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // PWAインストールボタンのクリックハンドラー
  const handleInstallClick = async () => {
    console.log('PWAインストールボタンがクリックされました');
    console.log('deferredPrompt:', deferredPrompt);
    console.log('User Agent:', navigator.userAgent);
    
    if (!deferredPrompt) {
      // iOS Safari用の案内
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        console.log('iOS Safariとして判定');
        setInstallSnackbar({
          open: true,
          message: 'Safari で「共有」→「ホーム画面に追加」を選択してください',
          severity: 'info'
        });
        return;
      }
      
      // PC Chrome/Edge等でのブラウザメニューによるインストール案内
      const isChrome = /Chrome/.test(navigator.userAgent);
      const isEdge = /Edg/.test(navigator.userAgent);
      
      console.log('Chrome判定:', isChrome, 'Edge判定:', isEdge);
      
      if (isChrome || isEdge) {
        console.log('Chrome/Edgeのメニューインストール案内を表示');
        setInstallSnackbar({
          open: true,
          message: 'ブラウザの右上メニュー「アプリをインストール」からPWAとしてインストールできます',
          severity: 'info'
        });
        return;
      }
      
      console.log('PWAインストール非対応ブラウザ');
      setInstallSnackbar({
        open: true,
        message: 'このブラウザではPWAインストールがサポートされていません',
        severity: 'warning'
      });
      return;
    }

    try {
      // インストールプロンプトを表示
      deferredPrompt.prompt();
      
      // ユーザーの選択を待機
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setInstallSnackbar({ 
          open: true, 
          message: 'We Dietをインストール中です...', 
          severity: 'info' 
        });
      } else {
        setInstallSnackbar({ 
          open: true, 
          message: 'インストールがキャンセルされました', 
          severity: 'warning' 
        });
      }
      
      // プロンプトをクリア
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('PWAインストールエラー:', error);
      setInstallSnackbar({ 
        open: true, 
        message: 'インストール中にエラーが発生しました', 
        severity: 'error' 
      });
    }
  };

  const handleSnackbarClose = () => {
    setInstallSnackbar({ ...installSnackbar, open: false });
  };

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
          subView={subView}
        />;
      default:
        return (
          <>
            <DashboardPageButtons 
              onViewChange={handleViewChange} 
              hasWeightInput={hasWeightInput} 
              showInstallButton={showInstallButton}
              onInstallClick={handleInstallClick}
            />
          </>
        );
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: isDarkMode ? '#000000' : 'transparent',
      minHeight: {
        xs: 'calc(100vh - 200px)', // スマホ・縦画面: フッター完全表示のため更に余裕を持たせる
        sm: 'calc(100vh - 150px)',  // タブレット: フッター表示のため余裕を持たせる
        md: '100vh'                // デスクトップ: 従来通り
      },
      maxHeight: {
        xs: 'calc(100vh - 200px)', // スマホでは最大高さも制限
        sm: 'calc(100vh - 150px)',
        md: 'none'
      },
      width: '100%',
      margin: 0,
      padding: 0,
      color: isDarkMode ? '#ffffff' : 'inherit',
      overflow: {
        xs: 'auto', // スマホでスクロール可能
        md: 'visible'  // デスクトップでは通常通り
      },
      '& > *': {
        backgroundColor: isDarkMode ? '#000000' : 'inherit'
      }
    }}>
      {renderContent()}
      
      {/* インストール結果のスナックバー */}
      <Snackbar
        open={installSnackbar.open}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          zIndex: 9999,
          '& .MuiSnackbarContent-root': {
            minWidth: '350px'
          }
        }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={installSnackbar.severity}
          variant="filled"
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '350px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            backgroundColor: isDarkMode ? (
              installSnackbar.severity === 'success' ? '#2e7d32' :
              installSnackbar.severity === 'info' ? '#1976d2' :
              installSnackbar.severity === 'warning' ? '#ed6c02' : '#d32f2f'
            ) : (
              installSnackbar.severity === 'success' ? '#4caf50' :
              installSnackbar.severity === 'info' ? '#2196f3' :
              installSnackbar.severity === 'warning' ? '#ff9800' : '#f44336'
            )
          }}
        >
          {installSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;
