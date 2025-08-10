// 管理者API用のプロトバフインターフェース

export interface GetUsersRequest {
    page: number;
    limit: number;
    search: string;
}

export interface AdminUser {
    id: number;
    user_name: string;
    email: string;
    picture: string;
    permission: number;
    subscribe: boolean;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
}

export interface GetUsersResponse {
    success: boolean;
    users: AdminUser[];
    pagination: Pagination;
}

export interface DeleteUserRequest {
    user_id: number;
}

export interface DeleteUserResponse {
    success: boolean;
    message: string;
}

export interface GetPostsRequest {
    page: number;
    limit: number;
    show_hidden: boolean;
    user_id: string;
    min_karma: string;
}

export interface AdminPost {
    id: number;
    user_id: number;
    content: string;
    author_name: string;
    author_picture: string;
    is_public: boolean;
    is_hide: boolean;
    karma: number;
    created_at: string;
    updated_at: string;
    user?: AdminUser;
}

export interface GetPostsResponse {
    success: boolean;
    posts: AdminPost[];
    pagination: Pagination;
}

export interface DeletePostRequest {
    post_id: number;
}

export interface DeletePostResponse {
    success: boolean;
    message: string;
}

export interface TogglePostVisibilityRequest {
    post_id: number;
}

export interface TogglePostVisibilityResponse {
    success: boolean;
    message: string;
    is_hide: boolean;
}
