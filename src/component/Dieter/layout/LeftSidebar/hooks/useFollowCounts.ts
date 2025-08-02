import { useState, useEffect } from 'react';
import { postsApi } from '../../../../../api/postsApi';
import { FollowCounts } from '../types';

export const useFollowCounts = () => {
    const [followCounts, setFollowCounts] = useState<FollowCounts>({
        followingCount: 0,
        followerCount: 0
    });

    useEffect(() => {
        const fetchFollowCounts = async () => {
            try {
                const counts = await postsApi.getFollowCounts();
                setFollowCounts({
                    followingCount: counts.following_count,
                    followerCount: counts.follower_count
                });
            } catch (error) {
                console.error('フォロー数の取得に失敗しました:', error);
                // エラー時はデフォルト値を使用
            }
        };

        fetchFollowCounts();
    }, []);

    return followCounts;
};
