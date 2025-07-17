// Generated from user_profile.proto

export interface UserProfile {
    id?: number;
    user_id?: number;
    display_name?: string;
    selected_preset_id?: number | null;
    icon_type?: string;
    uploaded_icon?: string | null;
    gender?: string;
    age?: number | null;
    activity_level?: string;
    current_weight?: number | null;
    target_weight?: number | null;
    show_preset?: boolean;
    pr_text?: string;
    is_gender_private?: boolean;
    is_age_private?: boolean;
    is_activity_private?: boolean;
    is_current_weight_private?: boolean;
    is_target_weight_private?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateUserProfileRequest {
    user_id: number;
    display_name: string;
    selected_preset_id?: number | null;
    icon_type: string;
    uploaded_icon?: string | null;
    gender: string;
    age?: number | null;
    activity_level: string;
    current_weight?: number | null;
    target_weight?: number | null;
    show_preset: boolean;
    pr_text: string;
    is_gender_private: boolean;
    is_age_private: boolean;
    is_activity_private: boolean;
    is_current_weight_private: boolean;
    is_target_weight_private: boolean;
}

export interface CreateUserProfileResponse {
    profile?: UserProfile;
    message?: string;
}

export interface GetUserProfileRequest {
    user_id: number;
}

export interface GetUserProfileResponse {
    profile?: UserProfile;
    message?: string;
}

export interface UpdateUserProfileRequest {
    user_id: number;
    display_name: string;
    selected_preset_id?: number | null;
    icon_type: string;
    uploaded_icon?: string | null;
    gender: string;
    age?: number | null;
    activity_level: string;
    current_weight?: number | null;
    target_weight?: number | null;
    show_preset: boolean;
    pr_text: string;
    is_gender_private: boolean;
    is_age_private: boolean;
    is_activity_private: boolean;
    is_current_weight_private: boolean;
    is_target_weight_private: boolean;
}

export interface UpdateUserProfileResponse {
    profile?: UserProfile;
    message?: string;
}

export interface UploadUserIconRequest {
    image_data: Uint8Array;
    file_name: string;
}

export interface UploadUserIconResponse {
    url?: string;
    message?: string;
}
