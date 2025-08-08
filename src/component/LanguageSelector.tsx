import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { SupportedLanguage } from '../i18n';

interface LanguageSelectorProps {
    className?: string;
    showLabels?: boolean;
    compact?: boolean;
}

/**
 * 言語選択コンポーネント
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    className = '',
    showLabels = true,
    compact = false,
}) => {
    const { language, setLanguage, availableLanguages, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (newLanguage: SupportedLanguage) => {
        setLanguage(newLanguage);
        setIsOpen(false);
    };

    const currentLanguageInfo = availableLanguages.find(lang => lang.code === language);

    if (compact) {
        return (
            <div className={`relative ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <span className="font-medium">
                        {currentLanguageInfo?.nativeName || language}
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                    language === lang.code
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-gray-700'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{lang.nativeName}</span>
                                    {showLabels && (
                                        <span className="text-xs text-gray-500">
                                            {lang.name}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${className}`}>
            {showLabels && (
                <label className="block text-sm font-medium text-gray-700">
                    {t('settings', 'language')}
                </label>
            )}
            <div className="relative">
                <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {availableLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.nativeName} ({lang.name})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

/**
 * シンプルな言語切り替えボタン
 */
export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { language, setLanguage, availableLanguages } = useTranslation();

    const handleToggle = () => {
        const currentIndex = availableLanguages.findIndex(lang => lang.code === language);
        const nextIndex = (currentIndex + 1) % availableLanguages.length;
        setLanguage(availableLanguages[nextIndex].code);
    };

    const currentLanguageInfo = availableLanguages.find(lang => lang.code === language);

    return (
        <button
            onClick={handleToggle}
            className={`flex items-center space-x-1 px-2 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors ${className}`}
            title={`Current: ${currentLanguageInfo?.nativeName}. Click to switch language.`}
        >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
            </svg>
            <span className="font-medium">
                {currentLanguageInfo?.code.toUpperCase()}
            </span>
        </button>
    );
};
