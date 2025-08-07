import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Snackbar, Alert } from "@mui/material";
import DashboardPageButtons from "../component/DashboardPageButtons";
import ProfileSettings from "./MainContent/ProfileSettings";
import ExerciseRecord from "./MainContent/ExerciseRecord";
import WeightManagement from "./MainContent/WeightManagement";
import FoodLog from "./MainContent/FoodLog";
import Dieter from "./MainContent/Dieter";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState } from "../recoil/darkModeAtom";
import { weightRecordedDateAtom } from "../recoil/weightRecordedDateAtom";
import { clearWeightCacheAtom, weightRecordCacheAtom } from "../recoil/weightRecordCacheAtom";
import { profileSettingsState, convertServerProfileToLocalProfile } from "../recoil/profileSettingsAtom";
import { useToast } from "../hooks/useToast";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useDashboardAnimation } from "../hooks/useDashboardAnimation";
import ToastProvider from "../component/ToastProvider";

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

const getAccountName = () => {
    return localStorage.getItem("accountName") || "ユーザー";
};

interface DashboardPageProps {
    initialView?: CurrentView;
    subView?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ initialView, subView }) => {
    const accountName = getAccountName();
    const navigate = useNavigate();
    const location = useLocation();
    const isDarkMode = useRecoilValue(darkModeState);
    const { toast, hideToast } = useToast();

    // 新しいフックを使用
    const {
        showInstallButton,
        installSnackbar,
        handleInstallClick,
        handleSnackbarClose,
    } = usePWAInstall();

    const {
        currentView,
        previousView,
        isAnimating,
        animationDirection,
        setCurrentView,
        setPreviousView,
        setIsAnimating,
        setAnimationDirection,
        getAnimationDuration,
        getAnimationClass,
        getAnimationStyles,
    } = useDashboardAnimation(initialView || 'dashboard');

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
        // 既に同じビューの場合は何もしない
        if (view === currentView) return;

        // アニメーション中の場合は処理を無視
        if (isAnimating) return;

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

        // ダッシュボードから他の画面への遷移
        if (currentView === 'dashboard' && view !== 'dashboard') {
            setIsAnimating(true);
            setAnimationDirection('slideIn');
            setPreviousView(currentView);
            
            const animationTime = getAnimationDuration(view, 'slideIn');
            setCurrentView(view);
            
            setTimeout(() => {
                setIsAnimating(false);
            }, animationTime);
        }
        // 他の画面からダッシュボードへの遷移
        else if (currentView !== 'dashboard' && view === 'dashboard') {
            setIsAnimating(true);
            setAnimationDirection('slideOut');
            
            const animationTime = getAnimationDuration(currentView, 'slideOut');
            setTimeout(() => {
                setPreviousView(currentView);
                setCurrentView(view);
                setIsAnimating(false);
            }, animationTime);
        }
        // 通常の遷移（アニメーション無し）
        else {
            setPreviousView(currentView);
            setCurrentView(view);
        }

        // URL navigation
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
        } else if (location.pathname === "/Exercise") {
            setCurrentView("exercise");
        }
    }, [location.pathname, setCurrentView]);

    // ダッシュボードに戻った時に一番上にスクロール
    useEffect(() => {
        if (currentView === 'dashboard') {
            window.scrollTo(0, 0);
        }
    }, [currentView]);

    const renderContent = () => {
        const handleBackToDashboard = () => {
            handleViewChange('dashboard');
        };

        const contentToRender = (() => {
            switch (currentView) {
                case 'profile':
                    return <ProfileSettings onBack={handleBackToDashboard} />;
                case 'exercise':
                    return <ExerciseRecord onBack={handleBackToDashboard} />;
                case 'weight':
                    return <WeightManagement onBack={() => { 
                        setClearWeightCache(true);
                        setWeightCache({
                            monthlyRecords: {},
                            yearlyRecords: {},
                            currentDate: new Date(),
                            viewPeriod: 'month'
                        });
                        handleBackToDashboard();
                    }} />;
                case 'FoodLog':
                    return <FoodLog onBack={handleBackToDashboard} />;
                case 'dieter':
                    return <Dieter 
                        onBack={handleBackToDashboard}
                        onViewChange={handleViewChange}
                        subView={subView}
                    />;
                default:
                    return (
                        <DashboardPageButtons 
                            onViewChange={handleViewChange} 
                            hasWeightInput={hasWeightInput} 
                            showInstallButton={showInstallButton}
                            onInstallClick={handleInstallClick}
                        />
                    );
            }
        })();

        return (
            <Box
                className={getAnimationClass()}
                sx={getAnimationStyles()}
            >
                {contentToRender}
            </Box>
        );
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
      
      {/* 共通トースト */}
      <ToastProvider toast={toast} onClose={hideToast} />
      
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
