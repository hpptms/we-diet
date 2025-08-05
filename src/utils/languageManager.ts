// Comprehensive language management system for easy expansion
import { SupportedLanguage, LanguageConfig, supportedLanguages } from './languageDetection';
import { translationManager, TranslationConfig } from './translationManager';
import { localeManager, LocaleKey, RegionalConfig } from './localeManager';

export interface NewLanguageConfig {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    locales: Array<{
        key: LocaleKey;
        config: RegionalConfig;
    }>;
    translations: Record<string, string>;
    isRTL?: boolean;
    pluralRules?: (count: number) => 'zero' | 'one' | 'other';
}

export interface LanguageTemplate {
    baseLanguage: SupportedLanguage;
    newLanguage: SupportedLanguage;
    autoTranslate: boolean;
    translationService?: 'google' | 'deepl' | 'azure' | 'manual';
    reviewRequired: boolean;
}

export interface LanguagePackage {
    version: string;
    language: SupportedLanguage;
    completeness: number; // percentage
    lastUpdated: string;
    translators: string[];
    reviewers: string[];
    files: {
        translations: string;
        locales: string;
        metadata: string;
    };
}

export class LanguageManager {
    private static instance: LanguageManager;
    private packages: Map<SupportedLanguage, LanguagePackage> = new Map();
    private templates: Map<string, LanguageTemplate> = new Map();

    private constructor() {
        this.initializeDefaultPackages();
    }

    public static getInstance(): LanguageManager {
        if (!LanguageManager.instance) {
            LanguageManager.instance = new LanguageManager();
        }
        return LanguageManager.instance;
    }

    private initializeDefaultPackages(): void {
        const defaultLanguages: SupportedLanguage[] = ['ja', 'en', 'zh', 'ko', 'de', 'es'];

        defaultLanguages.forEach(lang => {
            this.packages.set(lang, {
                version: '1.0.0',
                language: lang,
                completeness: 100,
                lastUpdated: new Date().toISOString(),
                translators: ['system'],
                reviewers: ['system'],
                files: {
                    translations: `src/translations/${lang}.json`,
                    locales: `src/locales/${lang}.json`,
                    metadata: `src/metadata/${lang}.json`
                }
            });
        });
    }

    // Add new language with comprehensive setup
    public async addLanguage(config: NewLanguageConfig): Promise<boolean> {
        try {
            // 1. Add to language detection system
            this.addToLanguageDetection(config);

            // 2. Add translations
            translationManager.setTranslations(config.code, config.translations);

            // 3. Add regional configurations
            config.locales.forEach(({ key, config: regionalConfig }) => {
                localeManager.addRegionalConfig(key, regionalConfig);
            });

            // 4. Create language package
            const packageInfo: LanguagePackage = {
                version: '1.0.0',
                language: config.code,
                completeness: this.calculateCompleteness(config.translations),
                lastUpdated: new Date().toISOString(),
                translators: ['manual'],
                reviewers: [],
                files: {
                    translations: `src/translations/${config.code}.json`,
                    locales: `src/locales/${config.code}.json`,
                    metadata: `src/metadata/${config.code}.json`
                }
            };

            this.packages.set(config.code, packageInfo);

            // 5. Generate translation files
            await this.generateLanguageFiles(config);

            console.log(`Successfully added language: ${config.nativeName} (${config.code})`);
            return true;

        } catch (error) {
            console.error(`Failed to add language ${config.code}:`, error);
            return false;
        }
    }

    // Remove language (with backup)
    public async removeLanguage(language: SupportedLanguage, createBackup: boolean = true): Promise<boolean> {
        try {
            if (createBackup) {
                await this.backupLanguage(language);
            }

            // Remove from all systems
            translationManager.clearCache(language);
            this.packages.delete(language);

            console.log(`Successfully removed language: ${language}`);
            return true;

        } catch (error) {
            console.error(`Failed to remove language ${language}:`, error);
            return false;
        }
    }

    // Create language template for easy addition
    public createLanguageTemplate(config: LanguageTemplate): string {
        const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.templates.set(templateId, config);
        return templateId;
    }

    // Apply language template
    public async applyLanguageTemplate(templateId: string): Promise<NewLanguageConfig | null> {
        const template = this.templates.get(templateId);
        if (!template) return null;

        const baseTranslations = translationManager.getTranslations(template.baseLanguage);

        let translations: Record<string, string>;

        if (template.autoTranslate && template.translationService) {
            translations = await this.autoTranslate(baseTranslations, template.translationService, template.newLanguage);
        } else {
            translations = this.createTranslationTemplate(baseTranslations);
        }

        // Generate locale configurations based on base language
        const baseLocales = localeManager.getSupportedLocales()
            .filter(locale => locale.startsWith(template.baseLanguage));

        const newLocales = baseLocales.map(locale => {
            const baseConfig = localeManager.getRegionalConfig(locale);
            return {
                key: locale.replace(template.baseLanguage, template.newLanguage) as LocaleKey,
                config: { ...baseConfig } // Copy and modify as needed
            };
        });

        return {
            code: template.newLanguage,
            name: this.getLanguageName(template.newLanguage),
            nativeName: this.getNativeLanguageName(template.newLanguage),
            locales: newLocales,
            translations,
            isRTL: this.isRTLLanguage(template.newLanguage)
        };
    }

    // Auto-translate using external services
    private async autoTranslate(
        sourceTranslations: Record<string, string>,
        service: 'google' | 'deepl' | 'azure' | 'manual',
        targetLanguage: SupportedLanguage
    ): Promise<Record<string, string>> {
        const translated: Record<string, string> = {};

        // This is a placeholder - in real implementation, you would integrate with actual translation services
        for (const [key, value] of Object.entries(sourceTranslations)) {
            switch (service) {
                case 'google':
                    translated[key] = await this.translateWithGoogle(value, targetLanguage);
                    break;
                case 'deepl':
                    translated[key] = await this.translateWithDeepL(value, targetLanguage);
                    break;
                case 'azure':
                    translated[key] = await this.translateWithAzure(value, targetLanguage);
                    break;
                default:
                    translated[key] = `[${targetLanguage.toUpperCase()}] ${value}`;
            }
        }

        return translated;
    }

    // Placeholder translation methods (implement with actual APIs)
    private async translateWithGoogle(text: string, targetLang: SupportedLanguage): Promise<string> {
        // Implement Google Translate API integration
        return `[GOOGLE-${targetLang.toUpperCase()}] ${text}`;
    }

    private async translateWithDeepL(text: string, targetLang: SupportedLanguage): Promise<string> {
        // Implement DeepL API integration
        return `[DEEPL-${targetLang.toUpperCase()}] ${text}`;
    }

    private async translateWithAzure(text: string, targetLang: SupportedLanguage): Promise<string> {
        // Implement Azure Translator API integration
        return `[AZURE-${targetLang.toUpperCase()}] ${text}`;
    }

    // Create translation template with placeholders
    private createTranslationTemplate(baseTranslations: Record<string, string>): Record<string, string> {
        const template: Record<string, string> = {};

        for (const [key, value] of Object.entries(baseTranslations)) {
            template[key] = `[TODO] ${value}`;
        }

        return template;
    }

    // Calculate translation completeness
    private calculateCompleteness(translations: Record<string, string>): number {
        const baseTranslations = translationManager.getTranslations('en');
        const baseKeys = Object.keys(baseTranslations);
        const translatedKeys = Object.keys(translations).filter(key =>
            translations[key] && !translations[key].startsWith('[TODO]')
        );

        return baseKeys.length > 0 ? Math.round((translatedKeys.length / baseKeys.length) * 100) : 0;
    }

    // Generate language files for external translation tools
    private async generateLanguageFiles(config: NewLanguageConfig): Promise<void> {
        const files = {
            translations: JSON.stringify(config.translations, null, 2),
            locales: JSON.stringify(config.locales, null, 2),
            metadata: JSON.stringify({
                code: config.code,
                name: config.name,
                nativeName: config.nativeName,
                isRTL: config.isRTL || false,
                dateAdded: new Date().toISOString(),
                version: '1.0.0'
            }, null, 2)
        };

        // In a real implementation, you would write these to actual files
        console.log('Generated language files:', files);
    }

    // Backup language data
    private async backupLanguage(language: SupportedLanguage): Promise<void> {
        const packageInfo = this.packages.get(language);
        if (!packageInfo) return;

        const backup = {
            package: packageInfo,
            translations: translationManager.getTranslations(language),
            locales: localeManager.getSupportedLocales()
                .filter(locale => locale.startsWith(language))
                .map(locale => ({
                    key: locale,
                    config: localeManager.getRegionalConfig(locale)
                })),
            timestamp: new Date().toISOString()
        };

        // Store backup (localStorage, file system, or remote storage)
        localStorage.setItem(`language_backup_${language}`, JSON.stringify(backup));
        console.log(`Backup created for language: ${language}`);
    }

    // Restore language from backup
    public async restoreLanguageFromBackup(language: SupportedLanguage): Promise<boolean> {
        try {
            const backupData = localStorage.getItem(`language_backup_${language}`);
            if (!backupData) return false;

            const backup = JSON.parse(backupData);

            // Restore translations
            translationManager.setTranslations(language, backup.translations);

            // Restore locales
            backup.locales.forEach((locale: any) => {
                localeManager.addRegionalConfig(locale.key, locale.config);
            });

            // Restore package info
            this.packages.set(language, backup.package);

            console.log(`Successfully restored language: ${language}`);
            return true;

        } catch (error) {
            console.error(`Failed to restore language ${language}:`, error);
            return false;
        }
    }

    // Update translation completeness
    public updateCompleteness(language: SupportedLanguage): void {
        const packageInfo = this.packages.get(language);
        if (!packageInfo) return;

        const translations = translationManager.getTranslations(language);
        const completeness = this.calculateCompleteness(translations);

        packageInfo.completeness = completeness;
        packageInfo.lastUpdated = new Date().toISOString();

        this.packages.set(language, packageInfo);
    }

    // Get translation statistics for all languages
    public getTranslationStats(): Array<{
        language: SupportedLanguage;
        nativeName: string;
        completeness: number;
        lastUpdated: string;
        translators: string[];
        reviewers: string[];
    }> {
        return Array.from(this.packages.entries()).map(([lang, pkg]) => {
            const langConfig = supportedLanguages.find(l => l.code === lang);
            return {
                language: lang,
                nativeName: langConfig?.nativeName || lang,
                completeness: pkg.completeness,
                lastUpdated: pkg.lastUpdated,
                translators: pkg.translators,
                reviewers: pkg.reviewers
            };
        });
    }

    // Export language package for external tools
    public exportLanguagePackage(language: SupportedLanguage): string | null {
        const packageInfo = this.packages.get(language);
        if (!packageInfo) return null;

        const exportData = {
            package: packageInfo,
            translations: translationManager.getTranslations(language),
            locales: localeManager.getSupportedLocales()
                .filter(locale => locale.startsWith(language))
                .map(locale => ({
                    key: locale,
                    config: localeManager.getRegionalConfig(locale)
                })),
            exportedAt: new Date().toISOString()
        };

        return JSON.stringify(exportData, null, 2);
    }

    // Import language package from external tools
    public async importLanguagePackage(packageData: string): Promise<boolean> {
        try {
            const data = JSON.parse(packageData);
            const { package: pkg, translations, locales } = data;

            // Import translations
            translationManager.setTranslations(pkg.language, translations);

            // Import locales
            locales.forEach((locale: any) => {
                localeManager.addRegionalConfig(locale.key, locale.config);
            });

            // Import package info
            this.packages.set(pkg.language, pkg);

            console.log(`Successfully imported language package: ${pkg.language}`);
            return true;

        } catch (error) {
            console.error('Failed to import language package:', error);
            return false;
        }
    }

    // Helper methods
    private addToLanguageDetection(config: NewLanguageConfig): void {
        // This would require updating the language detection system
        // In a real implementation, you might update configuration files
        console.log(`Adding ${config.code} to language detection system`);
    }

    private getLanguageName(code: SupportedLanguage): string {
        const names: Record<SupportedLanguage, string> = {
            'ja': 'Japanese',
            'en': 'English',
            'zh': 'Chinese',
            'ko': 'Korean',
            'de': 'German',
            'es': 'Spanish'
        };
        return names[code] || code;
    }

    private getNativeLanguageName(code: SupportedLanguage): string {
        const names: Record<SupportedLanguage, string> = {
            'ja': '日本語',
            'en': 'English',
            'zh': '中文',
            'ko': '한국어',
            'de': 'Deutsch',
            'es': 'Español'
        };
        return names[code] || code;
    }

    private isRTLLanguage(code: SupportedLanguage): boolean {
        const rtlLanguages: SupportedLanguage[] = [];
        return rtlLanguages.includes(code);
    }

    // Get all language packages
    public getLanguagePackages(): Map<SupportedLanguage, LanguagePackage> {
        return new Map(this.packages);
    }

    // Get specific language package
    public getLanguagePackage(language: SupportedLanguage): LanguagePackage | undefined {
        return this.packages.get(language);
    }

    // Update package metadata
    public updatePackageMetadata(
        language: SupportedLanguage,
        updates: Partial<Pick<LanguagePackage, 'translators' | 'reviewers' | 'version'>>
    ): void {
        const pkg = this.packages.get(language);
        if (pkg) {
            Object.assign(pkg, updates, { lastUpdated: new Date().toISOString() });
            this.packages.set(language, pkg);
        }
    }

    // Validate language package
    public validateLanguagePackage(language: SupportedLanguage): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        const pkg = this.packages.get(language);
        if (!pkg) {
            errors.push(`Package not found for language: ${language}`);
            return { isValid: false, errors, warnings };
        }

        const translations = translationManager.getTranslations(language);
        const baseTranslations = translationManager.getTranslations('en');

        // Check for missing translations
        const missingKeys = Object.keys(baseTranslations).filter(key => !translations[key]);
        if (missingKeys.length > 0) {
            warnings.push(`Missing translations: ${missingKeys.join(', ')}`);
        }

        // Check for placeholder translations
        const placeholderKeys = Object.keys(translations).filter(key =>
            translations[key].startsWith('[TODO]') || translations[key].startsWith('[')
        );
        if (placeholderKeys.length > 0) {
            warnings.push(`Placeholder translations found: ${placeholderKeys.join(', ')}`);
        }

        // Check completeness
        if (pkg.completeness < 80) {
            warnings.push(`Low translation completeness: ${pkg.completeness}%`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
}

// Singleton instance
export const languageManager = LanguageManager.getInstance();

// Utility functions for easy language management
export const LanguageUtils = {
    // Quick add language with minimal configuration
    async addQuickLanguage(
        code: SupportedLanguage,
        nativeName: string,
        baseLanguage: SupportedLanguage = 'en'
    ): Promise<boolean> {
        const template = languageManager.createLanguageTemplate({
            baseLanguage,
            newLanguage: code,
            autoTranslate: false,
            reviewRequired: true
        });

        const config = await languageManager.applyLanguageTemplate(template);
        if (!config) return false;

        config.nativeName = nativeName;
        return languageManager.addLanguage(config);
    },

    // Get quick translation statistics
    getQuickStats(): { total: number; complete: number; incomplete: number } {
        const stats = languageManager.getTranslationStats();
        return {
            total: stats.length,
            complete: stats.filter(s => s.completeness >= 95).length,
            incomplete: stats.filter(s => s.completeness < 95).length
        };
    },

    // Export all language data
    exportAll(): string {
        const allData = {
            languages: languageManager.getTranslationStats(),
            packages: Array.from(languageManager.getLanguagePackages().entries()),
            locales: localeManager.exportConfiguration(),
            translations: translationManager.getConfig(),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(allData, null, 2);
    }
};
