import jaTranslations from './languages/ja.json';
import enTranslations from './languages/en.json';
import zhCNTranslations from './languages/zh-CN.json';
import koTranslations from './languages/ko.json';
import esTranslations from './languages/es.json';

export type SupportedLanguage = 'ja' | 'en' | 'zh-CN' | 'ko' | 'es';

export interface LanguageInfo {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

const translations = {
    ja: jaTranslations,
    en: enTranslations,
    'zh-CN': zhCNTranslations,
    ko: koTranslations,
    es: esTranslations,
};

export type TranslationKey = keyof typeof jaTranslations;
export type TranslationNestedKey =
    | `${keyof typeof jaTranslations.common}`
    | `${keyof typeof jaTranslations.auth}`
    | `${keyof typeof jaTranslations.navigation}`
    | `${keyof typeof jaTranslations.dashboard}`
    | `${keyof typeof jaTranslations.posts}`
    | `${keyof typeof jaTranslations.profile}`
    | `${keyof typeof jaTranslations.weight}`
    | `${keyof typeof jaTranslations.exercise}`
    | `${keyof typeof jaTranslations.food}`
    | `${keyof typeof jaTranslations.notifications}`
    | `${keyof typeof jaTranslations.messages}`
    | `${keyof typeof jaTranslations.settings}`
    | `${keyof typeof jaTranslations.search}`
    | `${keyof typeof jaTranslations.errors}`
    | `${keyof typeof jaTranslations.time}`;

/**
 * ブラウザの言語設定から対応言語を検出
 */
export const detectBrowserLanguage = (): SupportedLanguage => {
    // navigator.language または navigator.languages を使用
    const browserLangs = navigator.languages || [navigator.language];

    for (const lang of browserLangs) {
        // 完全一致をチェック
        if (SUPPORTED_LANGUAGES.some(supported => supported.code === lang)) {
            return lang as SupportedLanguage;
        }

        // 言語コードの最初の部分をチェック（例: "en-US" -> "en"）
        const baseLang = lang.split('-')[0];
        const matchedLang = SUPPORTED_LANGUAGES.find(supported =>
            supported.code.split('-')[0] === baseLang
        );
        if (matchedLang) {
            return matchedLang.code;
        }
    }

    // デフォルトは日本語
    return 'ja';
};

/**
 * LocalStorageから言語設定を取得
 */
export const getStoredLanguage = (): SupportedLanguage | null => {
    try {
        const stored = localStorage.getItem('preferredLanguage');
        if (stored && SUPPORTED_LANGUAGES.some(lang => lang.code === stored)) {
            return stored as SupportedLanguage;
        }
    } catch (error) {
        console.warn('Failed to get stored language:', error);
    }
    return null;
};

/**
 * LocalStorageに言語設定を保存
 */
export const setStoredLanguage = (language: SupportedLanguage): void => {
    try {
        localStorage.setItem('preferredLanguage', language);
    } catch (error) {
        console.warn('Failed to store language:', error);
    }
};

/**
 * 現在の言語を決定（優先度: 保存済み > ブラウザ設定 > デフォルト）
 */
export const getCurrentLanguage = (): SupportedLanguage => {
    return getStoredLanguage() || detectBrowserLanguage();
};

/**
 * 翻訳テキストを取得
 */
export const getTranslation = (
    language: SupportedLanguage,
    category: TranslationKey,
    key: string,
    fallback?: string
): string => {
    try {
        const categoryTranslations = translations[language][category] as Record<string, string>;
        const translation = categoryTranslations?.[key];

        if (translation) {
            return translation;
        }

        // フォールバック: 日本語の翻訳を試す
        if (language !== 'ja') {
            const jaFallback = (translations.ja[category] as Record<string, string>)?.[key];
            if (jaFallback) {
                return jaFallback;
            }
        }

        // フォールバック: 英語の翻訳を試す
        if (language !== 'en') {
            const enFallback = (translations.en[category] as Record<string, string>)?.[key];
            if (enFallback) {
                return enFallback;
            }
        }

        return fallback || key;
    } catch (error) {
        console.warn('Translation error:', error);
        return fallback || key;
    }
};

/**
 * プレースホルダーを置換
 */
export const replacePlaceholders = (text: string, placeholders: Record<string, string | number>): string => {
    let result = text;
    Object.entries(placeholders).forEach(([key, value]) => {
        result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });
    return result;
};

export default translations;
