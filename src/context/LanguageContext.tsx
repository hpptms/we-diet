import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
    SupportedLanguage,
    LanguageInfo,
    SUPPORTED_LANGUAGES,
    getCurrentLanguage,
    setStoredLanguage,
} from '../i18n';

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
        return defaultLanguage || getCurrentLanguage();
    });

    const setLanguage = (newLanguage: SupportedLanguage) => {
        setCurrentLanguage(newLanguage);
        setStoredLanguage(newLanguage);

        // HTML lang属性を更新
        if (typeof document !== 'undefined') {
            document.documentElement.lang = newLanguage;
        }

        // ページタイトルを更新（必要に応じて）
        // updatePageTitle(newLanguage);
    };

    // 初期化時にHTML lang属性を設定
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, []);

    // 言語変更を監視してローカルストレージに保存
    useEffect(() => {
        setStoredLanguage(language);
    }, [language]);

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
