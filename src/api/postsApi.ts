import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface Post {
    ID: number;
    UserID: number;
    Content: string;
    ImageURL: string;
    Images?: string[];       // 複数画像のURL配列
    IsPublic: boolean;
    IsSensitive: boolean;
    AuthorName: string;      // 投稿者名（キャッシュ）
    AuthorPicture: string;   // 投稿者アイコンURL（キャッシュ）
    // リツイート関連のフィールド
    IsRetweet?: boolean;     // リツイートされた投稿かどうか
    RetweetUserID?: number;  // リツイートしたユーザーのID
    RetweetUserName?: string; // リツイートしたユーザーの名前
    RetweetUserPicture?: string; // リツイートしたユーザーのアイコン
    RetweetedAt?: string;    // リツイートされた時間
    User: {
        ID: number;
        UserName: string;
        Email: string;
        Picture: string;
    };
    Comments: Comment[];
    Retweets: Retweet[];
    Likes: Like[];
    CreatedAt: string;
    UpdatedAt: string;
}

interface Comment {
    ID: number;
    PostID: number;
    UserID: number;
    Content: string;
    AuthorName: string;      // コメント者名（キャッシュ）
    AuthorPicture: string;   // コメント者アイコンURL（キャッシュ）
    User: {
        ID: number;
        UserName: string;
        Email: string;
        Picture: string;
    };
    CreatedAt: string;
    UpdatedAt: string;
}

interface Retweet {
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

interface Like {
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

interface CreatePostRequest {
    content: string;
    images?: File[];
    is_sensitive?: boolean;
}

interface CreateCommentRequest {
    content: string;
}

interface PostsResponse {
    posts: Post[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

interface RecommendedUser {
    id: number;
    name: string;
    username: string;
    avatar: string;
    post_count: number;
    is_following: boolean;
}

interface RecommendedUsersResponse {
    users: RecommendedUser[];
}

interface Message {
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

interface SendMessageRequest {
    receiver_id: number;
    content: string;
}

interface MessagesResponse {
    messages: Message[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

interface ConversationItem {
    user_id: number;
    user_name: string;
    user_picture: string;
    last_message: string;
    last_message_at: string;
    unread_count: number;
    is_sender: boolean;
}

interface ConversationsResponse {
    conversations: ConversationItem[];
}

// ユーザープロフィール関連のインターフェース
interface UserProfile {
    ID: number;
    UserID: number;
    DisplayName: string;
    SelectedPresetID?: number;
    IconType: string;
    UploadedIcon?: string;
    UploadedIconPublicID?: string;
    Gender: string;
    Age?: number;
    ActivityLevel: string;
    Height?: number;
    CurrentWeight?: number;
    TargetWeight?: number;
    ShowPreset: boolean;
    PrText: string;
    IsGenderPrivate: boolean;
    IsAgePrivate: boolean;
    IsHeightPrivate: boolean;
    IsActivityPrivate: boolean;
    IsCurrentWeightPrivate: boolean;
    IsTargetWeightPrivate: boolean;
    EnableSensitiveFilter: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

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

export const postsApi = {
    // 投稿一覧取得（公開エンドポイント）
    async getPosts(page: number = 1, limit: number = 20): Promise<PostsResponse> {
        // protobufリクエスト型・レスポンス型をimport
        // import { GetPostsRequest, PostsResponse } from '../proto/dieter';
        const token = getAuthToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/x-protobuf',
            'Accept': 'application/x-protobuf',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        // protobufリクエストはクエリパラメータではなくbodyで送る場合はPOST/PUTだが、GETの場合はクエリでOK
        const response = await axios.get(
            `${API_BASE_URL}/public/posts?page=${page}&limit=${limit}`,
            {
                headers,
                responseType: 'arraybuffer',
            }
        );
        // protobufデコード
        // import { PostsResponse } from '../proto/dieter';
        const reader = new Uint8Array(response.data);
        // @ts-ignore
        return require('../proto/dieter').PostsResponse.fromBinary(reader);
    },

    // フォロー中ユーザーの投稿一覧取得（認証付きエンドポイント）
    async getFollowingPosts(page: number = 1, limit: number = 20): Promise<PostsResponse> {
        const token = getAuthToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/x-protobuf',
            'Accept': 'application/x-protobuf',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await axios.get(
            `${API_BASE_URL}/api/posts/following?page=${page}&limit=${limit}`,
            {
                headers,
                responseType: 'arraybuffer',
            }
        );
        const reader = new Uint8Array(response.data);
        // @ts-ignore
        return require('../proto/dieter').PostsResponse.fromBinary(reader);
    },

    // 特定の投稿取得（公開エンドポイント）
    async getPost(id: number): Promise<Post> {
        const response = await fetch(`${API_BASE_URL}/public/posts/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }
        return response.json();
    },

    // 投稿作成（認証付きエンドポイント）
    async createPost(data: CreatePostRequest): Promise<Post> {
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
        // FormDataの場合、Content-Typeヘッダーは自動設定されるため除外

        const response = await fetch(`${API_BASE_URL}/api/posts`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Failed to create post');
        }
        return response.json();
    },

    // 投稿削除（認証付きエンドポイント）
    async deletePost(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to delete post');
        }
    },

    // コメント作成（認証付きエンドポイント）
    async createComment(postId: number, data: CreateCommentRequest): Promise<Comment> {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to create comment');
        }
        return response.json();
    },

    // リツイート作成（認証付きエンドポイント）
    async retweetPost(postId: number): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/retweet`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to retweet post');
        }
        return response.json();
    },

    // ライク作成（認証付きエンドポイント）
    async likePost(postId: number): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to like post');
        }
        return response.json();
    },

    // 投稿のライク一覧取得（公開エンドポイント）
    async getPostLikes(postId: number): Promise<Like[]> {
        const response = await fetch(`${API_BASE_URL}/public/posts/${postId}/likes`);
        if (!response.ok) {
            throw new Error('Failed to fetch post likes');
        }
        return response.json();
    },

    // 投稿非表示（削除の代替）
    async hidePost(postId: number): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/hide`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to hide post');
        }
        return response.json();
    },

    // 投稿を報告する
    async reportPost(postId: number): Promise<{ success: boolean; message: string; karma: number; is_hide: boolean }> {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/report`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '投稿の報告に失敗しました');
        }

        return response.json();
    },

    // おすすめユーザー取得（公開エンドポイント）
    async getRecommendedUsers(excludeUserId?: number): Promise<RecommendedUsersResponse> {
        const url = new URL(`${API_BASE_URL}/public/recommended-users`);
        if (excludeUserId) {
            url.searchParams.append('exclude_user_id', excludeUserId.toString());
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error('Failed to fetch recommended users');
        }
        return response.json();
    },

    // フォロー/アンフォロー（認証付きエンドポイント）
    async toggleFollow(userId: number): Promise<{ following: boolean; message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/follow`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to toggle follow');
        }
        return response.json();
    },

    // フォロワー一覧取得（認証付きエンドポイント）
    async getFollowers(userId: number): Promise<{ followers: any[]; count: number }> {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/followers`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch followers');
        }
        return response.json();
    },

    // フォロー中一覧取得（認証付きエンドポイント）
    async getFollowing(userId: number): Promise<{ following: any[]; count: number }> {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/following`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch following');
        }
        return response.json();
    },

    // フォロー状態確認（認証付きエンドポイント）
    async getFollowStatus(userId: number): Promise<{ is_following: boolean }> {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/follow-status`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch follow status');
        }
        return response.json();
    },

    // フォロー・フォロワー数取得（認証付きエンドポイント）
    async getFollowCounts(): Promise<{ following_count: number; follower_count: number }> {
        const response = await fetch(`${API_BASE_URL}/api/users/follow-counts`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch follow counts');
        }
        return response.json();
    },

    // 通知一覧取得（認証付きエンドポイント）
    async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<any> {
        const url = new URL(`${API_BASE_URL}/api/notifications`);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());
        if (unreadOnly) {
            url.searchParams.append('unread_only', 'true');
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }
        return response.json();
    },

    // 通知を既読にする（認証付きエンドポイント）
    async markNotificationAsRead(notificationId: number): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to mark notification as read');
        }
        return response.json();
    },

    // 全ての通知を既読にする（認証付きエンドポイント）
    async markAllNotificationsAsRead(): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to mark all notifications as read');
        }
        return response.json();
    },

    // 未読通知数取得（認証付きエンドポイント）
    async getUnreadNotificationCount(): Promise<{ unread_count: number }> {
        const response = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch unread notification count');
        }
        return response.json();
    },

    // メッセージ送信（認証付きエンドポイント）
    async sendMessage(data: SendMessageRequest): Promise<Message> {
        const response = await fetch(`${API_BASE_URL}/api/messages`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        return response.json();
    },

    // メッセージ一覧取得（特定のユーザーとの会話履歴）（認証付きエンドポイント）
    async getMessages(userId: number, page: number = 1, limit: number = 50): Promise<MessagesResponse> {
        const response = await fetch(`${API_BASE_URL}/api/messages/${userId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        return response.json();
    },

    // メッセージ会話リスト取得（DM一覧）（認証付きエンドポイント）
    async getMessageConversations(): Promise<ConversationsResponse> {
        const response = await fetch(`${API_BASE_URL}/api/messages`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch message conversations');
        }
        return response.json();
    },

    // 特定のユーザーに新しいメッセージを送信する（認証付きエンドポイント）
    async startMessageConversation(userId: number, content: string): Promise<Message> {
        return this.sendMessage({
            receiver_id: userId,
            content: content,
        });
    },

    // 未読メッセージ数取得（認証付きエンドポイント）
    async getUnreadMessageCount(): Promise<{ unread_count: number }> {
        const response = await fetch(`${API_BASE_URL}/api/messages/unread-count`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch unread message count');
        }
        return response.json();
    },

    // ユーザープロフィール取得（公開エンドポイント）
    async getUserProfile(userId: number): Promise<UserProfile> {
        const response = await fetch(`${API_BASE_URL}/public/user_profile/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        return response.json();
    },
};

export type { Post, Comment, Retweet, Like, CreatePostRequest, CreateCommentRequest, PostsResponse, RecommendedUser, RecommendedUsersResponse, Message, SendMessageRequest, MessagesResponse, ConversationItem, ConversationsResponse, UserProfile };
