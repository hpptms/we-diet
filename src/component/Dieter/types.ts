export interface Post {
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
    User?: {
        ID: number;
        UserName: string;
        Email: string;
        Picture: string;
    };
    Comments?: Comment[];
    Retweets?: Retweet[];
    Likes?: Like[];
    CreatedAt: string;
    UpdatedAt: string;
}

export interface Comment {
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

export interface Retweet {
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

export interface Like {
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

export interface TrendingTopic {
    hashtag: string;
    posts: number;
}

export interface RecommendedUser {
    id: number;
    name: string;
    username: string;
    avatar: string;
    isFollowing: boolean;
}

export interface Notification {
    id: number;
    user_id: number;
    actor_id: number;
    post_id: number;
    type: 'like' | 'retweet' | 'comment';
    is_read: boolean;
    created_at: string;
    updated_at: string;
    actor: {
        ID: number;
        UserName: string;
        Email: string;
        Picture: string;
    };
    post: {
        ID: number;
        Content: string;
        AuthorName: string;
        AuthorPicture: string;
    };
}

export interface NotificationResponse {
    notifications: Notification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}
