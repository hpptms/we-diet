import { useState, useEffect, useCallback, useRef } from 'react';
import { dieterApi } from '../api/dieterApi';

export interface Message {
    ID: number;
    SenderID: number;
    ReceiverID: number;
    Content: string;
    IsRead: boolean;
    SenderName: string;
    SenderPicture: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface Conversation {
    user_id: number;
    user_name: string;
    user_picture: string;
    last_message: string;
    last_message_at: string;
    unread_count: number;
    is_sender: boolean;
}

export interface MessageState {
    conversations: Conversation[];
    messages: Message[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

export const useMessageManager = () => {
    const [state, setState] = useState<MessageState>({
        conversations: [],
        messages: [],
        unreadCount: 0,
        loading: false,
        error: null
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 会話一覧を取得
    const fetchConversations = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const response = await dieterApi.getMessageConversations();

            setState(prev => ({
                ...prev,
                conversations: response.conversations || [],
                loading: false
            }));

            // 会話一覧取得完了（サイレント処理）
        } catch (error) {
            // 会話一覧の取得に失敗（サイレント処理）
            setState(prev => ({
                ...prev,
                error: '会話一覧の取得に失敗しました',
                loading: false
            }));
        }
    }, []);

    // 特定ユーザーとのメッセージを取得
    const fetchMessages = useCallback(async (userId: number, page: number = 1, limit: number = 50) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const response = await dieterApi.getMessages(userId, page, limit);

            setState(prev => ({
                ...prev,
                messages: response.messages || [],
                loading: false
            }));

            // メッセージ取得完了（サイレント処理）
        } catch (error) {
            // メッセージの取得に失敗（サイレント処理）
            setState(prev => ({
                ...prev,
                error: 'メッセージの取得に失敗しました',
                loading: false
            }));
        }
    }, []);

    // 未読メッセージ数を取得
    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await dieterApi.getUnreadMessageCount();

            setState(prev => ({
                ...prev,
                unreadCount: response.unread_count || 0
            }));

            // 未読メッセージ数取得完了（サイレント処理）
        } catch (error) {
            // 未読メッセージ数の取得に失敗（サイレント処理）
        }
    }, []);

    // メッセージを送信
    const sendMessage = useCallback(async (receiverId: number, content: string) => {
        try {
            const newMessage = await dieterApi.sendMessage({
                receiver_id: receiverId,
                content: content
            });

            // ローカル状態を更新
            setState(prev => ({
                ...prev,
                messages: [newMessage, ...prev.messages]
            }));

            // 会話一覧を更新
            await fetchConversations();

            // メッセージ送信完了（サイレント処理）
            return newMessage;
        } catch (error) {
            // メッセージの送信に失敗（サイレント処理）
            throw error;
        }
    }, [fetchConversations]);

    // リアルタイムメッセージチェックの開始
    const startMessagePolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // 30秒間隔で未読メッセージ数をチェック
        intervalRef.current = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        // メッセージポーリング開始（サイレント処理）
    }, [fetchUnreadCount]);

    // リアルタイムメッセージチェックの停止
    const stopMessagePolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            // メッセージポーリング停止（サイレント処理）
        }
    }, []);

    // 初期化
    useEffect(() => {
        // 初期データ取得
        fetchUnreadCount();

        // ポーリング開始
        startMessagePolling();

        // クリーンアップ
        return () => {
            stopMessagePolling();
        };
    }, [fetchUnreadCount, startMessagePolling, stopMessagePolling]);

    // ページ離脱時の処理
    useEffect(() => {
        const handleBeforeUnload = () => stopMessagePolling();

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            stopMessagePolling();
        };
    }, [stopMessagePolling]);

    return {
        // 状態
        conversations: state.conversations,
        messages: state.messages,
        unreadCount: state.unreadCount,
        loading: state.loading,
        error: state.error,

        // アクション
        fetchConversations,
        fetchMessages,
        fetchUnreadCount,
        sendMessage,

        // ユーティリティ
        clearError: () => setState(prev => ({ ...prev, error: null }))
    };
};
