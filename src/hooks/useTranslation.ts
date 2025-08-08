import { useContext, useMemo } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import {
    getTranslation,
    replacePlaceholders,
    TranslationKey,
    SupportedLanguage
} from '../i18n';

export interface UseTranslationReturn {
    t: (category: TranslationKey, key: string, placeholders?: Record<string, string | number>, fallback?: string) => string;
    language: SupportedLanguage;
    setLanguage: (language: SupportedLanguage) => void;
    availableLanguages: Array<{ code: SupportedLanguage; name: string; nativeName: string }>;
}

/**
 * 翻訳フック
 * 
 * 使用例:
 * const { t } = useTranslation();
 * const text = t('common', 'save'); // 「保存」など
 * const withPlaceholders = t('time', 'minutesAgo', { count: 5 }); // 「5分前」など
 */
export const useTranslation = (): UseTranslationReturn => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }

    const { language, setLanguage, availableLanguages } = context;

    const t = useMemo(() => {
        return (
            category: TranslationKey,
            key: string,
            placeholders?: Record<string, string | number>,
            fallback?: string
        ): string => {
            let translation = getTranslation(language, category, key, fallback);

            if (placeholders && Object.keys(placeholders).length > 0) {
                translation = replacePlaceholders(translation, placeholders);
            }

            return translation;
        };
    }, [language]);

    return {
        t,
        language,
        setLanguage,
        availableLanguages,
    };
};

/**
 * 特定のカテゴリー専用の翻訳フック
 */
export const useTranslationCategory = (category: TranslationKey) => {
    const { t, language, setLanguage, availableLanguages } = useTranslation();

    const tCategory = useMemo(() => {
        return (key: string, placeholders?: Record<string, string | number>, fallback?: string): string => {
            return t(category, key, placeholders, fallback);
        };
    }, [t, category]);

    return {
        t: tCategory,
        language,
        setLanguage,
        availableLanguages,
    };
};

/**
 * 共通カテゴリー専用フック
 */
export const useCommonTranslation = () => useTranslationCategory('common');

/**
 * 認証カテゴリー専用フック
 */
export const useAuthTranslation = () => useTranslationCategory('auth');

/**
 * ナビゲーションカテゴリー専用フック
 */
export const useNavigationTranslation = () => useTranslationCategory('navigation');

/**
 * ダッシュボードカテゴリー専用フック
 */
export const useDashboardTranslation = () => useTranslationCategory('dashboard');

/**
 * 投稿カテゴリー専用フック
 */
export const usePostsTranslation = () => useTranslationCategory('posts');

/**
 * プロフィールカテゴリー専用フック
 */
export const useProfileTranslation = () => useTranslationCategory('profile');

/**
 * 体重カテゴリー専用フック
 */
export const useWeightTranslation = () => useTranslationCategory('weight');

/**
 * 運動カテゴリー専用フック
 */
export const useExerciseTranslation = () => useTranslationCategory('exercise');

/**
 * 食事カテゴリー専用フック
 */
export const useFoodTranslation = () => useTranslationCategory('food');

/**
 * 通知カテゴリー専用フック
 */
export const useNotificationsTranslation = () => useTranslationCategory('notifications');

/**
 * メッセージカテゴリー専用フック
 */
export const useMessagesTranslation = () => useTranslationCategory('messages');

/**
 * 設定カテゴリー専用フック
 */
export const useSettingsTranslation = () => useTranslationCategory('settings');

/**
 * 検索カテゴリー専用フック
 */
export const useSearchTranslation = () => useTranslationCategory('search');

/**
 * エラーカテゴリー専用フック
 */
export const useErrorsTranslation = () => useTranslationCategory('errors');

/**
 * 時間カテゴリー専用フック
 */
export const useTimeTranslation = () => useTranslationCategory('time');
