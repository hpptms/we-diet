// グローバルデバッグログユーティリティ

interface DebugLogEntry {
    user_id?: number;
    log_level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    message: string;
    details?: string;
    source?: string;
}

class DebugLogger {
    private apiEndpoint: string;
    private defaultUserId: number;
    private isEnabled: boolean;

    constructor() {
        this.apiEndpoint = import.meta.env.VITE_API_ENDPOINT || 'https://we-diet-backend.com/api/';
        this.defaultUserId = 1; // デフォルトユーザーID
        this.isEnabled = true;
    }

    // ユーザーIDを設定
    setUserId(userId: number): void {
        this.defaultUserId = userId;
    }

    // デバッグログの有効/無効を切り替え
    setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }

    // ログをサーバーに送信
    private async sendLog(entry: DebugLogEntry): Promise<void> {
        if (!this.isEnabled) {
            return;
        }

        try {
            const logData = {
                user_id: entry.user_id || this.defaultUserId,
                log_level: entry.log_level,
                message: entry.message,
                details: entry.details || '',
                source: entry.source || 'frontend',
                user_agent: navigator.userAgent,
                url: window.location.href,
            };

            // コンソール出力を無効化（サイレント処理）
            // Details are still preserved in DB logs

            const token = localStorage.getItem('jwt_token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${this.apiEndpoint}debug_log`, {
                method: 'POST',
                headers,
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                // Debug log send failed - silent handling
            }
        } catch (error) {
            // Debug log send error - silent handling
            // ログ送信に失敗してもアプリケーションの動作は継続
        }
    }

    // INFOレベルのログ
    info(message: string, details?: any, source?: string): void {
        this.sendLog({
            log_level: 'INFO',
            message,
            details: details ? JSON.stringify(details, null, 2) : undefined,
            source,
        });
    }

    // WARNレベルのログ
    warn(message: string, details?: any, source?: string): void {
        this.sendLog({
            log_level: 'WARN',
            message,
            details: details ? JSON.stringify(details, null, 2) : undefined,
            source,
        });
    }

    // ERRORレベルのログ
    error(message: string, details?: any, source?: string): void {
        this.sendLog({
            log_level: 'ERROR',
            message,
            details: details ? JSON.stringify(details, null, 2) : undefined,
            source,
        });
    }

    // DEBUGレベルのログ
    debug(message: string, details?: any, source?: string): void {
        this.sendLog({
            log_level: 'DEBUG',
            message,
            details: details ? JSON.stringify(details, null, 2) : undefined,
            source,
        });
    }

    // Google Fit エラー専用メソッド
    googleFitError(message: string, error: any, additionalInfo?: any): void {
        this.error(
            `Google Fit Error: ${message}`,
            {
                error: error,
                errorType: typeof error,
                errorString: error ? error.toString() : 'unknown',
                additionalInfo: additionalInfo || {},
                timestamp: new Date().toISOString(),
            },
            'google-fit'
        );
    }

    // Google Fit 設定情報専用メソッド
    googleFitConfig(config: any): void {
        this.info(
            'Google Fit Configuration',
            {
                config: config,
                timestamp: new Date().toISOString(),
                environment: import.meta.env.DEV ? 'development' : 'production',
            },
            'google-fit-config'
        );
    }
}

// グローバルインスタンスを作成
const debugLogger = new DebugLogger();

// デフォルトエクスポート
export default debugLogger;

// 名前付きエクスポートも提供
export { debugLogger, DebugLogger };
export type { DebugLogEntry };
