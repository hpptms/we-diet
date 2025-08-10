// 管理者API用のプロトバフインターフェース

export interface GetUsersRequest {
    page: number;
    limit: number;
    search: string;
}

export interface AdminUser {
    ID: number;
    UserName: string;
    Email: string;
    Picture: string;
    Permission: number;
    Subscribe: boolean;
    EmailVerified: boolean;
    CreatedAt: string;
    UpdatedAt: string;
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
    ID: number;
    UserID: number;
    Content: string;
    AuthorName: string;
    AuthorPicture: string;
    IsPublic: boolean;
    IsHide: boolean;
    Karma: number;
    CreatedAt: string;
    UpdatedAt: string;
    User?: AdminUser;
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
