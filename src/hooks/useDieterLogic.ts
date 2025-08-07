import { useEffect, useCallback, useRef } from 'react';
import { dieterApi, LegacyRecommendedUser as ApiRecommendedUser } from '../api/dieterApi';
import { postsApi } from '../api/postsApi';
import { Post, TrendingTopic, RecommendedUser } from '../component/Dieter/types';

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

interface UseDieterLogicProps {
    // State
    showFollowingPosts: boolean;
    serverProfile: any;
    profileSettings: any;
    notificationManager: any;
    messageManager: any;

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
        notificationManager,
        messageManager,
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

    // リアルタイム更新のためのインターバル管理
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const MAX_POSTS = 200; // 最大表示件数

    // 投稿取得関数（統合版）
    const fetchPosts = useCallback(async (isInitial: boolean = false) => {
        try {
            if (isInitial) {
                setLoading(true);
            }

            let response;
            if (showFollowingPosts) {
                // フォローTL: フォロー中ユーザーの投稿のみを取得
                console.log('フォローTL: フォロー中ユーザーの投稿を取得中...');
                response = await dieterApi.getFollowingPosts(1, 50);
                console.log('フォローTL取得結果:', response.posts?.length || 0, '件');
            } else {
                // 通常TL: 公開投稿を取得
                console.log('通常TL: 公開投稿を取得中...');
                response = await dieterApi.getPosts(1, 50);
                console.log('通常TL取得結果:', response.posts?.length || 0, '件');
            }

            if (isInitial) {
                // 初期取得時は最新20件をセット
                const initialPosts = response.posts.slice(0, 20);
                setPosts(initialPosts);
                console.log(`${showFollowingPosts ? 'フォローTL' : '通常TL'}初期取得完了:`, initialPosts.length, '件');
            } else {
                // リアルタイム更新時: 現在の投稿より新しいもののみを追加
                setPosts((currentPosts) => {
                    if (currentPosts.length === 0) {
                        // 投稿が空の場合は20件を取得
                        return response.posts.slice(0, 20);
                    }

                    // 最新投稿のCreatedAtを取得
                    const latestPostTime = currentPosts[0]?.CreatedAt;
                    if (!latestPostTime) {
                        return response.posts.slice(0, 20);
                    }

                    // 現在の投稿より新しい投稿を抽出
                    const newPosts = response.posts.filter(post =>
                        new Date(post.CreatedAt) > new Date(latestPostTime)
                    );

                    if (newPosts.length > 0) {
                        // 新しい投稿を先頭に追加し、最大200件まで制限
                        const updatedPosts = [...newPosts, ...currentPosts].slice(0, MAX_POSTS);
                        console.log(`${showFollowingPosts ? 'フォローTL' : '通常TL'}新規投稿追加:`, newPosts.length, '件 (合計:', updatedPosts.length, '件)');
                        return updatedPosts;
                    }

                    console.log(`${showFollowingPosts ? 'フォローTL' : '通常TL'}リアルタイム更新: 新しい投稿なし`);
                    return currentPosts;
                });
            }
        } catch (error) {
            console.error(`${showFollowingPosts ? 'フォローTL' : '通常TL'}の取得に失敗しました:`, error);
            if (isInitial) {
                setPosts([]);
            }
        } finally {
            if (isInitial) {
                setLoading(false);
            }
        }
    }, [showFollowingPosts, setPosts, setLoading]);

    // リアルタイム更新の管理
    const startRealtimeUpdates = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            fetchPosts(false);
        }, 30000); // 30秒間隔

        console.log('リアルタイム更新開始 (30秒間隔)');
    }, [fetchPosts]);

    const stopRealtimeUpdates = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log('リアルタイム更新停止');
        }
    }, []);

    // 投稿管理の統一 useEffect
    useEffect(() => {
        console.log('Dieter投稿管理初期化開始');

        // 初期取得
        fetchPosts(true);

        // リアルタイム更新開始（1秒後）
        const timer = setTimeout(() => {
            startRealtimeUpdates();
        }, 1000);

        // クリーンアップ
        return () => {
            clearTimeout(timer);
            stopRealtimeUpdates();
        };
    }, [showFollowingPosts]);

    // ページ離脱時の処理
    useEffect(() => {
        const handleBeforeUnload = () => stopRealtimeUpdates();

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            stopRealtimeUpdates();
        };
    }, [stopRealtimeUpdates]);

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

    const handleNavigateToMessages = async () => {
        setShowMessages(true);

        // メッセージ画面を開いた時に会話一覧を取得
        await messageManager.fetchConversations();
    };

    const handleNavigateToNotifications = async () => {
        setShowNotifications(true);
        setShowMessages(false);

        // 通知画面を開いた時に通知一覧を取得
        await notificationManager.fetchNotifications();
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

    // 投稿処理
    const handlePost = async (content: string, images?: File[], isSensitive?: boolean) => {
        try {
            console.log('投稿作成中...');

            const postData = {
                content: content,
                images: images || [],
                is_sensitive: isSensitive || false
            };

            // 投稿作成
            const newPost = await dieterApi.createPost(postData);
            console.log('投稿作成完了:', newPost.ID);

            // 投稿作成後、少し待ってからリアルタイム更新を手動実行
            // これにより、データベースへの反映を待つことができる
            setTimeout(async () => {
                try {
                    console.log('投稿作成後の更新チェック開始...');
                    await fetchPosts(false); // リアルタイム更新として実行
                } catch (error) {
                    console.error('投稿作成後の更新チェックに失敗:', error);
                }
            }, 1000); // 1秒待ってから更新チェック

        } catch (error) {
            console.error('投稿作成に失敗:', error);
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

    // 投稿削除処理
    const handlePostDelete = async (postId: number) => {
        // 削除IDを記録
        setDeletedPostIds((prev: Set<number>) => new Set(Array.from(prev).concat(postId)));

        // ローカル状態から即座に削除
        setPosts(currentPosts => currentPosts.filter(post => post.ID !== postId));

        // 削除処理では再取得は不要（既にローカルから削除済み）
        console.log('投稿削除完了: ID', postId);
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
        currentUser,
        notificationManager,
        messageManager
    };
};
