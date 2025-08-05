// Locale and regional customization system
import { SupportedLanguage } from './languageDetection';

export interface RegionalConfig {
    currency: string;
    currencySymbol: string;
    numberFormat: Intl.NumberFormatOptions;
    dateFormat: Intl.DateTimeFormatOptions;
    timeFormat: Intl.DateTimeFormatOptions;
    timezone: string;
    measurementSystem: 'metric' | 'imperial';
    weightUnit: 'kg' | 'lbs';
    heightUnit: 'cm' | 'ft';
    temperatureUnit: 'celsius' | 'fahrenheit';
}

export interface LocaleVariant {
    id: string;
    name: string;
    description: string;
    targetAudience: string[];
    features: Record<string, boolean>;
    customStyles?: Record<string, string>;
    customContent?: Record<string, string>;
    isActive: boolean;
    trafficPercentage: number; // for A/B testing
}

export interface ABTestConfig {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    variants: LocaleVariant[];
    metrics: string[];
    targetLanguages: SupportedLanguage[];
}

export type LocaleKey =
    | 'ja-JP'
    | 'en-US'
    | 'en-GB'
    | 'zh-CN'
    | 'zh-TW'
    | 'ko-KR'
    | 'de-DE'
    | 'de-AT'
    | 'es-ES'
    | 'es-MX'
    | 'es-AR';

export class LocaleManager {
    private static instance: LocaleManager;
    private regionalConfigs: Map<LocaleKey, RegionalConfig> = new Map();
    private abTests: Map<string, ABTestConfig> = new Map();
    private userVariants: Map<string, LocaleVariant> = new Map();
    private currentLocale: LocaleKey = 'ja-JP';

    private constructor() {
        this.initializeRegionalConfigs();
        this.loadABTests();
    }

    public static getInstance(): LocaleManager {
        if (!LocaleManager.instance) {
            LocaleManager.instance = new LocaleManager();
        }
        return LocaleManager.instance;
    }

    private initializeRegionalConfigs(): void {
        // Japan
        this.regionalConfigs.set('ja-JP', {
            currency: 'JPY',
            currencySymbol: '¥',
            numberFormat: { style: 'decimal', minimumFractionDigits: 0 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            timezone: 'Asia/Tokyo',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });

        // United States
        this.regionalConfigs.set('en-US', {
            currency: 'USD',
            currencySymbol: '$',
            numberFormat: { style: 'decimal', minimumFractionDigits: 2 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: true },
            timezone: 'America/New_York',
            measurementSystem: 'imperial',
            weightUnit: 'lbs',
            heightUnit: 'ft',
            temperatureUnit: 'fahrenheit'
        });

        // United Kingdom
        this.regionalConfigs.set('en-GB', {
            currency: 'GBP',
            currencySymbol: '£',
            numberFormat: { style: 'decimal', minimumFractionDigits: 2 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            timezone: 'Europe/London',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });

        // China (Mainland)
        this.regionalConfigs.set('zh-CN', {
            currency: 'CNY',
            currencySymbol: '¥',
            numberFormat: { style: 'decimal', minimumFractionDigits: 2 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            timezone: 'Asia/Shanghai',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });

        // Taiwan
        this.regionalConfigs.set('zh-TW', {
            currency: 'TWD',
            currencySymbol: 'NT$',
            numberFormat: { style: 'decimal', minimumFractionDigits: 0 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            timezone: 'Asia/Taipei',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });

        // South Korea
        this.regionalConfigs.set('ko-KR', {
            currency: 'KRW',
            currencySymbol: '₩',
            numberFormat: { style: 'decimal', minimumFractionDigits: 0 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            timezone: 'Asia/Seoul',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });

        // Germany
        this.regionalConfigs.set('de-DE', {
            currency: 'EUR',
            currencySymbol: '€',
            numberFormat: { style: 'decimal', minimumFractionDigits: 2 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            timezone: 'Europe/Berlin',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });

        // Austria
        this.regionalConfigs.set('de-AT', {
            currency: 'EUR',
            currencySymbol: '€',
            numberFormat: { style: 'decimal', minimumFractionDigits: 2 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            timezone: 'Europe/Vienna',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });

        // Spain
        this.regionalConfigs.set('es-ES', {
            currency: 'EUR',
            currencySymbol: '€',
            numberFormat: { style: 'decimal', minimumFractionDigits: 2 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            timezone: 'Europe/Madrid',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });

        // Mexico
        this.regionalConfigs.set('es-MX', {
            currency: 'MXN',
            currencySymbol: '$',
            numberFormat: { style: 'decimal', minimumFractionDigits: 2 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: true },
            timezone: 'America/Mexico_City',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });

        // Argentina
        this.regionalConfigs.set('es-AR', {
            currency: 'ARS',
            currencySymbol: '$',
            numberFormat: { style: 'decimal', minimumFractionDigits: 2 },
            dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            timeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            timezone: 'America/Argentina/Buenos_Aires',
            measurementSystem: 'metric',
            weightUnit: 'kg',
            heightUnit: 'cm',
            temperatureUnit: 'celsius'
        });
    }

    private async loadABTests(): Promise<void> {
        try {
            const response = await fetch('/api/ab-tests', {
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                const tests: ABTestConfig[] = await response.json();
                tests.forEach(test => {
                    this.abTests.set(test.id, test);
                });
            }
        } catch (error) {
            console.warn('Failed to load A/B tests:', error);
        }
    }

    // Detect locale from language and region
    public detectLocale(language: SupportedLanguage, countryCode?: string): LocaleKey {
        const localeMap: Record<SupportedLanguage, LocaleKey[]> = {
            'ja': ['ja-JP'],
            'en': ['en-US', 'en-GB'],
            'zh': ['zh-CN', 'zh-TW'],
            'ko': ['ko-KR'],
            'de': ['de-DE', 'de-AT'],
            'es': ['es-ES', 'es-MX', 'es-AR']
        };

        const possibleLocales = localeMap[language] || ['ja-JP'];

        // Match by country code if provided
        if (countryCode) {
            const matchedLocale = possibleLocales.find(locale =>
                locale.endsWith(`-${countryCode.toUpperCase()}`)
            );
            if (matchedLocale) return matchedLocale;
        }

        // Default to first locale for the language
        return possibleLocales[0];
    }

    // Get regional configuration
    public getRegionalConfig(locale?: LocaleKey): RegionalConfig {
        const targetLocale = locale || this.currentLocale;
        return this.regionalConfigs.get(targetLocale) || this.regionalConfigs.get('ja-JP')!;
    }

    // Set current locale
    public setLocale(locale: LocaleKey): void {
        this.currentLocale = locale;
    }

    // Get current locale
    public getCurrentLocale(): LocaleKey {
        return this.currentLocale;
    }

    // Format number according to locale
    public formatNumber(value: number, locale?: LocaleKey): string {
        const config = this.getRegionalConfig(locale);
        return new Intl.NumberFormat(locale || this.currentLocale, config.numberFormat).format(value);
    }

    // Format currency according to locale
    public formatCurrency(value: number, locale?: LocaleKey): string {
        const config = this.getRegionalConfig(locale);
        return new Intl.NumberFormat(locale || this.currentLocale, {
            style: 'currency',
            currency: config.currency
        }).format(value);
    }

    // Format date according to locale
    public formatDate(date: Date, locale?: LocaleKey): string {
        const config = this.getRegionalConfig(locale);
        return new Intl.DateTimeFormat(locale || this.currentLocale, config.dateFormat).format(date);
    }

    // Format time according to locale
    public formatTime(date: Date, locale?: LocaleKey): string {
        const config = this.getRegionalConfig(locale);
        return new Intl.DateTimeFormat(locale || this.currentLocale, config.timeFormat).format(date);
    }

    // Convert weight units
    public convertWeight(value: number, fromUnit: 'kg' | 'lbs', locale?: LocaleKey): { value: number; unit: string } {
        const config = this.getRegionalConfig(locale);
        const targetUnit = config.weightUnit;

        let convertedValue = value;
        if (fromUnit === 'kg' && targetUnit === 'lbs') {
            convertedValue = value * 2.20462;
        } else if (fromUnit === 'lbs' && targetUnit === 'kg') {
            convertedValue = value / 2.20462;
        }

        return {
            value: Math.round(convertedValue * 10) / 10,
            unit: targetUnit
        };
    }

    // Convert height units
    public convertHeight(value: number, fromUnit: 'cm' | 'ft', locale?: LocaleKey): { value: number; unit: string } {
        const config = this.getRegionalConfig(locale);
        const targetUnit = config.heightUnit;

        let convertedValue = value;
        if (fromUnit === 'cm' && targetUnit === 'ft') {
            convertedValue = value / 30.48;
        } else if (fromUnit === 'ft' && targetUnit === 'cm') {
            convertedValue = value * 30.48;
        }

        return {
            value: Math.round(convertedValue * 10) / 10,
            unit: targetUnit
        };
    }

    // A/B Testing functionality
    public assignUserToVariant(testId: string, userId: string, language: SupportedLanguage): LocaleVariant | null {
        const test = this.abTests.get(testId);
        if (!test || !test.isActive || !test.targetLanguages.includes(language)) {
            return null;
        }

        // Check if user already has a variant assigned
        const existingVariant = this.userVariants.get(`${testId}-${userId}`);
        if (existingVariant) {
            return existingVariant;
        }

        // Assign variant based on traffic percentage
        const random = this.hashUserId(userId) % 100;
        let currentPercentage = 0;

        for (const variant of test.variants) {
            if (!variant.isActive) continue;

            currentPercentage += variant.trafficPercentage;
            if (random < currentPercentage) {
                this.userVariants.set(`${testId}-${userId}`, variant);
                return variant;
            }
        }

        return null;
    }

    // Hash user ID for consistent variant assignment
    private hashUserId(userId: string): number {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Track A/B test event
    public trackEvent(testId: string, userId: string, eventName: string, properties?: Record<string, any>): void {
        const variant = this.userVariants.get(`${testId}-${userId}`);
        if (!variant) return;

        // Send analytics data
        const eventData = {
            testId,
            variantId: variant.id,
            userId,
            eventName,
            properties,
            timestamp: new Date().toISOString(),
            locale: this.currentLocale
        };

        // Example: Send to analytics service
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', eventName, {
                custom_parameter_test_id: testId,
                custom_parameter_variant_id: variant.id,
                ...properties
            });
        }

        // Log for debugging
        console.log('A/B Test Event:', eventData);
    }

    // Create new A/B test
    public createABTest(config: Omit<ABTestConfig, 'id'>): string {
        const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const test: ABTestConfig = { ...config, id };
        this.abTests.set(id, test);
        return id;
    }

    // Get active A/B tests for language
    public getActiveTestsForLanguage(language: SupportedLanguage): ABTestConfig[] {
        return Array.from(this.abTests.values()).filter(test =>
            test.isActive && test.targetLanguages.includes(language)
        );
    }

    // Get variant for user
    public getUserVariant(testId: string, userId: string): LocaleVariant | null {
        return this.userVariants.get(`${testId}-${userId}`) || null;
    }

    // Add new regional configuration
    public addRegionalConfig(locale: LocaleKey, config: RegionalConfig): void {
        this.regionalConfigs.set(locale, config);
    }

    // Update regional configuration
    public updateRegionalConfig(locale: LocaleKey, updates: Partial<RegionalConfig>): void {
        const existing = this.regionalConfigs.get(locale);
        if (existing) {
            this.regionalConfigs.set(locale, { ...existing, ...updates });
        }
    }

    // Get all supported locales
    public getSupportedLocales(): LocaleKey[] {
        return Array.from(this.regionalConfigs.keys());
    }

    // Get locale display name
    public getLocaleDisplayName(locale: LocaleKey, displayLocale?: LocaleKey): string {
        const displayLang = displayLocale || this.currentLocale;
        return new Intl.DisplayNames([displayLang], { type: 'region' }).of(
            locale.split('-')[1]
        ) || locale;
    }

    // Export configuration for external systems
    public exportConfiguration(): {
        regionalConfigs: Array<{ locale: LocaleKey; config: RegionalConfig }>;
        abTests: ABTestConfig[];
    } {
        return {
            regionalConfigs: Array.from(this.regionalConfigs.entries()).map(([locale, config]) => ({
                locale,
                config
            })),
            abTests: Array.from(this.abTests.values())
        };
    }

    // Import configuration from external systems
    public importConfiguration(data: {
        regionalConfigs?: Array<{ locale: LocaleKey; config: RegionalConfig }>;
        abTests?: ABTestConfig[];
    }): void {
        if (data.regionalConfigs) {
            data.regionalConfigs.forEach(({ locale, config }) => {
                this.regionalConfigs.set(locale, config);
            });
        }

        if (data.abTests) {
            data.abTests.forEach(test => {
                this.abTests.set(test.id, test);
            });
        }
    }
}

// Singleton instance
export const localeManager = LocaleManager.getInstance();
