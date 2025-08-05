import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, detectUserLanguage, saveLanguagePreference } from '../utils/languageDetection';

interface LanguageContextType {
    currentLanguage: SupportedLanguage;
    setLanguage: (language: SupportedLanguage) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

// Translation function type
type TranslationFunction = (key: string, params?: Record<string, string | number>) => string;

// Basic translations - can be extended to load from external files
const translations: Record<SupportedLanguage, Record<string, string>> = {
    ja: {
        // App名とメタ情報
        'app.title': 'We diet - ダイエット・健康管理SNSアプリ',
        'app.description': 'ダイエットと健康管理を楽しくサポートするSNSアプリです。食事記録、運動記録、体重管理機能に加え、仲間と一緒に励まし合えるソーシャル機能で、継続的な健康習慣をサポートします。',
        'app.tagline': '仲間と一緒に楽しくダイエット！',

        // ナビゲーション
        'nav.home': 'ホーム',
        'nav.login': 'ログイン',
        'nav.dashboard': 'ダッシュボード',
        'nav.food_log': '食事記録',
        'nav.exercise': '運動記録',
        'nav.weight_management': '体重管理',
        'nav.social': 'ダイエット仲間',
        'nav.profile': 'プロフィール設定',

        // 機能説明
        'feature.food_tracking': '食事記録・カロリー管理',
        'feature.exercise_tracking': '運動記録・エクササイズ追跡',
        'feature.weight_management': '体重管理・進捗追跡',
        'feature.social': 'ソーシャル機能・仲間との励まし合い',
        'feature.analytics': '健康データ分析・レポート機能',

        // CTA・ボタン
        'cta.get_started': '始める',
        'cta.learn_more': 'もっと詳しく',
        'cta.sign_up': '新規登録',
        'cta.log_in': 'ログイン',
        'cta.try_free': '無料で始める',

        // FAQ
        'faq.free.question': 'We dietは無料で使えますか？',
        'faq.free.answer': 'はい、We dietは完全無料でご利用いただけます。食事記録、運動記録、体重管理、SNS機能など全ての機能を無料でお使いいただけます。',
        'faq.features.question': 'どのような機能がありますか？',
        'faq.features.answer': 'We dietには食事記録・カロリー管理、運動記録・エクササイズ追跡、体重管理・進捗追跡、仲間との励まし合いができるソーシャル機能、健康データ分析・レポート機能があります。',
        'faq.mobile.question': 'スマートフォンで使えますか？',
        'faq.mobile.answer': 'はい、We dietはレスポンシブデザインで、スマートフォン、タブレット、PCなど様々なデバイスでご利用いただけます。',

        // その他
        'common.loading': '読み込み中...',
        'common.error': 'エラーが発生しました',
        'common.retry': '再試行',
        'common.save': '保存',
        'common.cancel': 'キャンセル',
        'language.switch': '言語を切り替える',
    },
    en: {
        // App name and meta information
        'app.title': 'We diet - Diet & Health Management SNS App',
        'app.description': 'We diet is an SNS app that makes dieting and health management fun and supportive. Track your meals, exercises, and weight while connecting with friends for continuous motivation and healthy habits.',
        'app.tagline': 'Diet together, achieve together!',

        // Navigation
        'nav.home': 'Home',
        'nav.login': 'Login',
        'nav.dashboard': 'Dashboard',
        'nav.food_log': 'Food Log',
        'nav.exercise': 'Exercise',
        'nav.weight_management': 'Weight Management',
        'nav.social': 'Diet Community',
        'nav.profile': 'Profile Settings',

        // Feature descriptions
        'feature.food_tracking': 'Food Tracking & Calorie Management',
        'feature.exercise_tracking': 'Exercise Tracking & Workout Monitoring',
        'feature.weight_management': 'Weight Management & Progress Tracking',
        'feature.social': 'Social Features & Community Support',
        'feature.analytics': 'Health Data Analytics & Reports',

        // CTA & Buttons
        'cta.get_started': 'Get Started',
        'cta.learn_more': 'Learn More',
        'cta.sign_up': 'Sign Up',
        'cta.log_in': 'Log In',
        'cta.try_free': 'Try Free',

        // FAQ
        'faq.free.question': 'Is We diet free to use?',
        'faq.free.answer': 'Yes, We diet is completely free to use. All features including food tracking, exercise logging, weight management, and social features are available at no cost.',
        'faq.features.question': 'What features are available?',
        'faq.features.answer': 'We diet includes food tracking & calorie management, exercise tracking & workout monitoring, weight management & progress tracking, social features for community support, and health data analytics & reporting.',
        'faq.mobile.question': 'Can I use it on mobile devices?',
        'faq.mobile.answer': 'Yes, We diet features responsive design and works seamlessly on smartphones, tablets, PCs, and various other devices.',

        // Others
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'common.retry': 'Retry',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'language.switch': 'Switch Language',
    }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
        // Only run detection on client side
        if (typeof window !== 'undefined') {
            return detectUserLanguage();
        }
        return 'ja';
    });

    // Translation function
    const t: TranslationFunction = (key: string, params?: Record<string, string | number>) => {
        let translation = translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
        
        // Simple parameter substitution
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
            });
        }
        
        return translation;
    };

    // Set language and save preference
    const setLanguage = (language: SupportedLanguage) => {
        setCurrentLanguage(language);
        saveLanguagePreference(language);
        
        // Update document lang attribute for SEO
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language === 'ja' ? 'ja-JP' : 'en-US';
        }
    };

    // Update document language on mount and language change
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = currentLanguage === 'ja' ? 'ja-JP' : 'en-US';
        }
    }, [currentLanguage]);

    const value: LanguageContextType = {
        currentLanguage,
        setLanguage,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Utility hook for translations only
export const useTranslation = () => {
    const { t } = useLanguage();
    return { t };
};
