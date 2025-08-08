import { API_BASE_URL } from '../api/dieterApi';

export interface IndexNowResponse {
    message: string;
}

export interface IndexNowError {
    error: string;
}

// 単一URLをIndexNowに送信
export const submitURLToIndexNow = async (url: string): Promise<IndexNowResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/indexnow/submit-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            const errorData: IndexNowError = await response.json();
            throw new Error(errorData.error || 'IndexNow submission failed');
        }

        return await response.json();
    } catch (error) {
        console.error('IndexNow URL submission error:', error);
        throw error;
    }
};

// 複数URLをIndexNowに送信
export const submitURLsToIndexNow = async (urls: string[]): Promise<IndexNowResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/indexnow/submit-urls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ urls }),
        });

        if (!response.ok) {
            const errorData: IndexNowError = await response.json();
            throw new Error(errorData.error || 'IndexNow submission failed');
        }

        return await response.json();
    } catch (error) {
        console.error('IndexNow URLs submission error:', error);
        throw error;
    }
};

// 投稿作成時に自動的にIndexNowに送信するヘルパー関数
export const notifyPostCreation = async (postId: number): Promise<void> => {
    try {
        const postUrl = `https://we-diat.com/post/${postId}`;
        await submitURLToIndexNow(postUrl);
        console.log('Post URL submitted to IndexNow:', postUrl);
    } catch (error) {
        console.error('Failed to notify IndexNow about new post:', error);
        // エラーが発生してもメイン処理は継続
    }
};

// サイトマップ更新時にIndexNowに通知するヘルパー関数
export const notifySitemapUpdate = async (): Promise<void> => {
    try {
        const urls = [
            'https://we-diat.com/sitemap.xml',
            'https://we-diat.com/sitemap_multilang.xml'
        ];
        await submitURLsToIndexNow(urls);
        console.log('Sitemap URLs submitted to IndexNow');
    } catch (error) {
        console.error('Failed to notify IndexNow about sitemap update:', error);
        // エラーが発生してもメイン処理は継続
    }
};
