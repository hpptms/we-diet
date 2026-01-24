/**
 * 統合ポーリングマネージャー
 *
 * パフォーマンス最適化のため、複数のポーリング処理を1つに統合します。
 * これにより、同時に複数のAPI呼び出しが発生することを防ぎます。
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { dieterApi } from '../api/dieterApi';
import { postsApi } from '../api/postsApi';

interface PollingState {
    unreadMessageCount: number;
    unreadNotificationCount: number;
    lastPolled: number | null;
    isPolling: boolean;
}

// ポーリング間隔(ミリ秒) - 30秒
const POLLING_INTERVAL = 30000;

// 最小ポーリング間隔(ミリ秒) - 過度な呼び出しを防ぐ
const MIN_POLLING_INTERVAL = 5000;

export const useUnifiedPollingManager = () => {
    const [state, setState] = useState<PollingState>({
        unreadMessageCount: 0,
        unreadNotificationCount: 0,
        lastPolled: null,
        isPolling: false
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isActiveRef = useRef<boolean>(true);

    // 統合されたポーリング関数(すべてのカウントを1回の処理で取得)
    const fetchAllCounts = useCallback(async () => {
        // 既にポーリング中の場合はスキップ
        if (state.isPolling) {
            return;
        }

        // 最小間隔を確保
        const now = Date.now();
        if (state.lastPolled && now - state.lastPolled < MIN_POLLING_INTERVAL) {
            return;
        }

        setState(prev => ({ ...prev, isPolling: true }));

        try {
            // Promise.allを使用して並列実行(順次実行よりも高速)
            const [messageResponse, notificationResponse] = await Promise.all([
                dieterApi.getUnreadMessageCount().catch(() => ({ unread_count: 0 })),
                postsApi.getUnreadNotificationCount().catch(() => ({ unread_count: 0 }))
            ]);

            setState(prev => ({
                ...prev,
                unreadMessageCount: messageResponse.unread_count || 0,
                unreadNotificationCount: notificationResponse.unread_count || 0,
                lastPolled: Date.now(),
                isPolling: false
            }));
        } catch (error) {
            console.error('統合ポーリングエラー:', error);
            setState(prev => ({
                ...prev,
                isPolling: false
            }));
        }
    }, [state.isPolling, state.lastPolled]);

    // ポーリング開始
    const startPolling = useCallback(() => {
        if (intervalRef.current) {
            return; // 既に開始している場合はスキップ
        }

        // 初回取得
        fetchAllCounts();

        // 定期ポーリング
        intervalRef.current = setInterval(() => {
            if (isActiveRef.current) {
                fetchAllCounts();
            }
        }, POLLING_INTERVAL);
    }, [fetchAllCounts]);

    // ポーリング停止
    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // タブの可視性に基づいてポーリングを制御
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // タブが非表示の場合はポーリングを停止
                isActiveRef.current = false;
                stopPolling();
            } else {
                // タブが表示された場合はポーリングを再開
                isActiveRef.current = true;
                startPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [startPolling, stopPolling]);

    // 初期化
    useEffect(() => {
        startPolling();

        return () => {
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    // 手動リフレッシュ
    const refresh = useCallback(() => {
        fetchAllCounts();
    }, [fetchAllCounts]);

    return {
        unreadMessageCount: state.unreadMessageCount,
        unreadNotificationCount: state.unreadNotificationCount,
        isPolling: state.isPolling,
        refresh,
        startPolling,
        stopPolling
    };
};
