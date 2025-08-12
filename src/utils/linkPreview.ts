// URL検出とメタデータ取得のユーティリティ

export interface LinkPreview {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    type: 'website' | 'youtube' | 'tiktok' | 'twitter' | 'instagram';
}

export interface MediaEmbed {
    url: string;
    type: 'youtube' | 'tiktok';
    embedId: string;
    title?: string;
    thumbnail?: string;
}

// URLパターンの正規表現
const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const YOUTUBE_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
const TIKTOK_REGEX = /tiktok\.com\/.*\/video\/(\d+)/;

// URLからドメインを抽出
export const extractDomain = (url: string): string => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return '';
    }
};

// テキストからURLを抽出
export const extractUrls = (text: string): string[] => {
    const matches = text.match(URL_REGEX);
    return matches || [];
};

// YouTubeのビデオIDを抽出
export const extractYouTubeId = (url: string): string | null => {
    const match = url.match(YOUTUBE_REGEX);
    return match ? match[1] : null;
};

// TikTokのビデオIDを抽出
export const extractTikTokId = (url: string): string | null => {
    const match = url.match(TIKTOK_REGEX);
    return match ? match[1] : null;
};

// URLの種類を判定
export const detectUrlType = (url: string): LinkPreview['type'] => {
    const domain = extractDomain(url);

    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
        return 'youtube';
    }
    if (domain.includes('tiktok.com')) {
        return 'tiktok';
    }
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
        return 'twitter';
    }
    if (domain.includes('instagram.com')) {
        return 'instagram';
    }

    return 'website';
};

// メディア埋め込み情報を生成
export const createMediaEmbed = (url: string): MediaEmbed | null => {
    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
        return {
            url,
            type: 'youtube',
            embedId: youtubeId,
            thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        };
    }

    const tiktokId = extractTikTokId(url);
    if (tiktokId) {
        return {
            url,
            type: 'tiktok',
            embedId: tiktokId
        };
    }

    return null;
};

// リンクプレビューデータを生成（フォールバック）
export const createLinkPreview = (url: string): LinkPreview => {
    const domain = extractDomain(url);
    const type = detectUrlType(url);

    // YouTube用のメタデータ
    if (type === 'youtube') {
        const videoId = extractYouTubeId(url);
        return {
            url,
            type,
            title: 'YouTube Video',
            siteName: 'YouTube',
            image: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined
        };
    }

    // TikTok用のメタデータ
    if (type === 'tiktok') {
        return {
            url,
            type,
            title: 'TikTok Video',
            siteName: 'TikTok'
        };
    }

    // 一般的なウェブサイト
    return {
        url,
        type: 'website',
        title: domain,
        siteName: domain
    };
};

// メタデータ取得API（将来的にバックエンドで実装予定）
export const fetchLinkMetadata = async (url: string): Promise<LinkPreview> => {
    try {
        // TODO: バックエンドAPIでメタデータを取得
        // 現在はクライアントサイドでフォールバック
        return createLinkPreview(url);
    } catch (error) {
        console.error('Failed to fetch link metadata:', error);
        return createLinkPreview(url);
    }
};
