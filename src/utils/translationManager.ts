// Translation management system for scalable internationalization
import { SupportedLanguage } from './languageDetection';

export interface TranslationConfig {
    version: string;
    lastUpdated: string;
    source: 'local' | 'remote' | 'external';
    fallbackLanguage: SupportedLanguage;
}

export interface TranslationMetadata {
    key: string;
    description: string;
    category: string;
    usage: string[];
    lastModified: string;
    translatedBy?: string;
    reviewedBy?: string;
    status: 'draft' | 'translated' | 'reviewed' | 'approved';
}

export interface RemoteTranslationResponse {
    language: SupportedLanguage;
    translations: Record<string, string>;
    metadata: TranslationMetadata[];
    config: TranslationConfig;
}

// Translation loading strategies
export type TranslationLoadStrategy = 'eager' | 'lazy' | 'ondemand';

export interface TranslationOptions {
    loadStrategy: TranslationLoadStrategy;
    cacheTimeout: number; // in milliseconds
    enableFallback: boolean;
    enablePluralizations: boolean;
    enableInterpolation: boolean;
}

export class TranslationManager {
    private static instance: TranslationManager;
    private translations: Map<SupportedLanguage, Record<string, string>> = new Map();
    private metadata: Map<string, TranslationMetadata> = new Map();
    private config: TranslationConfig;
    private options: TranslationOptions;
    private loadPromises: Map<SupportedLanguage, Promise<void>> = new Map();

    private constructor() {
        this.config = {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            source: 'local',
            fallbackLanguage: 'en'
        };

        this.options = {
            loadStrategy: 'lazy',
            cacheTimeout: 24 * 60 * 60 * 1000, // 24 hours
            enableFallback: true,
            enablePluralizations: false,
            enableInterpolation: true
        };
    }

    public static getInstance(): TranslationManager {
        if (!TranslationManager.instance) {
            TranslationManager.instance = new TranslationManager();
        }
        return TranslationManager.instance;
    }

    // Load translations from various sources
    public async loadTranslations(
        language: SupportedLanguage,
        source: 'local' | 'remote' | 'external' = 'local'
    ): Promise<void> {
        // Prevent duplicate loading
        if (this.loadPromises.has(language)) {
            return this.loadPromises.get(language)!;
        }

        const loadPromise = this._loadTranslationsInternal(language, source);
        this.loadPromises.set(language, loadPromise);

        try {
            await loadPromise;
        } finally {
            this.loadPromises.delete(language);
        }
    }

    private async _loadTranslationsInternal(
        language: SupportedLanguage,
        source: 'local' | 'remote' | 'external'
    ): Promise<void> {
        switch (source) {
            case 'local':
                await this.loadLocalTranslations(language);
                break;
            case 'remote':
                await this.loadRemoteTranslations(language);
                break;
            case 'external':
                await this.loadExternalTranslations(language);
                break;
        }
    }

    // Load from local files (current implementation)
    private async loadLocalTranslations(language: SupportedLanguage): Promise<void> {
        try {
            // For now, we'll use dynamic imports for future file-based translations
            const translationModule = await import(`../translations/${language}.json`).catch(() => null);

            if (translationModule) {
                this.translations.set(language, translationModule.default);
            }
        } catch (error) {
            console.warn(`Failed to load local translations for ${language}:`, error);
        }
    }

    // Load from remote API
    private async loadRemoteTranslations(language: SupportedLanguage): Promise<void> {
        try {
            const response = await fetch(`/api/translations/${language}`, {
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'max-age=3600'
                }
            });

            if (response.ok) {
                const data: RemoteTranslationResponse = await response.json();
                this.translations.set(language, data.translations);

                // Update metadata
                data.metadata.forEach(meta => {
                    this.metadata.set(meta.key, meta);
                });

                // Update config
                this.config = { ...this.config, ...data.config };
            }
        } catch (error) {
            console.warn(`Failed to load remote translations for ${language}:`, error);
        }
    }

    // Load from external translation management systems (e.g., Crowdin, Lokalise)
    private async loadExternalTranslations(language: SupportedLanguage): Promise<void> {
        const externalApiUrl = process.env.REACT_APP_TRANSLATION_API_URL;
        const apiKey = process.env.REACT_APP_TRANSLATION_API_KEY;

        if (!externalApiUrl || !apiKey) {
            console.warn('External translation API not configured');
            return;
        }

        try {
            const response = await fetch(`${externalApiUrl}/projects/we-diet/translations/${language}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.translations.set(language, data.translations);
            }
        } catch (error) {
            console.warn(`Failed to load external translations for ${language}:`, error);
        }
    }

    // Get translation with fallback and interpolation
    public getTranslation(
        language: SupportedLanguage,
        key: string,
        params?: Record<string, string | number>,
        count?: number
    ): string {
        let translation = this.translations.get(language)?.[key];

        // Fallback to default language
        if (!translation && this.options.enableFallback) {
            translation = this.translations.get(this.config.fallbackLanguage)?.[key];
        }

        // Final fallback to key itself
        if (!translation) {
            translation = key;
        }

        // Handle pluralization (future enhancement)
        if (count !== undefined && this.options.enablePluralizations) {
            translation = this.handlePluralization(translation, count, language);
        }

        // Handle parameter interpolation
        if (params && this.options.enableInterpolation) {
            translation = this.interpolateParams(translation, params);
        }

        return translation;
    }

    // Parameter interpolation
    private interpolateParams(text: string, params: Record<string, string | number>): string {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key]?.toString() || match;
        });
    }

    // Pluralization handler (basic implementation)
    private handlePluralization(text: string, count: number, language: SupportedLanguage): string {
        // Basic pluralization rules - can be extended
        const pluralRules: Record<SupportedLanguage, (count: number) => 'zero' | 'one' | 'other'> = {
            'en': (n) => n === 0 ? 'zero' : n === 1 ? 'one' : 'other',
            'ja': () => 'other', // Japanese doesn't have plural forms
            'zh': () => 'other', // Chinese doesn't have plural forms
            'ko': () => 'other', // Korean doesn't have plural forms
            'de': (n) => n === 1 ? 'one' : 'other',
            'es': (n) => n === 1 ? 'one' : 'other'
        };

        const rule = pluralRules[language];
        const form = rule(count);

        // Look for plural forms in translation
        const pluralMatch = text.match(/\{(\w+),\s*plural,\s*=0\s*\{([^}]+)\}\s*one\s*\{([^}]+)\}\s*other\s*\{([^}]+)\}\}/);

        if (pluralMatch) {
            const [, , zeroForm, oneForm, otherForm] = pluralMatch;
            switch (form) {
                case 'zero': return zeroForm.replace(/#/g, count.toString());
                case 'one': return oneForm.replace(/#/g, count.toString());
                default: return otherForm.replace(/#/g, count.toString());
            }
        }

        return text;
    }

    // Add or update translations dynamically
    public setTranslation(language: SupportedLanguage, key: string, value: string): void {
        if (!this.translations.has(language)) {
            this.translations.set(language, {});
        }
        this.translations.get(language)![key] = value;
    }

    // Batch update translations
    public setTranslations(language: SupportedLanguage, translations: Record<string, string>): void {
        this.translations.set(language, { ...this.translations.get(language), ...translations });
    }

    // Get all translations for a language
    public getTranslations(language: SupportedLanguage): Record<string, string> {
        return this.translations.get(language) || {};
    }

    // Check if translations are loaded
    public isLoaded(language: SupportedLanguage): boolean {
        return this.translations.has(language);
    }

    // Clear cache
    public clearCache(language?: SupportedLanguage): void {
        if (language) {
            this.translations.delete(language);
        } else {
            this.translations.clear();
        }
    }

    // Export translations for external tools
    public exportTranslations(language: SupportedLanguage): string {
        const translations = this.getTranslations(language);
        return JSON.stringify(translations, null, 2);
    }

    // Get translation statistics
    public getStats(language: SupportedLanguage): {
        total: number;
        translated: number;
        missing: number;
        percentage: number;
    } {
        const translations = this.getTranslations(language);
        const baseTranslations = this.getTranslations(this.config.fallbackLanguage);

        const total = Object.keys(baseTranslations).length;
        const translated = Object.keys(translations).length;
        const missing = total - translated;
        const percentage = total > 0 ? (translated / total) * 100 : 0;

        return { total, translated, missing, percentage };
    }

    // Update configuration
    public updateConfig(newConfig: Partial<TranslationConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }

    // Update options
    public updateOptions(newOptions: Partial<TranslationOptions>): void {
        this.options = { ...this.options, ...newOptions };
    }

    // Get configuration
    public getConfig(): TranslationConfig {
        return { ...this.config };
    }

    // Get options
    public getOptions(): TranslationOptions {
        return { ...this.options };
    }
}

// Singleton instance
export const translationManager = TranslationManager.getInstance();
