// Cloudinary画像最適化ユーティリティ

/**
 * Cloudinary URLに画像最適化パラメータを追加
 * @param originalUrl - 元のCloudinary URL
 * @param width - 表示幅（px）
 * @param height - 表示高さ（px）、未指定の場合はwidthから計算
 * @param quality - 画質（auto推奨）
 * @param format - フォーマット（auto推奨）
 * @returns 最適化されたURL
 */
export const optimizeCloudinaryImage = (
    originalUrl: string,
    width: number,
    height?: number,
    quality: string = 'auto',
    format: string = 'auto'
): string => {
    if (!originalUrl.includes('res.cloudinary.com')) {
        return originalUrl;
    }

    // URLを分解して変換パラメータを挿入
    const parts = originalUrl.split('/upload/');
    if (parts.length !== 2) {
        return originalUrl;
    }

    const baseUrl = parts[0];
    const imagePath = parts[1];

    // 変換パラメータを構築
    const transformations = [
        `w_${width}`,
        height ? `h_${height}` : null,
        `c_fill`, // アスペクト比を保持しながらクロップ
        `q_${quality}`,
        `f_${format}`,
        'dpr_auto' // デバイスピクセル比を自動調整
    ].filter(Boolean).join(',');

    return `${baseUrl}/upload/${transformations}/${imagePath}`;
};

/**
 * レスポンシブ画像用のsrcsetを生成
 * @param originalUrl - 元のCloudinary URL
 * @param baseWidth - ベース幅
 * @param aspectRatio - アスペクト比（width/height）
 * @returns srcset文字列
 */
export const generateResponsiveSrcSet = (
    originalUrl: string,
    baseWidth: number,
    aspectRatio: number = 1
): string => {
    const widths = [baseWidth, baseWidth * 1.5, baseWidth * 2];

    return widths
        .map(width => {
            const height = Math.round(width / aspectRatio);
            const optimizedUrl = optimizeCloudinaryImage(originalUrl, width, height);
            return `${optimizedUrl} ${width}w`;
        })
        .join(', ');
};

/**
 * 画像サイズに基づいた最適化設定の取得
 * @param displayWidth - 表示幅
 * @param displayHeight - 表示高さ
 * @returns 最適化されたURL生成関数
 */
export const getOptimizedImageUrl = (displayWidth: number, displayHeight?: number) => {
    return (originalUrl: string) => {
        // デバイスピクセル比を考慮して1.5倍のサイズで生成
        const optimizedWidth = Math.round(displayWidth * 1.5);
        const optimizedHeight = displayHeight ? Math.round(displayHeight * 1.5) : undefined;

        return optimizeCloudinaryImage(originalUrl, optimizedWidth, optimizedHeight);
    };
};
