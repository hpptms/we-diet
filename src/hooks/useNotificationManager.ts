import { useState, useEffect, useCallback, useRef } from 'react';
import { dieterApi } from '../api/dieterApi';

export interface Notification {
    ID: number;
    UserID: number;
    FromUserID: number;
    PostID: number;
    Type: 'comment' | 'retweet' | 'like';
    Content: string;
    IsRead: boolean;
    FromUserName: string;
    FromUserPicture: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

export const useNotificationManager = () => {
    const [state, setState] = useState<NotificationState>({
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 通知一覧を取得
    const fetchNotifications = useCallback(async (unreadOnly: boolean = false) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const response = await dieterApi.getNotifications(1, 50, unreadOnly);

            setState(prev => ({
                ...prev,
                notifications: response.notifications || [],
                loading: false
            }));

            console.log('通知取得完了:', response.notifications?.length || 0, '件');
        } catch (error) {
            console.error('通知の取得に失敗しました:', error);
            setState(prev => ({
                ...prev,
                error: '通知の取得に失敗しました',
                loading: false
            }));
        }
    }, []);

    // 未読通知数を取得
    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await dieterApi.getUnreadNotificationCount();

            setState(prev => ({
                ...prev,
                unreadCount: response.unread_count || 0
            }));

            console.log('未読通知数:', response.unread_count);
        } catch (error) {
            console.error('未読通知数の取得に失敗しました:', error);
        }
    }, []);

    // 通知を既読にする
    const markNotificationAsRead = useCallback(async (notificationId: number) => {
        try {
            await dieterApi.markNotificationAsRead(notificationId);

            // ローカル状態を更新
            setState(prev => ({
                ...prev,
                notifications: prev.notifications.map(notification =>
                    notification.ID === notificationId
                        ? { ...notification, IsRead: true }
                        : notification
                ),
                unreadCount: Math.max(0, prev.unreadCount - 1)
            }));

            console.log('通知を既読にしました:', notificationId);
        } catch (error) {
            console.error('通知の既読処理に失敗しました:', error);
        }
    }, []);

    // 全ての通知を既読にする
    const markAllNotificationsAsRead = useCallback(async () => {
        try {
            await dieterApi.markAllNotificationsAsRead();

            // ローカル状態を更新
            setState(prev => ({
                ...prev,
                notifications: prev.notifications.map(notification => ({
                    ...notification,
                    IsRead: true
                })),
                unreadCount: 0
            }));

            console.log('全ての通知を既読にしました');
        } catch (error) {
            console.error('全ての通知の既読処理に失敗しました:', error);
        }
    }, []);

    // リアルタイム通知チェックの開始
    const startNotificationPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // 30秒間隔で未読通知数をチェック
        intervalRef.current = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        console.log('通知ポーリング開始 (30秒間隔)');
    }, [fetchUnreadCount]);

    // リアルタイム通知チェックの停止
    const stopNotificationPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log('通知ポーリング停止');
        }
    }, []);

    // 初期化
    useEffect(() => {
        // 初期データ取得
        fetchUnreadCount();

        // ポーリング開始
        startNotificationPolling();

        // クリーンアップ
        return () => {
            stopNotificationPolling();
        };
    }, [fetchUnreadCount, startNotificationPolling, stopNotificationPolling]);

    // ページ離脱時の処理
    useEffect(() => {
        const handleBeforeUnload = () => stopNotificationPolling();

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            stopNotificationPolling();
        };
    }, [stopNotificationPolling]);

    return {
        // 状態
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        loading: state.loading,
        error: state.error,

        // アクション
        fetchNotifications,
        fetchUnreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        // ユーティリティ
        clearError: () => setState(prev => ({ ...prev, error: null }))
    };
};
