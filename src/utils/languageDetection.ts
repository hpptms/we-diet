// Language detection and internationalization utilities

export type SupportedLanguage = 'ja' | 'en';

export interface LanguageConfig {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
}

export const supportedLanguages: LanguageConfig[] = [
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'en', name: 'English', nativeName: 'English' }
];

// Detect user's preferred language
export function detectUserLanguage(): SupportedLanguage {
    // 1. Check localStorage for saved preference
    const savedLanguage = localStorage.getItem('preferred-language') as SupportedLanguage;
    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
        return savedLanguage;
    }

    // 2. Check browser language settings
    const browserLanguages = navigator.languages || [navigator.language];

    for (const browserLang of browserLanguages) {
        const langCode = browserLang.split('-')[0].toLowerCase();
        if (langCode === 'ja') return 'ja';
        if (langCode === 'en') return 'en';
    }

    // 3. Check Accept-Language header if available
    const acceptLanguage = document.documentElement.lang;
    if (acceptLanguage && acceptLanguage.startsWith('ja')) return 'ja';
    if (acceptLanguage && acceptLanguage.startsWith('en')) return 'en';

    // 4. Default to Japanese (primary market)
    return 'ja';
}

// Save user's language preference
export function saveLanguagePreference(language: SupportedLanguage): void {
    localStorage.setItem('preferred-language', language);
}

// Get language display name
export function getLanguageDisplayName(code: SupportedLanguage, displayIn: SupportedLanguage = 'en'): string {
    const language = supportedLanguages.find(lang => lang.code === code);
    if (!language) return code;

    return displayIn === 'en' ? language.name : language.nativeName;
}

// Check if current language is RTL (for future Arabic support)
export function isRTL(language: SupportedLanguage): boolean {
    const rtlLanguages: SupportedLanguage[] = [];
    return rtlLanguages.includes(language);
}

// Get appropriate hreflang for SEO
export function getHrefLang(language: SupportedLanguage): string {
    const hrefLangMap: Record<SupportedLanguage, string> = {
        'ja': 'ja-JP',
        'en': 'en-US'
    };
    return hrefLangMap[language] || language;
}
