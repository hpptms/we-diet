import { useState, useEffect, useCallback } from 'react';
import { postsApi } from '../../../../../api/postsApi';
import { FollowCounts } from '../types';

export const useFollowCounts = () => {
    const [followCounts, setFollowCounts] = useState<FollowCounts>({
        followingCount: 0,
        followerCount: 0
    });

    const fetchFollowCounts = useCallback(async () => {
        try {
            const counts = await postsApi.getFollowCounts();
            const newFollowCounts = {
                followingCount: counts.following_count,
                followerCount: counts.follower_count
            };
            setFollowCounts(newFollowCounts);
        } catch (error: any) {
            console.error('フォロー数の取得に失敗しました:', error);
            // エラー時はデフォルト値を使用
        }
    }, []);

    useEffect(() => {
        fetchFollowCounts();
    }, [fetchFollowCounts]);

    return { followCounts, refreshFollowCounts: fetchFollowCounts };
};
