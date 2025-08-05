import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supportedLanguages, getLanguageDisplayName } from '../utils/languageDetection';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
    className?: string;
    showLabel?: boolean;
    variant?: 'dropdown' | 'toggle' | 'buttons';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
    className = '', 
    showLabel = true,
    variant = 'dropdown'
}) => {
    const { currentLanguage, setLanguage, t } = useLanguage();

    const handleLanguageChange = (newLanguage: string) => {
        if (supportedLanguages.some(lang => lang.code === newLanguage)) {
            setLanguage(newLanguage as any);
        }
    };

    // Dropdown variant
    if (variant === 'dropdown') {
        return (
            <div className={`language-switcher ${className}`}>
                {showLabel && (
                    <label htmlFor="language-select" className="language-switcher__label">
                        {t('language.switch')}
                    </label>
                )}
                <select
                    id="language-select"
                    value={currentLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="language-switcher__select"
                    aria-label={t('language.switch')}
                >
                    {supportedLanguages.map((language) => (
                        <option key={language.code} value={language.code}>
                            {language.nativeName} ({language.name})
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    // Toggle variant (for 2 languages)
    if (variant === 'toggle') {
        const otherLanguage = supportedLanguages.find(lang => lang.code !== currentLanguage);
        if (!otherLanguage) return null;

        return (
            <button
                onClick={() => handleLanguageChange(otherLanguage.code)}
                className={`language-switcher language-switcher--toggle ${className}`}
                aria-label={`${t('language.switch')} - ${otherLanguage.nativeName}`}
                title={`${t('language.switch')} - ${otherLanguage.nativeName}`}
            >
                <span className="language-switcher__current">
                    {currentLanguage.toUpperCase()}
                </span>
                <span className="language-switcher__arrow">⇄</span>
                <span className="language-switcher__next">
                    {otherLanguage.code.toUpperCase()}
                </span>
            </button>
        );
    }

    // Buttons variant
    if (variant === 'buttons') {
        return (
            <div className={`language-switcher language-switcher--buttons ${className}`}>
                {showLabel && (
                    <span className="language-switcher__label">
                        {t('language.switch')}:
                    </span>
                )}
                <div className="language-switcher__button-group">
                    {supportedLanguages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`language-switcher__button ${
                                currentLanguage === language.code ? 'language-switcher__button--active' : ''
                            }`}
                            aria-label={`${t('language.switch')} - ${language.nativeName}`}
                            aria-pressed={currentLanguage === language.code}
                        >
                            {language.nativeName}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

export default LanguageSwitcher;
