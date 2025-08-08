import { useState, useEffect } from 'react';

/**
 * PWAインストール機能を管理するカスタムフック
 */
export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [installSnackbar, setInstallSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'info' | 'warning' | 'error'
    });

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // デフォルトのプロンプトを防ぐ
            e.preventDefault();
            // 後で使用するためにイベントを保存
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        const handleAppInstalled = () => {
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

        if (isStandalone || isIOSStandalone) {
            setShowInstallButton(false);
        } else {
            // PWAインストールボタンを常に表示（PC、Mobile問わず）
            setShowInstallButton(true);

            // イベントリスナーを追加
            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.addEventListener('appinstalled', handleAppInstalled);

            // PWA条件を強制的にトリガー（開発用）
            const checkPWAReadiness = async () => {
                const manifestLink = document.head.querySelector('link[rel="manifest"]');
                const serviceWorkerSupported = 'serviceWorker' in navigator;

                if (serviceWorkerSupported && manifestLink) {
                    // Service Worker強制登録
                    try {
                        if ('serviceWorker' in navigator) {
                            const registration = await navigator.serviceWorker.register('/sw.js');

                            // Service Workerが更新されたかチェック
                            registration.addEventListener('updatefound', () => {
                                // Update found - silent handling
                            });
                        }
                    } catch (error) {
                        // Service Worker registration error - silent handling
                    }

                    // ユーザーエンゲージメントをシミュレート（クリック後に実行）
                    const triggerInstallPrompt = () => {
                        setTimeout(() => {
                            // Silent handling - no console output
                        }, 2000);
                    };

                    // 最初のクリック等でエンゲージメントをトリガー
                    document.addEventListener('click', triggerInstallPrompt, { once: true });
                }
            };

            checkPWAReadiness();
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [deferredPrompt]);

    // PWAインストールボタンのクリックハンドラー
    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // iOS Safari用の案内
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
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

            if (isChrome || isEdge) {
                setInstallSnackbar({
                    open: true,
                    message: 'ブラウザの右上メニュー「アプリをインストール」からPWAとしてインストールできます',
                    severity: 'info'
                });
                return;
            }

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

    return {
        showInstallButton,
        installSnackbar,
        handleInstallClick,
        handleSnackbarClose,
    };
};
