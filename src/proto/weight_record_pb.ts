export interface WeightRecord {
    id: number;
    user_id: number;
    date: string; // YYYY-MM-DD format
    weight: number;
    body_fat?: number;
    note: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateWeightRecordRequest {
    user_id: number;
    date: string; // YYYY-MM-DD format
    weight: number;
    body_fat?: number;
    note: string;
    is_public: boolean;
}

export interface CreateWeightRecordResponse {
    message: string;
    record: WeightRecord;
}

export interface GetWeightRecordRequest {
    user_id: number;
    date: string; // YYYY-MM-DD format
}

export interface GetWeightRecordResponse {
    record: WeightRecord;
}

export interface GetWeightRecordsRequest {
    user_id: number;
    start_date?: string; // YYYY-MM-DD format
    end_date?: string; // YYYY-MM-DD format
}

export interface GetWeightRecordsResponse {
    records: WeightRecord[];
}

export interface UpdateWeightRecordRequest {
    id: number;
    user_id: number;
    date: string; // YYYY-MM-DD format
    weight: number;
    body_fat?: number;
    note: string;
    is_public: boolean;
}

export interface UpdateWeightRecordResponse {
    message: string;
    record: WeightRecord;
}

export interface DeleteWeightRecordRequest {
    id: number;
}

export interface DeleteWeightRecordResponse {
    message: string;
}
