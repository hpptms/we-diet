// Generated TypeScript definitions for notification.proto
export enum NotificationType {
    UNKNOWN = 0,
    LIKE = 1,
    COMMENT = 2,
    FOLLOW = 3,
    RETWEET = 4,
    MESSAGE = 5,
    SYSTEM = 6,
}

export interface Notification {
    id: number;
    user_id: number;
    type: NotificationType;
    title: string;
    message: string;
    action_url: string;
    is_read: boolean;
    related_user_id: number;
    related_user_name: string;
    related_user_picture: string;
    related_post_id: number;
    related_post_content: string;
    created_at: string;
    updated_at: string;
}

export interface NotificationSettings {
    user_id: number;
    like_notifications: boolean;
    comment_notifications: boolean;
    follow_notifications: boolean;
    retweet_notifications: boolean;
    message_notifications: boolean;
    system_notifications: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
    updated_at: string;
}

export interface GetNotificationsRequest {
    page: number;
    limit: number;
    unread_only: boolean;
    types: NotificationType[];
}

export interface NotificationsResponse {
    notifications: Notification[];
    total_count: number;
    unread_count: number;
    has_more: boolean;
}

export interface NotificationSettingsResponse {
    settings: NotificationSettings;
}

export interface UnreadCountResponse {
    unread_count: number;
}
