// Request type for getting recorded dates in a specific month
export interface GetFoodLogDatesRequest {
    user_id: number;
    year: number;
    month: number;
}

// Response type for getting recorded dates in a specific month
export interface GetFoodLogDatesResponse {
    success: boolean;
    message: string;
    recorded_days: number[];
}
