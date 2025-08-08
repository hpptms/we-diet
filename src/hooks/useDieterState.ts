import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { serverProfileState, profileSettingsState } from '../recoil/profileSettingsAtom';
import { dieterApi, LegacyRecommendedUser as ApiRecommendedUser } from '../api/dieterApi';
import { postsApi } from '../api/postsApi';
import { Post, TrendingTopic, RecommendedUser } from '../component/Dieter/types';
import { useFollowCounts } from '../component/Dieter/layout/LeftSidebar/hooks/useFollowCounts';
import { useNotificationManager } from './useNotificationManager';
import { useMessageManager } from './useMessageManager';

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

export const useDieterState = (onViewChange?: (view: CurrentView) => void) => {
    const serverProfile = useRecoilValue(serverProfileState);
    const profileSettings = useRecoilValue(profileSettingsState);
    const navigate = useNavigate();
    const { followCounts, refreshFollowCounts } = useFollowCounts();
    const notificationManager = useNotificationManager();
    const messageManager = useMessageManager();

    // Core state
    const [posts, setPosts] = useState<Post[]>([]);
    const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletedPostIds, setDeletedPostIds] = useState<Set<number>>(() => {
        // localStorageから削除されたIDを復元
        try {
            const saved = localStorage.getItem('dieter_deleted_post_ids');
            const savedTimestamp = localStorage.getItem('dieter_deleted_post_ids_timestamp');
            if (saved && savedTimestamp) {
                const parsedIds = JSON.parse(saved);
                const timestamp = parseInt(savedTimestamp);
                const now = Date.now();
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7日間

                // 7日以上前のデータは削除
                if (now - timestamp > maxAge) {
                    localStorage.removeItem('dieter_deleted_post_ids');
                    localStorage.removeItem('dieter_deleted_post_ids_timestamp');
                    return new Set();
                }

                return new Set(parsedIds);
            }
        } catch (error) {
            // 削除された投稿IDの復元に失敗 - サイレント処理
        }
        return new Set();
    });
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);

    // View state
    const [showFollowManagement, setShowFollowManagement] = useState(false);
    const [showFollowingPosts, setShowFollowingPosts] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Post[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    // Modal state
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // Mobile UI state
    const [showMobileLeftSidebar, setShowMobileLeftSidebar] = useState(false);
    const [showMobileRightSidebar, setShowMobileRightSidebar] = useState(false);

    // deletedPostIdsをlocalStorageに保存するsetterをラップ
    const setDeletedPostIdsWithStorage = (ids: Set<number> | ((prev: Set<number>) => Set<number>)) => {
        setDeletedPostIds((prev) => {
            const newIds = typeof ids === 'function' ? ids(prev) : ids;
            try {
                localStorage.setItem('dieter_deleted_post_ids', JSON.stringify(Array.from(newIds)));
                localStorage.setItem('dieter_deleted_post_ids_timestamp', Date.now().toString());
            } catch (error) {
                // 削除された投稿IDの保存に失敗 - サイレント処理
            }
            return newIds;
        });
    };

    return {
        // State
        posts,
        recommendedUsers,
        loading,
        deletedPostIds,
        trendingTopics,
        showFollowManagement,
        showFollowingPosts,
        showMessages,
        showNotifications,
        searchQuery,
        searchResults,
        isSearching,
        searchLoading,
        isPostModalOpen,
        showMobileLeftSidebar,
        showMobileRightSidebar,
        serverProfile,
        profileSettings,
        followCounts,
        notificationManager,
        messageManager,

        // Setters
        setPosts,
        setRecommendedUsers,
        setLoading,
        setDeletedPostIds: setDeletedPostIdsWithStorage,
        setTrendingTopics,
        setShowFollowManagement,
        setShowFollowingPosts,
        setShowMessages,
        setShowNotifications,
        setSearchQuery,
        setSearchResults,
        setIsSearching,
        setSearchLoading,
        setIsPostModalOpen,
        setShowMobileLeftSidebar,
        setShowMobileRightSidebar,

        // Utils
        navigate,
        refreshFollowCounts,
        onViewChange
    };
};
