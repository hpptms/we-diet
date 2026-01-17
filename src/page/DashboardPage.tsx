import React, { useEffect, Suspense, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import DashboardPageButtons from "../component/DashboardPageButtons";
import { useTranslation } from "../hooks/useTranslation";
import { setLanguageToEnglish, setLanguageToJapanese, setLanguageToChineseCN, setLanguageToKorean, setLanguageToSpanish } from "../i18n";

// Lazy load heavy components
const ProfileSettings = React.lazy(() => import("./MainContent/ProfileSettings"));
const ExerciseRecord = React.lazy(() => import("./MainContent/ExerciseRecord"));
const WeightManagement = React.lazy(() => import("./MainContent/WeightManagement"));
const FoodLog = React.lazy(() => import("./MainContent/FoodLog"));
const Dieter = React.lazy(() => import("./MainContent/Dieter"));
const DebugLogViewer = React.lazy(() => import("./MainContent/DebugLogViewer"));
import { useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeState } from "../recoil/darkModeAtom";
import { weightRecordedDateAtom } from "../recoil/weightRecordedDateAtom";
import { clearWeightCacheAtom, weightRecordCacheAtom } from "../recoil/weightRecordCacheAtom";
import { profileSettingsState, convertServerProfileToLocalProfile } from "../recoil/profileSettingsAtom";
import { useToast } from "../hooks/useToast";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useDashboardAnimation } from "../hooks/useDashboardAnimation";
import { useAdminPermission } from "../hooks/useAdminPermission";
import ToastProvider from "../component/ToastProvider";

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter' | 'debug';

const getAccountName = (t: ReturnType<typeof useTranslation>['t']) => {
    return localStorage.getItem("accountName") || t('common', 'user', {}, 'ユーザー');
};

interface DashboardPageProps {
    initialView?: CurrentView;
    subView?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ initialView, subView }) => {
    const { t, language, setLanguage } = useTranslation();
    const accountName = getAccountName(t);
    const navigate = useNavigate();
    const location = useLocation();
    const isDarkMode = useRecoilValue(darkModeState);
    const { toast, hideToast } = useToast();

    // デバッグ用: 英語テスト関数
    const switchToEnglishForTest = () => {
        setLanguageToEnglish();
        setLanguage('en');
        console.log('🔄 言語を英語に切り替えました (テスト用)');
    };

    // デバッグ用: 日本語に戻す関数
    const switchToJapaneseForTest = () => {
        setLanguageToJapanese();
        setLanguage('ja');
        console.log('🔄 言語を日本語に戻しました');
    };

    // デバッグ用: 中国語テスト関数
    const switchToChineseForTest = () => {
        setLanguageToChineseCN();
        setLanguage('zh-CN');
        console.log('🔄 言語を中国語(簡体字)に切り替えました (テスト用)');
    };

    // デバッグ用: 韓国語テスト関数
    const switchToKoreanForTest = () => {
        setLanguageToKorean();
        setLanguage('ko');
        console.log('🔄 言語を韓国語に切り替えました (テスト用)');
    };

    // デバッグ用: スペイン語テスト関数
    const switchToSpanishForTest = () => {
        setLanguageToSpanish();
        setLanguage('es');
        console.log('🔄 言語をスペイン語に切り替えました (テスト用)');
    };

    // デバッグ用: コンソールに関数を公開
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).switchToEnglishForTest = switchToEnglishForTest;
            (window as any).switchToJapaneseForTest = switchToJapaneseForTest;
            (window as any).switchToChineseForTest = switchToChineseForTest;
            (window as any).switchToKoreanForTest = switchToKoreanForTest;
            (window as any).switchToSpanishForTest = switchToSpanishForTest;
            console.log('🌐 多言語テスト用デバッグ関数が利用可能です:');
            console.log('  switchToEnglishForTest() - 英語表示に切り替え');
            console.log('  switchToJapaneseForTest() - 日本語表示に切り替え');
            console.log('  switchToChineseForTest() - 中国語(簡体字)表示に切り替え');
            console.log('  switchToKoreanForTest() - 韓国語表示に切り替え');
            console.log('  switchToSpanishForTest() - スペイン語表示に切り替え');
            console.log('  現在の言語:', language);
        }
    }, [language]);

    // 新しいフックを使用
    const {
        showInstallButton,
        installSnackbar,
        handleInstallClick,
        handleSnackbarClose,
    } = usePWAInstall({
        installed: t('common', 'pwa.installed', {}, 'We Dietがホーム画面に追加されました！'),
        iosInstallInstruction: t('common', 'pwa.iosInstallInstruction', {}, 'Safari で「共有」→「ホーム画面に追加」を選択してください'),
        browserInstallInstruction: t('common', 'pwa.browserInstallInstruction', {}, 'ブラウザの右上メニュー「アプリをインストール」からPWAとしてインストールできます'),
        unsupportedBrowser: t('common', 'pwa.unsupportedBrowser', {}, 'このブラウザではPWAインストールがサポートされていません'),
        installing: t('common', 'pwa.installing', {}, 'We Dietをインストール中です...'),
        installCancelled: t('common', 'pwa.installCancelled', {}, 'インストールがキャンセルされました'),
        installError: t('common', 'pwa.installError', {}, 'インストール中にエラーが発生しました')
    });

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

    // 管理者権限チェック
    const { isAdmin, loading: adminLoading } = useAdminPermission();

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
        } else if (view === "debug") {
            navigate("/DebugLog");
        }
    };

    // ソーシャルログイン（Google・Facebook等）のコールバック処理
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const userId = urlParams.get('user_id');
        const accountName = urlParams.get('account_name');
        const error = urlParams.get('error');

        if (error) {
            console.error('Social login error:', error);
            alert(t('errors', 'loginError', { error }, 'ソーシャルログインでエラーが発生しました: ' + error));
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
            // ソーシャルログインのコールバックでない場合のみ実行
            fetchUserProfile(userId);
        }
    }, []); // 初回のみ実行

    // メインコンテナのref（overflow: autoのコンテナ用）
    const containerRef = useRef<HTMLDivElement>(null);

    // スクロールをトップにリセットする関数（全てのスクロール可能な要素をリセット）
    const scrollToTop = () => {
        // windowのスクロール
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // overflow: autoのコンテナのスクロールもリセット
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }

        // 全てのスクロール可能な要素をリセット
        const scrollableElements = document.querySelectorAll('[style*="overflow"]');
        scrollableElements.forEach(el => {
            if (el instanceof HTMLElement) {
                el.scrollTop = 0;
            }
        });
    };

    // ブラウザバック/フォワード時のスクロールリセット
    useEffect(() => {
        const handlePopState = () => {
            // 複数のタイミングでスクロールリセットを試みる
            scrollToTop();
            requestAnimationFrame(() => {
                scrollToTop();
            });
            setTimeout(() => {
                scrollToTop();
            }, 50);
            setTimeout(() => {
                scrollToTop();
            }, 150);
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // URLに応じてcurrentViewを切り替え
    useEffect(() => {
        if (location.pathname === "/ProfileSettings") {
            setCurrentView("profile");
        } else if (location.pathname === "/Dashboard" || location.pathname === "/dashboard") {
            setCurrentView("dashboard");
        } else if (location.pathname === "/WeightManagement") {
            setCurrentView("weight");
        } else if (location.pathname === "/FoodLog") {
            setCurrentView("FoodLog");
        } else if (location.pathname === "/Dieter") {
            setCurrentView("dieter");
        } else if (location.pathname === "/Exercise") {
            setCurrentView("exercise");
        } else if (location.pathname === "/DebugLog") {
            setCurrentView("debug");
        }

        // ページ遷移時に常にスクロールをトップにリセット
        scrollToTop();
        // ブラウザのスクロール復元が発生する可能性があるため、遅延してもう一度リセット
        requestAnimationFrame(() => {
            scrollToTop();
        });
        setTimeout(() => {
            scrollToTop();
        }, 100);
    }, [location.pathname, setCurrentView]);

    const renderContent = () => {
        const handleBackToDashboard = () => {
            handleViewChange('dashboard');
        };

        const LoadingSpinner = () => (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '200px' 
            }}>
                <CircularProgress size={40} sx={{ color: '#29b6f6' }} />
            </Box>
        );

        const contentToRender = (() => {
            switch (currentView) {
                case 'profile':
                    return (
                        <Suspense fallback={<LoadingSpinner />}>
                            <ProfileSettings onBack={handleBackToDashboard} />
                        </Suspense>
                    );
                case 'exercise':
                    return (
                        <Suspense fallback={<LoadingSpinner />}>
                            <ExerciseRecord onBack={handleBackToDashboard} />
                        </Suspense>
                    );
                case 'weight':
                    return (
                        <Suspense fallback={<LoadingSpinner />}>
                            <WeightManagement onBack={() => { 
                                setClearWeightCache(true);
                                setWeightCache({
                                    monthlyRecords: {},
                                    yearlyRecords: {},
                                    currentDate: new Date(),
                                    viewPeriod: 'month'
                                });
                                handleBackToDashboard();
                            }} />
                        </Suspense>
                    );
                case 'FoodLog':
                    return (
                        <Suspense fallback={<LoadingSpinner />}>
                            <FoodLog onBack={handleBackToDashboard} />
                        </Suspense>
                    );
                case 'dieter':
                    return (
                        <Suspense fallback={<LoadingSpinner />}>
                            <Dieter 
                                onBack={handleBackToDashboard}
                                onViewChange={handleViewChange}
                                subView={subView}
                            />
                        </Suspense>
                    );
                case 'debug':
                    return (
                        <Suspense fallback={<LoadingSpinner />}>
                            <DebugLogViewer onBack={handleBackToDashboard} />
                        </Suspense>
                    );
                default:
                    return (
                        <DashboardPageButtons 
                            onViewChange={handleViewChange} 
                            hasWeightInput={hasWeightInput} 
                            showInstallButton={showInstallButton}
                            onInstallClick={handleInstallClick}
                            isAdmin={isAdmin}
                            adminLoading={adminLoading}
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
    <Box
      ref={containerRef}
      sx={{
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
      {/* デバッグ用: 言語テストボタン */}
      {window.location.hostname === '192.168.1.22' && (
        <Box sx={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 10000,
          display: 'flex',
          gap: 1,
          flexDirection: 'column'
        }}>
          <button
            onClick={switchToEnglishForTest}
            style={{
              backgroundColor: language === 'en' ? '#4caf50' : '#2196f3',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇺🇸 EN
          </button>
          <button
            onClick={switchToJapaneseForTest}
            style={{
              backgroundColor: language === 'ja' ? '#4caf50' : '#ff9800',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇯🇵 JP
          </button>
          <button
            onClick={switchToChineseForTest}
            style={{
              backgroundColor: language === 'zh-CN' ? '#4caf50' : '#9c27b0',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇨🇳 CN
          </button>
          <button
            onClick={switchToKoreanForTest}
            style={{
              backgroundColor: language === 'ko' ? '#4caf50' : '#f44336',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇰🇷 KO
          </button>
          <button
            onClick={switchToSpanishForTest}
            style={{
              backgroundColor: language === 'es' ? '#4caf50' : '#795548',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇪🇸 ES
          </button>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            textAlign: 'center'
          }}>
            {language.toUpperCase()}
          </div>
        </Box>
      )}
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
