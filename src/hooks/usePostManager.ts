import { useState, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { serverProfileState } from '../recoil/profileSettingsAtom';
import { dieterApi } from '../api/dieterApi';
import { postsApi } from '../api/postsApi';
import { Post } from '../component/Dieter/types';

interface PostManagerState {
    posts: Post[];
    loading: boolean;
    deletedPostIds: Set<number>;
    error: string | null;
}

interface CreatePostData {
    content: string;
    images?: File[];
    is_sensitive?: boolean;
}

export const usePostManager = () => {
    const serverProfile = useRecoilValue(serverProfileState);
    const [state, setState] = useState<PostManagerState>({
        posts: [],
        loading: true,
        deletedPostIds: new Set(),
        error: null
    });

    // 削除されたIDをlocalStorageから復元
    useEffect(() => {
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
                } else {
                    setState(prev => ({
                        ...prev,
                        deletedPostIds: new Set(parsedIds)
                    }));
                }
            }
        } catch (error) {
            console.error('削除された投稿IDの復元に失敗:', error);
        }
    }, []);

    // 投稿一覧を取得
    const fetchPosts = useCallback(async (showFollowingPosts = false) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            let response;
            if (showFollowingPosts) {
                response = await dieterApi.getFollowingPosts();
            } else {
                response = await dieterApi.getPosts();
            }

            setState(prev => ({
                ...prev,
                posts: response.posts,
                loading: false
            }));
        } catch (error) {
            console.error('投稿の取得に失敗しました:', error);
            setState(prev => ({
                ...prev,
                error: '投稿の取得に失敗しました',
                loading: false
            }));
        }
    }, []);

    // 新しい投稿を作成
    const createPost = useCallback(async (postData: CreatePostData): Promise<boolean> => {
        try {
            const newPost = await postsApi.createPost(postData);

            setState(prev => ({
                ...prev,
                posts: [newPost, ...prev.posts]
            }));

            // サーバーから最新の投稿一覧を取得して同期
            try {
                const response = await dieterApi.getPosts();
                setState(prev => ({
                    ...prev,
                    posts: response.posts
                }));
            } catch (fetchError) {
                console.warn('投稿一覧の再取得に失敗しましたが、ローカル更新は成功しています:', fetchError);
            }

            return true;
        } catch (error) {
            console.error('投稿の作成に失敗しました:', error);
            setState(prev => ({
                ...prev,
                error: '投稿の作成に失敗しました'
            }));
            return false;
        }
    }, []);

    // 投稿を削除（非表示）
    const deletePost = useCallback(async (postId: number): Promise<boolean> => {
        try {
            await postsApi.hidePost(postId);

            // 削除IDをローカル状態とストレージに保存
            const newDeletedIds = new Set(Array.from(state.deletedPostIds).concat(postId));
            setState(prev => ({
                ...prev,
                deletedPostIds: newDeletedIds
            }));

            try {
                localStorage.setItem('dieter_deleted_post_ids', JSON.stringify(Array.from(newDeletedIds)));
                localStorage.setItem('dieter_deleted_post_ids_timestamp', Date.now().toString());
            } catch (storageError) {
                console.error('削除された投稿IDの保存に失敗:', storageError);
            }

            // サーバーから最新の投稿一覧を取得
            try {
                const response = await dieterApi.getPosts();
                setState(prev => ({
                    ...prev,
                    posts: response.posts
                }));
                console.log('投稿削除後、投稿一覧を更新しました');
            } catch (fetchError) {
                console.error('投稿削除後の投稿一覧の更新に失敗しました:', fetchError);
            }

            return true;
        } catch (error) {
            console.error('投稿の削除に失敗しました:', error);
            setState(prev => ({
                ...prev,
                error: '投稿の削除に失敗しました'
            }));
            return false;
        }
    }, [state.deletedPostIds]);

    // フィルタリングされた投稿を取得
    const getFilteredPosts = useCallback((): Post[] => {
        return state.posts.filter(post => !state.deletedPostIds.has(post.ID));
    }, [state.posts, state.deletedPostIds]);

    // 現在のユーザー情報を取得
    const getCurrentUser = useCallback(() => {
        return {
            id: serverProfile.userId,
            name: serverProfile.profile?.display_name || 'ユーザー',
            avatar: serverProfile.profile?.uploaded_icon
        };
    }, [serverProfile]);

    return {
        // 状態
        posts: state.posts,
        filteredPosts: getFilteredPosts(),
        loading: state.loading,
        error: state.error,
        deletedPostIds: state.deletedPostIds,

        // アクション
        fetchPosts,
        createPost,
        deletePost,
        getCurrentUser,

        // ユーティリティ
        clearError: () => setState(prev => ({ ...prev, error: null }))
    };
};
