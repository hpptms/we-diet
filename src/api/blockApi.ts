import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Block/Unblockは現状リクエストボディなし。レスポンスも特にデータなし（204/200）。
export const blockUser = async (userId: number): Promise<void> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        throw new Error('認証トークンがありません');
    }

    try {
        await axios.post(
            `${API_BASE_URL}/api/users/${userId}/block`,
            new Uint8Array(), // 空のprotobufバイナリ
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-protobuf',
                    'Accept': 'application/x-protobuf',
                },
                responseType: 'arraybuffer',
            }
        );
    } catch (error: any) {
        if (error.response && error.response.data) {
            // サーバーがprotobufでエラー返す場合はここでdecodeする
            throw new Error('ブロックに失敗しました');
        }
        throw error;
    }
};

export const unblockUser = async (userId: number): Promise<void> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        throw new Error('認証トークンがありません');
    }

    try {
        await axios.delete(
            `${API_BASE_URL}/api/users/${userId}/block`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-protobuf',
                    'Accept': 'application/x-protobuf',
                },
                responseType: 'arraybuffer',
                data: new Uint8Array(), // axiosのDELETEはdataを明示
            }
        );
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error('ブロック解除に失敗しました');
        }
        throw error;
    }
};

import { BlockedUsersResponse } from '../proto/dieter';

// ブロックリスト取得（protobufでBlockedUsersResponseを返す）
export const getBlockedUsers = async (): Promise<BlockedUsersResponse['blockedUsers']> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        throw new Error('認証トークンがありません');
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/users/blocked`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/x-protobuf',
            },
            responseType: 'arraybuffer',
        }
    );

    // BlockedUsersResponseのprotobufデコード
    const reader = new Uint8Array(response.data);
    const decoded = BlockedUsersResponse.fromBinary(reader);
    return decoded.blockedUsers;
};

// ブロック状態確認（protobufでbool返す想定）
export const checkBlockStatus = async (userId: number): Promise<boolean> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        return false;
    }

    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/users/${userId}/block-status`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/x-protobuf',
                },
                responseType: 'arraybuffer',
            }
        );
        // サーバーがboolのみ返す場合は専用のレスポンス型を作るべき
        // ここでは仮に1byteでtrue/false返すと仮定
        const data = new Uint8Array(response.data);
        return data[0] === 1;
    } catch (error) {
        console.error('ブロック状態の確認に失敗しました:', error);
    }

    return false;
};
