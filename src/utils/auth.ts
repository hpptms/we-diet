/**
 * 認証関連のユーティリティ関数
 */

// ローカルストレージのトークンキー
const TOKEN_KEYS = ['jwt_token', 'authToken', 'token'] as const;

/**
 * JWTトークンを取得する
 * 複数のキーをチェックし、最初に見つかったトークンを返す
 */
export const getAuthToken = (): string | null => {
    for (const key of TOKEN_KEYS) {
        const token = localStorage.getItem(key);
        if (token) return token;
    }
    return null;
};

/**
 * 全てのトークンを削除する
 * 認証エラー時に使用
 */
export const clearAuthTokens = (): void => {
    TOKEN_KEYS.forEach(key => localStorage.removeItem(key));
};

/**
 * 現在のユーザーIDを取得する
 * 複数のソースからユーザーIDを取得を試みる
 */
export const getCurrentUserId = (): number | null => {
    try {
        // user_idフィールドを最初に確認
        const userId = localStorage.getItem('user_id');
        if (userId) {
            return parseInt(userId, 10);
        }

        // serverProfileDataからユーザーIDを取得
        const serverProfileData = localStorage.getItem('serverProfileData');
        if (serverProfileData) {
            const parsed = JSON.parse(serverProfileData);
            if (parsed.userId) {
                return parsed.userId;
            }
        }

        // accountIdフィールドを確認
        const accountId = localStorage.getItem('accountId');
        if (accountId) {
            return parseInt(accountId, 10);
        }

        // userIdフィールドを確認
        const userIdAlt = localStorage.getItem('userId');
        if (userIdAlt) {
            return parseInt(userIdAlt, 10);
        }

        return null;
    } catch (error) {
        console.error('ユーザーID取得でエラー:', error);
        return null;
    }
};

/**
 * 認証ヘッダーを生成する
 */
export const getAuthHeaders = (): Record<string, string> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};
