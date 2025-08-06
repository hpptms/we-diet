// Generated TypeScript definitions for trending.proto
export interface TrendingTopic {
    hashtag: string;
    post_count: number;
    engagement_score: number;
    category: string;
    related_tags: string[];
    created_at: string;
    updated_at: string;
}

export interface TrendingUser {
    id: number;
    name: string;
    username: string;
    avatar: string;
    follower_count: number;
    post_count: number;
    engagement_score: number;
    is_verified: boolean;
    bio: string;
    is_following: boolean;
}

export interface SearchResult {
    posts: TrendingPost[];
    users: TrendingUser[];
    topics: TrendingTopic[];
    total_posts: number;
    total_users: number;
    total_topics: number;
}

export interface TrendingPost {
    id: number;
    user_id: number;
    content: string;
    image_url: string;
    images: string[];
    is_public: boolean;
    is_sensitive: boolean;
    author_name: string;
    author_picture: string;
    is_retweet: boolean;
    retweet_user_id: number;
    retweet_user_name: string;
    retweet_user_picture: string;
    retweeted_at: string;
    created_at: string;
    updated_at: string;
}

export interface GetTrendingTopicsRequest {
    limit: number;
    category: string;
    time_range: string;
}

export interface SearchPostsRequest {
    query: string;
    page: number;
    limit: number;
    sort_by: string;
}

export interface TrendingTopicsResponse {
    topics: TrendingTopic[];
    generated_at: string;
}

export interface SearchPostsResponse {
    posts: TrendingPost[];
    total_count: number;
    has_more: boolean;
}

export interface SearchResponse {
    results: SearchResult;
    query: string;
    total_results: number;
    search_time: number;
}
