import { useState, useEffect } from 'react';
import { postsApi } from '../../../../../api/postsApi';
import { Notification } from '../../../types';

export const useNotifications = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

    // 未読通知数を取得
    useEffect(() => {
        const fetchUnreadNotificationCount = async () => {
            try {
                const response = await postsApi.getUnreadNotificationCount();
                setUnreadNotificationCount(response.unread_count);
            } catch (error) {
                console.error('未読通知数の取得に失敗しました:', error);
            }
        };

        fetchUnreadNotificationCount();
        // 30秒ごとに更新
        const interval = setInterval(fetchUnreadNotificationCount, 30000);

        return () => clearInterval(interval);
    }, []);

    // 通知カウントをリセット
    const resetNotificationCount = () => {
        setUnreadNotificationCount(0);
    };

    // 通知クリックハンドラー
    const handleNotificationClick = () => {
        setShowNotifications(true);
        // 通知タブを開いた時点でカウントをリセット
        resetNotificationCount();
    };

    // 通知ページから戻る
    const handleBackFromNotifications = () => {
        setShowNotifications(false);
    };

    // 通知アイテムクリック（投稿に移動）
    const handleNotificationItemClick = (notification: Notification) => {
        console.log('通知アイテムクリック:', notification);
        // ここで投稿の詳細ページに移動する処理を実装
        setShowNotifications(false);
    };

    return {
        showNotifications,
        unreadNotificationCount,
        handleNotificationClick,
        handleBackFromNotifications,
        handleNotificationItemClick,
        resetNotificationCount
    };
};
