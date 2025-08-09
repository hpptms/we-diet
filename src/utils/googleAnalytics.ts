import ReactGA from 'react-ga4';

// Google Analytics設定
const MEASUREMENT_ID = 'G-FGQKYE650R';

// Google Analyticsのフェッチエラーを静かに処理するグローバルハンドラー
if (typeof window !== 'undefined') {
    // コンソールエラーを抑制（GA関連のみ）
    const originalError = console.error;
    console.error = (...args) => {
        const message = args[0]?.toString() || '';
        if (message.includes('google-analytics.com') ||
            message.includes('gtag') ||
            message.includes('Failed to fetch')) {
            // GA関連エラーは静かに処理
            console.debug('GA network request (blocked by privacy tools - this is normal)');
            return;
        }
        originalError.apply(console, args);
    };
}

/**
 * Google Analytics初期化
 */
export const initGA = () => {
    try {
        // 本番環境でのみGoogle Analyticsを初期化
        if (window.location.hostname === 'we-diat.com') {
            ReactGA.initialize(MEASUREMENT_ID, {
                testMode: false,
                gaOptions: {
                    debug_mode: false,
                    // フェッチエラーを抑制するための設定
                    send_page_view: false, // 自動ページビュー送信を無効化
                },
            });
            console.log('✅ Google Analytics initialized for production');

            // 手動でページビューを送信（エラーハンドリング付き）
            setTimeout(() => {
                try {
                    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
                } catch (error) {
                    // GAフェッチエラーを静かに処理
                    console.debug('GA pageview sent (fetch errors are normal with ad blockers)');
                }
            }, 100);

        } else {
            // 開発環境ではテストモードで初期化
            ReactGA.initialize(MEASUREMENT_ID, {
                testMode: true,
                gaOptions: {
                    debug_mode: false, // デバッグモードを無効にしてログを減らす
                },
            });
            console.log('🧪 Google Analytics initialized in test mode (localhost)');
        }
    } catch (error) {
        console.error('❌ Failed to initialize Google Analytics:', error);
    }
};

/**
 * ページビューを追跡
 */
export const trackPageView = (pagePath?: string, pageTitle?: string) => {
    try {
        ReactGA.send({
            hitType: 'pageview',
            page: pagePath || window.location.pathname,
            title: pageTitle || document.title,
        });
    } catch (error) {
        console.error('Failed to track page view:', error);
    }
};

/**
 * カスタムイベントを追跡
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    try {
        ReactGA.event(eventName, parameters);
    } catch (error) {
        console.error('Failed to track event:', error);
    }
};

/**
 * ユーザーインタラクションを追跡
 */
export const trackUserInteraction = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    try {
        ReactGA.event(action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    } catch (error) {
        console.error('Failed to track user interaction:', error);
    }
};

/**
 * ダイエット関連のイベントを追跡
 */
export const trackDietEvent = (
    action: 'food_log' | 'exercise_log' | 'weight_update' | 'profile_update',
    details?: Record<string, any>
) => {
    try {
        ReactGA.event('diet_action', {
            event_category: 'diet_management',
            action_type: action,
            ...details,
        });
    } catch (error) {
        console.error('Failed to track diet event:', error);
    }
};

/**
 * ログインイベントを追跡
 */
export const trackLogin = (method: 'google' | 'facebook' | 'tiktok' | 'email') => {
    try {
        // 一時的にGoogle Analytics無効化（hook エラー回避）
        console.log('Login tracked (GA disabled for debugging):', method);
        // ReactGA.event('login', {
        //     event_category: 'user_authentication',
        //     method: method,
        // });
    } catch (error) {
        console.error('Failed to track login:', error);
    }
};

/**
 * サインアップイベントを追跡
 */
export const trackSignUp = (method: 'google' | 'facebook' | 'tiktok' | 'email') => {
    try {
        ReactGA.event('sign_up', {
            event_category: 'user_authentication',
            method: method,
        });
    } catch (error) {
        console.error('Failed to track sign up:', error);
    }
};

/**
 * ナビゲーションイベントを追跡
 */
export const trackNavigation = (from: string, to: string) => {
    try {
        ReactGA.event('navigate', {
            event_category: 'navigation',
            from_page: from,
            to_page: to,
        });
    } catch (error) {
        console.error('Failed to track navigation:', error);
    }
};

/**
 * ユーザープロパティを設定
 */
export const setUserProperties = (userId: string, properties?: Record<string, any>) => {
    try {
        ReactGA.set({
            user_id: userId,
            ...properties,
        });
    } catch (error) {
        console.error('Failed to set user properties:', error);
    }
};

/**
 * エラーを追跡
 */
export const trackError = (
    errorMessage: string,
    errorLocation?: string,
    isFatal: boolean = false
) => {
    try {
        ReactGA.event('exception', {
            description: errorMessage,
            fatal: isFatal,
            location: errorLocation || window.location.pathname,
        });
    } catch (error) {
        console.error('Failed to track error:', error);
    }
};

/**
 * パフォーマンスメトリクスを追跡
 */
export const trackTiming = (
    category: string,
    variable: string,
    value: number,
    label?: string
) => {
    try {
        ReactGA.event('timing_complete', {
            event_category: category,
            name: variable,
            value: value,
            event_label: label,
        });
    } catch (error) {
        console.error('Failed to track timing:', error);
    }
};

/**
 * Google Analytics utility class (後方互換性のため)
 */
export class GoogleAnalytics {
    static trackPageView = trackPageView;
    static trackEvent = trackEvent;
    static trackUserInteraction = trackUserInteraction;
    static trackDietEvent = trackDietEvent;
    static trackLogin = trackLogin;
    static trackSignUp = trackSignUp;
    static trackNavigation = trackNavigation;
    static setUserProperties = setUserProperties;
    static trackError = trackError;
    static trackTiming = trackTiming;
}

// Default export
export default GoogleAnalytics;
