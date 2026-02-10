import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
    SupportedLanguage,
    LanguageInfo,
    SUPPORTED_LANGUAGES,
    getCurrentLanguage,
    setStoredLanguage,
    setLanguageToEnglish,
    setLanguageToJapanese,
    setLanguageToChineseCN,
    setLanguageToKorean,
    setLanguageToSpanish,
    setLanguageToPortuguese,
} from '../i18n';

/**
 * URLパスから言語を検出する
 * /en/ → 'en', /en/privacy-policy → 'en', /es/ → 'es', /ko/ → 'ko', /zh/ → 'zh-CN'
 */
const detectLanguageFromURL = (): SupportedLanguage | null => {
    const path = window.location.pathname;
    const langPrefixes: { prefix: string; lang: SupportedLanguage }[] = [
        { prefix: '/en/', lang: 'en' },
        { prefix: '/es/', lang: 'es' },
        { prefix: '/ko/', lang: 'ko' },
        { prefix: '/zh/', lang: 'zh-CN' },
        { prefix: '/pt/', lang: 'pt' },
    ];
    for (const { prefix, lang } of langPrefixes) {
        if (path === prefix || path.startsWith(prefix)) {
            return lang;
        }
    }
    return null;
};

export interface LanguageContextType {
    language: SupportedLanguage;
    setLanguage: (language: SupportedLanguage) => void;
    availableLanguages: LanguageInfo[];
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
    children: ReactNode;
    defaultLanguage?: SupportedLanguage;
}

/**
 * 多言語化プロバイダー
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
    children,
    defaultLanguage,
}) => {
    const [language, setCurrentLanguage] = useState<SupportedLanguage>(() => {
        // 優先度: URLパス > デフォルト引数 > 保存済み/ブラウザ設定
        return detectLanguageFromURL() || defaultLanguage || getCurrentLanguage();
    });

    // 初期化処理（言語の再評価 + ストレージ監視 + グローバル関数公開）
    useEffect(() => {
        // URL検出の言語が最優先（URL指定がない場合のみ保存済み設定を使用）
        const urlLang = detectLanguageFromURL();
        if (!urlLang) {
            const currentLang = getCurrentLanguage();
            if (currentLang !== language) {
                setCurrentLanguage(currentLang);
            }
        }

        // HTML lang属性を設定
        document.documentElement.lang = language;

        // ローカルストレージの変更を監視
        const handleStorageChange = () => {
            const newLang = getCurrentLanguage();
            setCurrentLanguage(newLang);
        };
        window.addEventListener('storage', handleStorageChange);

        // 開発用：コンソールから言語を変更できるようにグローバルに公開
        if (import.meta.env.DEV) {
            (window as any).setLanguageToEnglish = () => {
                setLanguageToEnglish();
                window.location.reload();
            };
            (window as any).setLanguageToJapanese = () => {
                setLanguageToJapanese();
                window.location.reload();
            };
            (window as any).setLanguageToChineseCN = () => {
                setLanguageToChineseCN();
                window.location.reload();
            };
            (window as any).setLanguageToKorean = () => {
                setLanguageToKorean();
                window.location.reload();
            };
            (window as any).setLanguageToSpanish = () => {
                setLanguageToSpanish();
                window.location.reload();
            };
            (window as any).setLanguageToPortuguese = () => {
                setLanguageToPortuguese();
                window.location.reload();
            };
        }

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // 言語変更時の処理
    useEffect(() => {
        setStoredLanguage(language);
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = (newLanguage: SupportedLanguage) => {
        setCurrentLanguage(newLanguage);
    };

    const contextValue: LanguageContextType = {
        language,
        setLanguage,
        availableLanguages: SUPPORTED_LANGUAGES,
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

/**
 * LanguageContextを使用するためのヘルパー関数
 */
export const useLanguageContext = (): LanguageContextType => {
    const context = React.useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguageContext must be used within a LanguageProvider');
    }
    return context;
};
