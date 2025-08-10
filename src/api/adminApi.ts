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

// Axios instance with default configuration
const adminApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Admin API functions using protobuf format

export const getUsers = async (request: GetUsersRequest): Promise<GetUsersResponse> => {
    try {
        const response: AxiosResponse<GetUsersResponse> = await adminApi.post('/proto/admin/users', request);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const deleteUser = async (request: DeleteUserRequest): Promise<DeleteUserResponse> => {
    try {
        const response: AxiosResponse<DeleteUserResponse> = await adminApi.post('/proto/admin/users/delete', request);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const getPosts = async (request: GetPostsRequest): Promise<GetPostsResponse> => {
    try {
        const response: AxiosResponse<GetPostsResponse> = await adminApi.post('/proto/admin/posts', request);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const deletePost = async (request: DeletePostRequest): Promise<DeletePostResponse> => {
    try {
        const response: AxiosResponse<DeletePostResponse> = await adminApi.post('/proto/admin/posts/delete', request);
        return response.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

export const togglePostVisibility = async (request: TogglePostVisibilityRequest): Promise<TogglePostVisibilityResponse> => {
    try {
        const response: AxiosResponse<TogglePostVisibilityResponse> = await adminApi.post('/proto/admin/posts/toggle-visibility', request);
        return response.data;
    } catch (error) {
        console.error('Error toggling post visibility:', error);
        throw error;
    }
};
