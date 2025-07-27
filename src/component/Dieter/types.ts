export interface Post {
    id: number;
    user: {
        name: string;
        username: string;
        avatar: string;
    };
    content: string;
    timestamp: string;
    likes: number;
    retweets: number;
    comments: number;
    image?: string;
}

export interface TrendingTopic {
    hashtag: string;
    posts: number;
}

export interface RecommendedUser {
    name: string;
    username: string;
    avatar: string;
    isFollowing: boolean;
}
