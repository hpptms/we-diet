import axios, { AxiosResponse } from 'axios';
import {
    GetUsersRequest,
    GetUsersResponse,
    DeleteUserRequest,
    DeleteUserResponse,
    GetPostsRequest,
    GetPostsResponse,
    DeletePostRequest,
    DeletePostResponse,
    TogglePostVisibilityRequest,
    TogglePostVisibilityResponse
} from '../proto/admin';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/api/';

// CSRF トークン管理
const getStoredCsrfToken = (): string | null => {
    return localStorage.getItem('csrf_token');
};

const fetchCsrfToken = async (): Promise<string> => {
    try {
        const response = await axios.get('/csrf-token', {
            withCredentials: true,
        });
        const token = response.data.csrf_token;
        if (token) {
            localStorage.setItem('csrf_token', token);
        }
        return token;
    } catch (error) {
        console.error('CSRF token fetch error:', error);
        throw error;
    }
};

// 入力値検証
const validateRequest = (request: any): { isValid: boolean; error?: string } => {
    if (!request) {
        return { isValid: false, error: 'リクエストが空です' };
    }

    // ページ番号の検証
    if ('page' in request && (request.page < 1 || request.page > 1000)) {
        return { isValid: false, error: 'ページ番号が無効です' };
    }

    // 取得件数の検証
    if ('limit' in request && (request.limit < 1 || request.limit > 100)) {
        return { isValid: false, error: '取得件数が無効です' };
    }

    // IDの検証
    if ('user_id' in request && (!request.user_id || request.user_id <= 0)) {
        return { isValid: false, error: '無効なユーザーIDです' };
    }

    if ('post_id' in request && (!request.post_id || request.post_id <= 0)) {
        return { isValid: false, error: '無効な投稿IDです' };
    }

    return { isValid: true };
};

// Axios instance with default configuration
const adminApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // CSRF対策でCookieを含める
});

// Add request interceptor to include auth token and CSRF token
adminApi.interceptors.request.use(
    async (config) => {
        // JWTトークン設定
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // CSRF トークン設定（POST/PUT/DELETE リクエストのみ）
        if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
            let csrfToken = getStoredCsrfToken();

            // CSRFトークンがない場合は取得
            if (!csrfToken) {
                try {
                    csrfToken = await fetchCsrfToken();
                } catch (error) {
                    console.warn('CSRF token could not be obtained, proceeding without it');
                }
            }

            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
adminApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        // CSRF トークンエラーの場合は再試行
        if (error.response?.status === 403 &&
            error.response?.data?.error?.includes('CSRF')) {
            console.log('CSRF token expired, refreshing...');

            try {
                const newCsrfToken = await fetchCsrfToken();
                // 元のリクエストを再実行
                const originalRequest = error.config;
                originalRequest.headers['X-CSRF-Token'] = newCsrfToken;
                return adminApi.request(originalRequest);
            } catch (csrfError) {
                console.error('Failed to refresh CSRF token:', csrfError);
            }
        }

        return Promise.reject(error);
    }
);

// Admin API functions using protobuf format

export const getUsers = async (request: GetUsersRequest): Promise<GetUsersResponse> => {
    try {
        // 入力値検証
        const validation = validateRequest(request);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const response: AxiosResponse<GetUsersResponse> = await adminApi.post('/proto/admin/users', request);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const deleteUser = async (request: DeleteUserRequest): Promise<DeleteUserResponse> => {
    try {
        // 入力値検証
        const validation = validateRequest(request);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const response: AxiosResponse<DeleteUserResponse> = await adminApi.post('/proto/admin/users/delete', request);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const getPosts = async (request: GetPostsRequest): Promise<GetPostsResponse> => {
    try {
        // 入力値検証
        const validation = validateRequest(request);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const response: AxiosResponse<GetPostsResponse> = await adminApi.post('/proto/admin/posts', request);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const deletePost = async (request: DeletePostRequest): Promise<DeletePostResponse> => {
    try {
        // 入力値検証
        const validation = validateRequest(request);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const response: AxiosResponse<DeletePostResponse> = await adminApi.post('/proto/admin/posts/delete', request);
        return response.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

export const togglePostVisibility = async (request: TogglePostVisibilityRequest): Promise<TogglePostVisibilityResponse> => {
    try {
        // 入力値検証
        const validation = validateRequest(request);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        const response: AxiosResponse<TogglePostVisibilityResponse> = await adminApi.post('/proto/admin/posts/toggle-visibility', request);
        return response.data;
    } catch (error) {
        console.error('Error toggling post visibility:', error);
        throw error;
    }
};
