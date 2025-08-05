// 通知管理システム

export interface NotificationSettings {
    enabled: boolean;
    sound: boolean;
    immediate: boolean; // 即座通知 or 10分制限
    lastNotificationTime: number;
}

class NotificationManager {
    private settings: NotificationSettings;
    private readonly NOTIFICATION_INTERVAL = 10 * 60 * 1000; // 10分

    constructor() {
        this.settings = this.loadSettings();
    }

    private loadSettings(): NotificationSettings {
        const saved = localStorage.getItem('notificationSettings');
        return saved ? JSON.parse(saved) : {
            enabled: false,
            sound: false,
            immediate: false,
            lastNotificationTime: 0
        };
    }

    private saveSettings(): void {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    }

    // 通知権限を要求
    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('このブラウザは通知をサポートしていません');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission === 'denied') {
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    // Service Workerに通知を送信
    private async sendNotificationToSW(title: string, options: NotificationOptions): Promise<void> {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'SHOW_NOTIFICATION',
                data: { title, options }
            });
        } else {
            // フォールバック: 直接通知を表示
            new Notification(title, options);
        }
    }

    // 通知を表示（制限チェック付き）
    async showNotification(title: string, body: string, type: 'message' | 'notification' = 'notification'): Promise<void> {
        if (!this.settings.enabled || Notification.permission !== 'granted') {
            return;
        }

        const now = Date.now();

        // 即座通知でない場合は10分制限をチェック
        if (!this.settings.immediate) {
            if (now - this.settings.lastNotificationTime < this.NOTIFICATION_INTERVAL) {
                console.log('通知制限中: 10分以内の通知はスキップ');
                return;
            }
        }

        const options: NotificationOptions = {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: type, // 同じタイプの通知は置き換える
            silent: !this.settings.sound, // 音の設定
            requireInteraction: false,
            data: {
                type,
                timestamp: now,
                url: window.location.href
            }
        };

        // アイコンをタイプに応じて変更
        if (type === 'message') {
            options.icon = '/favicon.ico'; // メッセージ用アイコン
        }

        await this.sendNotificationToSW(title, options);

        this.settings.lastNotificationTime = now;
        this.saveSettings();
    }

    // メッセージ通知
    async showMessageNotification(senderName: string, messagePreview: string): Promise<void> {
        await this.showNotification(
            `新しいメッセージ from ${senderName}`,
            messagePreview.length > 50 ? messagePreview.substring(0, 47) + '...' : messagePreview,
            'message'
        );
    }

    // 一般通知
    async showGeneralNotification(title: string, body: string): Promise<void> {
        await this.showNotification(title, body, 'notification');
    }

    // 設定の更新
    updateSettings(newSettings: Partial<NotificationSettings>): void {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }

    // 現在の設定を取得
    getSettings(): NotificationSettings {
        return { ...this.settings };
    }

    // 通知の有効化
    async enableNotifications(): Promise<boolean> {
        const hasPermission = await this.requestPermission();
        if (hasPermission) {
            this.updateSettings({ enabled: true });
        }
        return hasPermission;
    }

    // 通知の無効化
    disableNotifications(): void {
        this.updateSettings({ enabled: false });
    }

    // 音の有効/無効
    toggleSound(enabled: boolean): void {
        this.updateSettings({ sound: enabled });
    }

    // 即座通知の有効/無効
    toggleImmediate(enabled: boolean): void {
        this.updateSettings({ immediate: enabled });
    }

    // 未読数の表示（バッジ対応ブラウザの場合）
    updateBadge(count: number): void {
        if ('setAppBadge' in navigator) {
            if (count > 0) {
                (navigator as any).setAppBadge(count);
            } else {
                (navigator as any).clearAppBadge();
            }
        }
    }
}

export const notificationManager = new NotificationManager();
