import { useState, useEffect, useCallback } from 'react';
import { postsApi } from '../api/postsApi';

export interface FollowCountsState {
    followingCount: number;
    followerCount: number;
    loading: boolean;
    error: string | null;
}

export const useFollowCounts = () => {
    const [state, setState] = useState<FollowCountsState>({
        followingCount: 0,
        followerCount: 0,
        loading: false,
        error: null
    });

    // フォロー数を取得
    const fetchFollowCounts = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const response = await postsApi.getFollowCounts();

            setState(prev => ({
                ...prev,
                followingCount: response.following_count || 0,
                followerCount: response.follower_count || 0,
                loading: false
            }));

            // フォロー数取得完了（サイレント処理）
        } catch (error) {
            console.error('フォロー数の取得に失敗しました:', error);
            setState(prev => ({
                ...prev,
                error: 'フォロー数の取得に失敗しました',
                loading: false
            }));
        }
    }, []);

    // 初期化
    useEffect(() => {
        // JWTトークンが存在する場合のみフォロー数を取得
        const token = localStorage.getItem('jwt_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
        if (token) {
            fetchFollowCounts();
        }
    }, [fetchFollowCounts]);

    return {
        // 状態
        followingCount: state.followingCount,
        followerCount: state.followerCount,
        loading: state.loading,
        error: state.error,

        // アクション
        fetchFollowCounts,
        refreshFollowCounts: fetchFollowCounts,

        // ユーティリティ
        clearError: () => setState(prev => ({ ...prev, error: null }))
    };
};
