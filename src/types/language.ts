// i18nシステムの型を再エクスポート
import { type SupportedLanguage } from '../i18n';
export type Language = SupportedLanguage;

// 翻訳テキストの型定義
export interface LanguageProps {
    language: Language;
}
