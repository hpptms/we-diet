import axios, { AxiosResponse } from 'axios';
import {
    Post,
    PostsResponse,
    GetPostsRequest,
    CreatePostRequest,
    CreateCommentRequest,
    Comment,
    RecommendedUsersResponse,
    GetRecommendedUsersRequest,
    ToggleFollowResponse,
    FollowListResponse,
    FollowStatusResponse,
    FollowCountsResponse,
    MessagesResponse,
    GetMessagesRequest,
    SendMessageRequest,
    Message,
    ConversationsResponse,
    GetNotificationsRequest,
    UnreadCountResponse,
    SimpleResponse,
    ReportPostResponse,
    Like
} from '../proto/dieter';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// JWTトークンを取得するヘルパー関数
const getAuthToken = (): string | null => {
    return localStorage.getItem('jwt_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
};

// 現在のユーザーIDを取得するヘルパー関数
const getCurrentUserId = (): number | null => {
    try {
        // user_idフィールドを最初に確認（DashboardPageで設定される）
        const userId = localStorage.getItem('user_id');
        if (userId) {
            return parseInt(userId, 10);
        }

        // serverProfileDataからユーザーIDを取得
        const serverProfileData = localStorage.getItem('serverProfileData');
        if (serverProfileData) {
            const parsed = JSON.parse(serverProfileData);
            if (parsed.userId) {
                return parsed.userId;
            }
        }

        // accountIdフィールドを確認
        const accountId = localStorage.getItem('accountId');
        if (accountId) {
            return parseInt(accountId, 10);
        }

        // userIdフィールドを確認（他の実装での互換性）
        const userIdAlt = localStorage.getItem('userId');
        if (userIdAlt) {
            return parseInt(userIdAlt, 10);
        }

        return null;
    } catch (error) {
        console.error('ユーザーID取得でエラー:', error);
        return null;
    }
};

// 認証ヘッダーを取得するヘルパー関数
const getAuthHeaders = (): Record<string, string> => {
    const token = getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

export interface CreatePostRequestData {
    content: string;
    images?: File[];
    is_sensitive?: boolean;
}

export interface CreateCommentRequestData {
    content: string;
}

export interface SendMessageRequestData {
    receiver_id: number;
    content: string;
}

// Legacy interfaces for backward compatibility
export interface LegacyPost {
    ID: number;
    UserID: number;
    Content: string;
    ImageURL: string;
    Images?: string[];
    IsPublic: boolean;
    IsSensitive: boolean;
    AuthorName: string;
    AuthorPicture: string;
    IsRetweet?: boolean;
    RetweetUserID?: number;
    RetweetUserName?: string;
    RetweetUserPicture?: string;
    RetweetedAt?: string;
    User: {
        ID: number;
        UserName: string;
        Email: string;
        Picture: string;
    };
    Comments: LegacyComment[];
    Retweets: LegacyRetweet[];
    Likes: LegacyLike[];
    CreatedAt: string;
    UpdatedAt: string;
}

export interface LegacyComment {
    ID: number;
    PostID: number;
    UserID: number;
    Content: string;
    AuthorName: string;
    AuthorPicture: string;
    User: {
        ID: number;
        UserName: string;
        Email: string;
        Picture: string;
    };
    CreatedAt: string;
    UpdatedAt: string;
}

export interface LegacyRetweet {
    ID: number;
    PostID: number;
    UserID: number;
    User: {
        ID: number;
        UserName: string;
        Email: string;
        Picture: string;
    };
    CreatedAt: string;
    UpdatedAt: string;
}

export interface LegacyLike {
    ID: number;
    PostID: number;
    UserID: number;
    User: {
        ID: number;
        UserName: string;
        Email: string;
        Picture: string;
    };
    CreatedAt: string;
    UpdatedAt: string;
}

export interface LegacyRecommendedUser {
    id: number;
    name: string;
    username: string;
    avatar: string;
    post_count: number;
    is_following: boolean;
}

export interface LegacyMessage {
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

export interface LegacyConversationItem {
    user_id: number;
    user_name: string;
    user_picture: string;
    last_message: string;
    last_message_at: string;
    unread_count: number;
    is_sender: boolean;
}

export interface LegacyPostsResponse {
    posts: LegacyPost[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export interface LegacyRecommendedUsersResponse {
    users: LegacyRecommendedUser[];
}

export interface LegacyMessagesResponse {
    messages: LegacyMessage[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export interface LegacyConversationsResponse {
    conversations: LegacyConversationItem[];
}

/**
 * Protobuf Post → LegacyPost 変換
 */
const convertPostToLegacy = (post: Post): LegacyPost => ({
    ID: post.id,
    UserID: post.userId,
    Content: post.content,
    ImageURL: post.imageUrl,
    Images: post.images,
    IsPublic: post.isPublic,
    IsSensitive: post.isSensitive,
    AuthorName: post.authorName,
    AuthorPicture: post.authorPicture,
    IsRetweet: post.isRetweet,
    RetweetUserID: post.retweetUserId,
    RetweetUserName: post.retweetUserName,
    RetweetUserPicture: post.retweetUserPicture,
    RetweetedAt: post.retweetedAt,
    User: post.user ? {
        ID: post.user.id,
        UserName: post.user.userName,
        Email: post.user.email,
        Picture: post.user.picture,
    } : { ID: 0, UserName: '', Email: '', Picture: '' },
    Comments: post.comments ? post.comments.map(convertCommentToLegacy) : [],
    Retweets: post.retweets ? post.retweets.map(convertRetweetToLegacy) : [],
    Likes: post.likes ? post.likes.map(convertLikeToLegacy) : [],
    CreatedAt: post.createdAt,
    UpdatedAt: post.updatedAt,
});

const convertCommentToLegacy = (comment: Comment): LegacyComment => ({
    ID: comment.id,
    PostID: comment.postId,
    UserID: comment.userId,
    Content: comment.content,
    AuthorName: comment.authorName,
    AuthorPicture: comment.authorPicture,
    User: comment.user ? {
        ID: comment.user.id,
        UserName: comment.user.userName,
        Email: comment.user.email,
        Picture: comment.user.picture,
    } : { ID: 0, UserName: '', Email: '', Picture: '' },
    CreatedAt: comment.createdAt,
    UpdatedAt: comment.updatedAt,
});

const convertRetweetToLegacy = (retweet: any): LegacyRetweet => ({
    ID: retweet.id,
    PostID: retweet.postId,
    UserID: retweet.userId,
    User: retweet.user ? {
        ID: retweet.user.id,
        UserName: retweet.user.userName,
        Email: retweet.user.email,
        Picture: retweet.user.picture,
    } : { ID: 0, UserName: '', Email: '', Picture: '' },
    CreatedAt: retweet.createdAt,
    UpdatedAt: retweet.updatedAt,
});

const convertLikeToLegacy = (like: Like): LegacyLike => ({
    ID: like.id,
    PostID: like.postId,
    UserID: like.userId,
    User: like.user ? {
        ID: like.user.id,
        UserName: like.user.userName,
        Email: like.user.email,
        Picture: like.user.picture,
    } : { ID: 0, UserName: '', Email: '', Picture: '' },
    CreatedAt: like.createdAt,
    UpdatedAt: like.updatedAt,
});

export const dieterApi = {
    // 投稿一覧取得（公開エンドポイント）
    async getPosts(page: number = 1, limit: number = 20): Promise<LegacyPostsResponse> {
        try {
            // Protobufで取得
            const headers = {
                ...getAuthHeaders(),
                Accept: 'application/x-protobuf'
            };
            const response = await axios.get(`${API_BASE_URL}/public/posts?page=${page}&limit=${limit}`, {
                headers,
                responseType: 'arraybuffer'
            });
            // Protobufデコード
            const postsResponse = PostsResponse.fromBinary(new Uint8Array(response.data));
            // Legacy形式に変換
            const legacyPosts = postsResponse.posts.map(convertPostToLegacy);
            return {
                posts: legacyPosts,
                pagination: postsResponse.pagination
                    ? {
                        page: postsResponse.pagination.page,
                        limit: postsResponse.pagination.limit,
                        total: postsResponse.pagination.total,
                    }
                    : { page: 1, limit: legacyPosts.length, total: legacyPosts.length },
            };
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            throw error;
        }
    },

    // フォロー中ユーザーの投稿一覧取得（認証付きエンドポイント）
    async getFollowingPosts(page: number = 1, limit: number = 20): Promise<LegacyPostsResponse> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/posts/following?page=${page}&limit=${limit}`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch following posts:', error);
            throw error;
        }
    },

    // 特定の投稿取得（公開エンドポイント）
    async getPost(id: number): Promise<LegacyPost> {
        try {
            const response = await axios.get(`${API_BASE_URL}/public/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch post:', error);
            throw error;
        }
    },

    // 投稿作成（認証付きエンドポイント）
    async createPost(data: CreatePostRequestData): Promise<LegacyPost> {
        try {
            const token = getAuthToken();

            // FormDataを使用して画像とテキストを送信
            const formData = new FormData();
            formData.append('content', data.content);
            formData.append('is_sensitive', data.is_sensitive ? 'true' : 'false');

            // 画像がある場合はFormDataに追加
            if (data.images && data.images.length > 0) {
                data.images.forEach((image) => {
                    formData.append('images', image);
                });
            }

            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.post(`${API_BASE_URL}/api/posts`, formData, {
                headers: headers,
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create post:', error);
            throw error;
        }
    },

    // 投稿削除（認証付きエンドポイント）
    async deletePost(id: number): Promise<void> {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/posts/${id}`, {
                headers: getAuthHeaders(),
            });
        } catch (error) {
            console.error('Failed to delete post:', error);
            throw error;
        }
    },

    // コメント作成（認証付きエンドポイント）
    async createComment(postId: number, data: CreateCommentRequestData): Promise<LegacyComment> {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/posts/${postId}/comments`, data, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create comment:', error);
            throw error;
        }
    },

    // リツイート作成（認証付きエンドポイント）
    async retweetPost(postId: number): Promise<{ message: string }> {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/posts/${postId}/retweet`, {}, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to retweet post:', error);
            throw error;
        }
    },

    // ライク作成（認証付きエンドポイント）
    async likePost(postId: number): Promise<{ message: string }> {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/posts/${postId}/like`, {}, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to like post:', error);
            throw error;
        }
    },

    // 投稿のライク一覧取得（公開エンドポイント）
    async getPostLikes(postId: number): Promise<LegacyLike[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/public/posts/${postId}/likes`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch post likes:', error);
            throw error;
        }
    },

    // 投稿非表示（削除の代替）
    async hidePost(postId: number): Promise<{ message: string }> {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/posts/${postId}/hide`, {}, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to hide post:', error);
            throw error;
        }
    },

    // 投稿を報告する
    async reportPost(postId: number): Promise<{ success: boolean; message: string; karma: number; is_hide: boolean }> {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/posts/${postId}/report`, {}, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to report post:', error);
            throw error;
        }
    },

    // おすすめユーザー取得（公開エンドポイント）
    async getRecommendedUsers(excludeUserId?: number): Promise<LegacyRecommendedUsersResponse> {
        try {
            const url = new URL(`${API_BASE_URL}/public/recommended-users`);
            if (excludeUserId) {
                url.searchParams.append('exclude_user_id', excludeUserId.toString());
            }

            const response = await axios.get(url.toString());
            return response.data;
        } catch (error) {
            console.error('Failed to fetch recommended users:', error);
            throw error;
        }
    },

    // フォロー/アンフォロー（認証付きエンドポイント）
    async toggleFollow(userId: number): Promise<{ following: boolean; message: string }> {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/${userId}/follow`, {}, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to toggle follow:', error);
            throw error;
        }
    },

    // フォロワー一覧取得（認証付きエンドポイント）
    async getFollowers(userId: number): Promise<{ followers: any[]; count: number }> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/followers`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch followers:', error);
            throw error;
        }
    },

    // フォロー中一覧取得（認証付きエンドポイント）
    async getFollowing(userId: number): Promise<{ following: any[]; count: number }> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/following`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch following:', error);
            throw error;
        }
    },

    // フォロー状態確認（認証付きエンドポイント）
    async getFollowStatus(userId: number): Promise<{ is_following: boolean }> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/follow-status`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch follow status:', error);
            throw error;
        }
    },

    // フォロー・フォロワー数取得（認証付きエンドポイント）
    async getFollowCounts(): Promise<{ following_count: number; follower_count: number }> {
        try {
            const token = getAuthToken();
            if (!token) {
                return { following_count: 0, follower_count: 0 };
            }

            const response = await axios.get(`${API_BASE_URL}/api/users/follow-counts`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
                return { following_count: 0, follower_count: 0 };
            }
            console.error('Failed to fetch follow counts:', error);
            throw error;
        }
    },

    // 通知一覧取得（認証付きエンドポイント）
    async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<any> {
        try {
            const url = new URL(`${API_BASE_URL}/api/notifications`);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', limit.toString());
            if (unreadOnly) {
                url.searchParams.append('unread_only', 'true');
            }

            const response = await axios.get(url.toString(), {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            throw error;
        }
    },

    // 通知を既読にする（認証付きエンドポイント）
    async markNotificationAsRead(notificationId: number): Promise<{ message: string }> {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {}, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    },

    // 全ての通知を既読にする（認証付きエンドポイント）
    async markAllNotificationsAsRead(): Promise<{ message: string }> {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/notifications/read-all`, {}, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            throw error;
        }
    },

    // 未読通知数取得（認証付きエンドポイント）
    async getUnreadNotificationCount(): Promise<{ unread_count: number }> {
        try {
            const token = getAuthToken();
            if (!token) {
                return { unread_count: 0 };
            }

            const response = await axios.get(`${API_BASE_URL}/api/notifications/unread-count`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
                return { unread_count: 0 };
            }
            console.error('Failed to fetch unread notification count:', error);
            throw error;
        }
    },

    // メッセージ送信（認証付きエンドポイント）
    async sendMessage(data: SendMessageRequestData): Promise<LegacyMessage> {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/messages`, data, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    },

    // メッセージ一覧取得（特定のユーザーとの会話履歴）（認証付きエンドポイント）
    async getMessages(userId: number, page: number = 1, limit: number = 50): Promise<LegacyMessagesResponse> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/messages/${userId}?page=${page}&limit=${limit}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            throw error;
        }
    },

    // メッセージ会話リスト取得（DM一覧）（認証付きエンドポイント）
    async getMessageConversations(): Promise<LegacyConversationsResponse> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/messages`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch message conversations:', error);
            throw error;
        }
    },

    // 特定のユーザーに新しいメッセージを送信する（認証付きエンドポイント）
    async startMessageConversation(userId: number, content: string): Promise<LegacyMessage> {
        return this.sendMessage({
            receiver_id: userId,
            content: content,
        });
    },

    // 未読メッセージ数取得（認証付きエンドポイント）
    async getUnreadMessageCount(): Promise<{ unread_count: number }> {
        try {
            const token = getAuthToken();
            if (!token) {
                return { unread_count: 0 };
            }

            const response = await axios.get(`${API_BASE_URL}/api/messages/unread-count`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
                return { unread_count: 0 };
            }
            console.error('Failed to fetch unread message count:', error);
            throw error;
        }
    },

    // ユーザープロフィール取得（公開エンドポイント）
    async getUserProfile(userId: number): Promise<any> {
        try {
            const response = await axios.get(`${API_BASE_URL}/public/user_profile/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            throw error;
        }
    },

    // トレンド取得（公開エンドポイント）
    async getTrendingTopics(): Promise<{ topics: Array<{ hashtag: string; posts: number }>; cached_at: string; expires_at: string }> {
        try {
            const response = await axios.get(`${API_BASE_URL}/public/trending`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch trending topics:', error);
            throw error;
        }
    },

    // トレンドキャッシュリフレッシュ（認証付きエンドポイント）
    async refreshTrendingCache(): Promise<{ message: string; topics: Array<{ hashtag: string; posts: number }>; cached_at: string }> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/trending/refresh`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Failed to refresh trending cache:', error);
            throw error;
        }
    },

    // ユーザー検索（メンション機能用・公開エンドポイント）
    async searchUsers(query: string, limit: number = 10): Promise<{ users: Array<{ id: number; username: string; avatar: string }> }> {
        try {
            const url = new URL(`${API_BASE_URL}/public/users/search`);
            url.searchParams.append('q', query);
            url.searchParams.append('limit', limit.toString());

            const response = await axios.get(url.toString());
            return response.data;
        } catch (error) {
            console.error('Failed to search users:', error);
            throw error;
        }
    },

    // ユーザー名で正確に一致するユーザーを検索（メンションクリック用）
    async getUserByUsername(username: string): Promise<{ id: number; username: string; avatar: string } | null> {
        try {
            const response = await this.searchUsers(username, 10);
            // 完全一致するユーザーを検索
            const exactMatch = response.users.find(
                user => user.username.toLowerCase() === username.toLowerCase()
            );
            return exactMatch || null;
        } catch (error) {
            console.error('Failed to get user by username:', error);
            return null;
        }
    },

    // 投稿検索（公開エンドポイント）
    async searchPosts(query: string, page: number = 1, limit: number = 20): Promise<LegacyPostsResponse & { query: string }> {
        try {
            const url = new URL(`${API_BASE_URL}/public/posts/search`);
            url.searchParams.append('q', query);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', limit.toString());

            // 認証ヘッダーを含める（オプション - ブロック機能のため）
            const headers = getAuthHeaders();

            const response = await axios.get(url.toString(), { headers });
            return response.data;
        } catch (error) {
            console.error('Failed to search posts:', error);
            throw error;
        }
    },
};

export type {
    Post,
    Comment,
    Like,
    CreatePostRequestData as CreatePostRequest,
    CreateCommentRequestData as CreateCommentRequest,
    LegacyPostsResponse as PostsResponse,
    LegacyRecommendedUser as RecommendedUser,
    LegacyRecommendedUsersResponse as RecommendedUsersResponse,
    LegacyMessage as Message,
    SendMessageRequestData as SendMessageRequest,
    LegacyMessagesResponse as MessagesResponse,
    LegacyConversationItem as ConversationItem,
    LegacyConversationsResponse as ConversationsResponse
};
