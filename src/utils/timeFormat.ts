/**
 * 相対時間をフォーマットするユーティリティ関数
 * PostCard.tsxで3つの同じ関数が定義されていたため、共通化
 */

/**
 * タイムスタンプを相対時間でフォーマット（例：「5分前」「2時間前」「3日前」）
 * @param timestamp - ISO形式のタイムスタンプ
 * @param showJustNow - 1分未満の場合に「たった今」を表示するかどうか
 * @returns フォーマットされた相対時間文字列
 */
export const formatRelativeTime = (timestamp: string, showJustNow: boolean = false): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
        return `${diffDays}日前`;
    } else if (diffHours > 0) {
        return `${diffHours}時間前`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes}分前`;
    } else {
        return showJustNow ? 'たった今' : '0分前';
    }
};

/**
 * タイムスタンプを日時形式でフォーマット（例：「2024/01/17 14:30」）
 * @param timestamp - ISO形式のタイムスタンプ
 * @returns フォーマットされた日時文字列
 */
export const formatDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
};
