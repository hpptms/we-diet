// Proto definitions for Food Log

export interface CreateFoodLogRequest {
    user_id: number;
    date: string;
    diary: string;
    photos: string[];
    is_public: boolean;
}

export interface CreateFoodLogResponse {
    success: boolean;
    message: string;
    record?: FoodLog;
}

export interface GetFoodLogRequest {
    user_id: number;
    date: string;
}

export interface GetFoodLogResponse {
    success: boolean;
    message: string;
    record?: FoodLog;
}

export interface GetFoodLogsRequest {
    user_id: number;
    start_date?: string;
    end_date?: string;
}

export interface GetFoodLogsResponse {
    success: boolean;
    message: string;
    records: FoodLog[];
}

export interface FoodLog {
    id: number;
    user_id: number;
    date: string;
    diary: string;
    photos: string[];
    is_public: boolean;
    created_at: string;
    updated_at: string;
}
