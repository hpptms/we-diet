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
    }, [deferredPrompt]);

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

    return {
        showInstallButton,
        installSnackbar,
        handleInstallClick,
        handleSnackbarClose,
    };
};
