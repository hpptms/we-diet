import { useEffect } from 'react';
import { dieterApi, LegacyRecommendedUser as ApiRecommendedUser } from '../api/dieterApi';
import { postsApi } from '../api/postsApi';
import { Post, TrendingTopic, RecommendedUser } from '../component/Dieter/types';

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

interface UseDieterLogicProps {
    // State
    showFollowingPosts: boolean;
    serverProfile: any;
    profileSettings: any;

    // Setters
    setPosts: (posts: Post[] | ((prev: Post[]) => Post[])) => void;
    setLoading: (loading: boolean) => void;
    setRecommendedUsers: (users: RecommendedUser[]) => void;
    setTrendingTopics: (topics: TrendingTopic[]) => void;
    setDeletedPostIds: (ids: Set<number> | ((prev: Set<number>) => Set<number>)) => void;
    setSearchResults: (results: Post[]) => void;
    setIsSearching: (searching: boolean) => void;
    setSearchLoading: (loading: boolean) => void;
    setSearchQuery: (query: string) => void;
    setShowFollowingPosts: (show: boolean) => void;
    setShowMessages: (show: boolean) => void;
    setShowNotifications: (show: boolean) => void;
    setShowFollowManagement: (show: boolean) => void;
    setIsPostModalOpen: (open: boolean) => void;

    // Utils
    navigate: any;
    refreshFollowCounts: () => Promise<void>;
    onViewChange?: (view: CurrentView) => void;
}

export const useDieterLogic = (props: UseDieterLogicProps) => {
    const {
        showFollowingPosts,
        serverProfile,
        profileSettings,
        setPosts,
        setLoading,
        setRecommendedUsers,
        setTrendingTopics,
        setDeletedPostIds,
        setSearchResults,
        setIsSearching,
        setSearchLoading,
        setSearchQuery,
        setShowFollowingPosts,
        setShowMessages,
        setShowNotifications,
        setShowFollowManagement,
        setIsPostModalOpen,
        navigate,
        refreshFollowCounts,
        onViewChange
    } = props;

    // Load posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                let response;
                if (showFollowingPosts) {
                    response = await dieterApi.getFollowingPosts();
                } else {
                    response = await dieterApi.getPosts();
                }
                setPosts(response.posts);
            } catch (error) {
                console.error('投稿の取得に失敗しました:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [showFollowingPosts]);

    // Load recommended users
    useEffect(() => {
        const CACHE_KEY = 'recommended_users_cache';
        const CACHE_DURATION = 5 * 60 * 1000; // 5分間

        const fetchRecommendedUsers = async () => {
            try {
                const currentUserId = serverProfile.userId || undefined;

                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { data, timestamp, cachedUserId } = JSON.parse(cachedData);
                    const now = Date.now();

                    if (cachedUserId !== currentUserId) {
                        localStorage.removeItem(CACHE_KEY);
                    } else if (now - timestamp < CACHE_DURATION) {
                        setRecommendedUsers(data);
                        return;
                    }
                }

                const response = await dieterApi.getRecommendedUsers(currentUserId);

                const convertedUsers: RecommendedUser[] = response.users.map((user: ApiRecommendedUser) => ({
                    id: user.id,
                    name: user.name || `ユーザー${user.id}`,
                    username: user.username ? `@${user.username}` : `@user${user.id}`,
                    avatar: user.avatar || (user.name ? user.name.charAt(0) : 'U'),
                    isFollowing: user.is_following
                }));

                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: convertedUsers,
                    timestamp: Date.now(),
                    cachedUserId: currentUserId
                }));

                setRecommendedUsers(convertedUsers);
            } catch (error) {
                setRecommendedUsers([
                    { id: 1, name: '健康太郎', username: '@kenkou_taro', avatar: 'K', isFollowing: false },
                    { id: 2, name: 'フィット花子', username: '@fit_hanako', avatar: 'F', isFollowing: false },
                    { id: 3, name: 'ダイエット次郎', username: '@diet_jiro', avatar: 'D', isFollowing: false },
                ]);
            }
        };

        fetchRecommendedUsers();

        const interval = setInterval(fetchRecommendedUsers, CACHE_DURATION);
        return () => clearInterval(interval);
    }, [serverProfile.userId]);

    // Load trending topics
    useEffect(() => {
        const TRENDING_CACHE_KEY = 'trending_topics_cache';
        const TRENDING_CACHE_DURATION = 30 * 60 * 1000; // 30分間

        const fetchTrendingTopics = async () => {
            try {
                const cachedData = localStorage.getItem(TRENDING_CACHE_KEY);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const now = Date.now();

                    if (now - timestamp < TRENDING_CACHE_DURATION) {
                        setTrendingTopics(data);
                        return;
                    }
                }

                const response = await dieterApi.getTrendingTopics();

                const convertedTopics: TrendingTopic[] = response.topics.map((topic) => ({
                    hashtag: topic.hashtag,
                    posts: topic.posts,
                }));

                localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify({
                    data: convertedTopics,
                    timestamp: Date.now(),
                }));

                setTrendingTopics(convertedTopics);
            } catch (error) {
                console.error('トレンドトピックの取得に失敗しました:', error);
                setTrendingTopics([]);
            }
        };

        fetchTrendingTopics();

        const interval = setInterval(fetchTrendingTopics, TRENDING_CACHE_DURATION);
        return () => clearInterval(interval);
    }, []);

    // Navigation handlers
    const handleNavigateToProfile = () => {
        if (onViewChange) {
            onViewChange('profile');
        }
    };

    const handleNavigateToExercise = () => {
        if (onViewChange) {
            onViewChange('exercise');
        }
    };

    const handleNavigateToFoodLog = () => {
        if (onViewChange) {
            onViewChange('FoodLog');
        }
    };

    const handleNavigateToFollowManagement = () => {
        navigate('/Dieter/Follow');
    };

    const handleNavigateToMessages = () => {
        setShowMessages(true);
    };

    const handleNavigateToNotifications = () => {
        setShowNotifications(true);
        setShowMessages(false);
    };

    const handleNavigateToHome = () => {
        setShowMessages(false);
        setShowNotifications(false);
        setShowFollowingPosts(false);
    };

    const handleToggleFollowingPosts = () => {
        setShowFollowingPosts(!showFollowingPosts);
    };

    const handleOpenPostModal = () => {
        setIsPostModalOpen(true);
    };

    const handleClosePostModal = () => {
        setIsPostModalOpen(false);
    };

    // Post handling
    const handlePost = async (content: string, images?: File[], isSensitive?: boolean) => {
        try {
            const postData = {
                content: content,
                images: images || [],
                is_sensitive: isSensitive || false
            };

            const newPost = await dieterApi.createPost(postData);

            setPosts((prevPosts: Post[]) => {
                const exists = prevPosts.find((post: Post) => post.ID === newPost.ID);
                if (exists) {
                    return prevPosts;
                }

                const updatedPosts = [newPost, ...prevPosts];
                return updatedPosts;
            });

            try {
                const response = await dieterApi.getPosts();
                const allPosts = response.posts;
                setPosts(allPosts);
                // 削除されたIDはリセットしない（削除された投稿は引き続き非表示に保つ）
            } catch (fetchError) {
                console.warn('投稿一覧の再取得に失敗しましたが、ローカル更新は成功しています:', fetchError);
            }

        } catch (error) {
            console.error('投稿の作成に失敗しました:', error);
            alert('投稿の作成に失敗しました。もう一度お試しください。');
            throw error;
        }
    };

    // Search handling
    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        setSearchLoading(true);

        try {
            const response = await dieterApi.searchPosts(query.trim());
            setSearchResults(response.posts);
        } catch (error) {
            console.error('検索に失敗しました:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    // Follow handling
    const handleFollow = async (userId: number) => {
        try {
            const result = await postsApi.toggleFollow(userId);

            await new Promise(resolve => setTimeout(resolve, 500));
            await refreshFollowCounts();

            setTimeout(async () => {
                try {
                    await refreshFollowCounts();
                } catch (error) {
                    console.error('フォロー数の再更新に失敗:', error);
                }
            }, 1000);

            const currentUserId = serverProfile.userId || undefined;
            const response = await dieterApi.getRecommendedUsers(currentUserId);

            const convertedUsers: RecommendedUser[] = response.users.map((user: ApiRecommendedUser) => ({
                id: user.id,
                name: user.name || `ユーザー${user.id}`,
                username: user.username ? `@${user.username}` : `@user${user.id}`,
                avatar: user.avatar || (user.name ? user.name.charAt(0) : 'U'),
                isFollowing: user.is_following
            }));

            setRecommendedUsers(convertedUsers);
            localStorage.removeItem('recommended_users_cache');

        } catch (error: any) {
            console.error('フォロー操作に失敗しました:', error);
            const errorMessage = error.response?.data?.error || error.message || 'フォロー操作に失敗しました。もう一度お試しください。';
            alert(`エラー: ${errorMessage}`);
        }
    };

    // Post deletion
    const handlePostDelete = async (postId: number) => {
        // 即座にローカル状態から削除
        setDeletedPostIds((prev: Set<number>) => new Set(Array.from(prev).concat(postId)));

        // サーバーから最新の投稿一覧を再取得
        try {
            let response;
            if (showFollowingPosts) {
                response = await dieterApi.getFollowingPosts();
            } else {
                response = await dieterApi.getPosts();
            }
            setPosts(response.posts);
            console.log('投稿削除後、投稿一覧を更新しました');
        } catch (error) {
            console.error('投稿削除後の投稿一覧の更新に失敗しました:', error);
        }
    };

    // Sensitive content filtering
    const filterSensitivePosts = (posts: Post[]): Post[] => {
        if (!profileSettings.enableSensitiveFilter) {
            return posts.filter(post => !post.IsSensitive);
        }
        return posts;
    };

    // Current user
    const currentUser = {
        name: 'ダイエッター太郎',
        avatar: undefined
    };

    return {
        handleNavigateToProfile,
        handleNavigateToExercise,
        handleNavigateToFoodLog,
        handleNavigateToFollowManagement,
        handleNavigateToMessages,
        handleNavigateToNotifications,
        handleNavigateToHome,
        handleToggleFollowingPosts,
        handleOpenPostModal,
        handleClosePostModal,
        handlePost,
        handleSearch,
        handleFollow,
        handlePostDelete,
        filterSensitivePosts,
        currentUser
    };
};
