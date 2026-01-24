import { useState, useEffect } from 'react';
import { postsApi } from '../../../../../api/postsApi';

export const useMessages = () => {
    const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);
    const [showMessages, setShowMessages] = useState<boolean>(false);

    // 未読メッセージ数を取得する関数
    const fetchUnreadMessageCount = async () => {
        try {
            const response = await postsApi.getUnreadMessageCount();
            setUnreadMessageCount(response.unread_count);
        } catch (error) {
            console.error('未読メッセージ数の取得に失敗しました:', error);
            // エラー時は0にリセット
            setUnreadMessageCount(0);
        }
    };

    // 注意: ポーリング処理は useUnifiedPollingManager に統合されました
    // 初回取得のみ実行(定期ポーリングは統合マネージャーが担当)
    useEffect(() => {
        fetchUnreadMessageCount();
    }, []);

    // メッセージページに移動するハンドラー
    const handleMessageClick = () => {
        setShowMessages(true);
    };

    // メッセージページから戻るハンドラー
    const handleBackFromMessages = () => {
        setShowMessages(false);
        // メッセージページから戻ったときに未読数を再取得
        fetchUnreadMessageCount();
    };

    return {
        unreadMessageCount,
        showMessages,
        handleMessageClick,
        handleBackFromMessages,
        refreshUnreadCount: fetchUnreadMessageCount
    };
};
