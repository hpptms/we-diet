import axios from 'axios';

// ExerciseRecord API for protobuf communication
export interface CreateExerciseRecordRequest {
    user_id: number;
    date: string;
    walking_distance: string;
    walking_time: string;
    running_distance: string;
    running_time: string;
    push_ups: string;
    sit_ups: string;
    squats: string;
    other_exercise_time: string;
    today_weight: string;
    exercise_note: string;
    today_images: string[]; // Base64 encoded images
    is_public: boolean;
    has_weight_input: boolean;
}

export interface CreateExerciseRecordResponse {
    success: boolean;
    message: string;
    calories_burned: number;
    record?: any;
}

export interface GetExerciseRecordRequest {
    user_id: number;
    date: string;
}

export interface GetExerciseRecordResponse {
    found: boolean;
    record?: any;
}

// Convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

class ExerciseRecordApi {
    private baseUrl = import.meta.env.VITE_API_BASE_URL;

    async createExerciseRecord(data: {
        userId: number;
        date: string;
        walkingDistance: string;
        walkingTime: string;
        runningDistance: string;
        runningTime: string;
        pushUps: string;
        sitUps: string;
        squats: string;
        otherExerciseTime: string;
        todayWeight: string;
        exerciseNote: string;
        todayImages: File[];
        isPublic: boolean;
        hasWeightInput: boolean;
    }): Promise<CreateExerciseRecordResponse> {
        try {
            // Convert files to base64
            const base64Images: string[] = [];
            for (const file of data.todayImages) {
                try {
                    const base64 = await fileToBase64(file);
                    base64Images.push(base64);
                } catch (error) {
                    console.error('Failed to convert image to base64:', error);
                }
            }

            const request: CreateExerciseRecordRequest = {
                user_id: data.userId,
                date: data.date,
                walking_distance: data.walkingDistance,
                walking_time: data.walkingTime,
                running_distance: data.runningDistance,
                running_time: data.runningTime,
                push_ups: data.pushUps,
                sit_ups: data.sitUps,
                squats: data.squats,
                other_exercise_time: data.otherExerciseTime,
                today_weight: data.todayWeight,
                exercise_note: data.exerciseNote,
                today_images: base64Images,
                is_public: data.isPublic,
                has_weight_input: data.hasWeightInput,
            };

            const response = await axios.post<CreateExerciseRecordResponse>(
                `${this.baseUrl}/api/proto/exercise_record/create`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error creating exercise record:', error);
            throw error;
        }
    }

    async getExerciseRecord(userId: number, date: string): Promise<GetExerciseRecordResponse> {
        try {
            const request: GetExerciseRecordRequest = {
                user_id: userId,
                date: date,
            };

            const response = await axios.post<GetExerciseRecordResponse>(
                `${this.baseUrl}/api/proto/exercise_record/get`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error getting exercise record:', error);
            throw error;
        }
    }
}

export const exerciseRecordApi = new ExerciseRecordApi();
