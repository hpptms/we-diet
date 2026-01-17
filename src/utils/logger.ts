/**
 * ロギングユーティリティ
 * 本番環境ではconsole.logを無効化
 */

const isDev = import.meta.env.DEV;

/**
 * 開発環境でのみログを出力する
 */
export const logger = {
    log: (...args: unknown[]) => {
        if (isDev) console.log(...args);
    },
    warn: (...args: unknown[]) => {
        if (isDev) console.warn(...args);
    },
    error: (...args: unknown[]) => {
        // エラーは本番環境でも出力
        console.error(...args);
    },
    info: (...args: unknown[]) => {
        if (isDev) console.info(...args);
    },
    debug: (...args: unknown[]) => {
        if (isDev) console.debug(...args);
    },
};

export default logger;
