// Google Analytics utility functions with error handling

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

/**
 * Google Analytics utility class with comprehensive error handling
 */
export class GoogleAnalytics {
    private static isProduction = window.location.hostname === 'we-diat.com';
    private static isGAAvailable = typeof window.gtag === 'function';

    /**
     * Check if Google Analytics is available and should be used
     */
    private static canUseGA(): boolean {
        return this.isProduction && this.isGAAvailable && typeof window.gtag === 'function';
    }

    /**
     * Safely execute gtag function with error handling
     */
    private static safeGtag(...args: any[]): void {
        if (!this.canUseGA()) {
            console.log('GA call skipped (development or GA unavailable):', args);
            return;
        }

        try {
            window.gtag(...args);
        } catch (error) {
            console.warn('Google Analytics call failed:', error, 'Args:', args);
        }
    }

    /**
     * Track page views
     */
    static trackPageView(pagePath?: string, pageTitle?: string): void {
        this.safeGtag('config', 'G-FGQKYE650R', {
            page_path: pagePath || window.location.pathname,
            page_title: pageTitle || document.title,
        });
    }

    /**
     * Track custom events
     */
    static trackEvent(eventName: string, parameters?: Record<string, any>): void {
        const eventData = {
            send_to: 'G-FGQKYE650R',
            ...parameters,
        };

        this.safeGtag('event', eventName, eventData);
    }

    /**
     * Track user interactions
     */
    static trackUserInteraction(action: string, category: string, label?: string, value?: number): void {
        this.trackEvent(action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }

    /**
     * Track diet-specific events
     */
    static trackDietEvent(action: 'food_log' | 'exercise_log' | 'weight_update' | 'profile_update', details?: Record<string, any>): void {
        this.trackEvent('diet_action', {
            event_category: 'diet_management',
            action_type: action,
            ...details,
        });
    }

    /**
     * Track login events
     */
    static trackLogin(method: 'google' | 'facebook' | 'tiktok' | 'email'): void {
        this.trackEvent('login', {
            event_category: 'user_authentication',
            method: method,
        });
    }

    /**
     * Track sign up events
     */
    static trackSignUp(method: 'google' | 'facebook' | 'tiktok' | 'email'): void {
        this.trackEvent('sign_up', {
            event_category: 'user_authentication',
            method: method,
        });
    }

    /**
     * Track navigation events
     */
    static trackNavigation(from: string, to: string): void {
        this.trackEvent('navigate', {
            event_category: 'navigation',
            from_page: from,
            to_page: to,
        });
    }

    /**
     * Set user properties (when user logs in)
     */
    static setUserProperties(userId: string, properties?: Record<string, any>): void {
        this.safeGtag('config', 'G-FGQKYE650R', {
            user_id: userId,
            custom_map: properties,
        });
    }

    /**
     * Track errors
     */
    static trackError(errorMessage: string, errorLocation?: string, isFatal: boolean = false): void {
        this.trackEvent('exception', {
            event_category: 'error',
            description: errorMessage,
            location: errorLocation || window.location.pathname,
            fatal: isFatal,
        });
    }

    /**
     * Track performance metrics
     */
    static trackTiming(category: string, variable: string, value: number, label?: string): void {
        this.trackEvent('timing_complete', {
            event_category: category,
            name: variable,
            value: value,
            event_label: label,
        });
    }
}

// Export convenience functions
export const {
    trackPageView,
    trackEvent,
    trackUserInteraction,
    trackDietEvent,
    trackLogin,
    trackSignUp,
    trackNavigation,
    setUserProperties,
    trackError,
    trackTiming,
} = GoogleAnalytics;

// Default export
export default GoogleAnalytics;
