import { peopleAndFacesEmojis } from './peopleAndFaces';
import { animalsAndNatureEmojis } from './animalsAndNature';
import { foodAndDrinkEmojis } from './foodAndDrink';
import { activitiesEmojis } from './activities';
import { travelAndPlacesEmojis } from './travelAndPlaces';
import { objectsEmojis } from './objects';
import { symbolsEmojis } from './symbols';
import { flagsEmojis } from './flags';

export interface EmojiCategory {
    name: string;
    icon: string;
    emojis: string[];
}

// 最近使った絵文字を管理する関数
export const getRecentEmojis = (): string[] => {
    const recent = localStorage.getItem('recentEmojis');
    return recent ? JSON.parse(recent) : [];
};

export const addRecentEmoji = (emoji: string): void => {
    let recent = getRecentEmojis();
    // 既存の絵文字を削除（重複を避ける）
    recent = recent.filter(e => e !== emoji);
    // 先頭に追加
    recent.unshift(emoji);
    // 最大20個まで保持
    recent = recent.slice(0, 20);
    localStorage.setItem('recentEmojis', JSON.stringify(recent));
};

// 翻訳関数を受け取って翻訳されたカテゴリーを返す
export const getTranslatedEmojiCategories = (t: (category: string, key: string, placeholders?: Record<string, string>, fallback?: string) => string): EmojiCategory[] => [
    {
        name: t('dieter', 'emojiCategory.recent', {}, '最近使った絵文字'),
        icon: '🕒',
        emojis: []
    },
    {
        name: t('dieter', 'emojiCategory.peopleAndFaces', {}, '人と表情'),
        icon: '😀',
        emojis: peopleAndFacesEmojis
    },
    {
        name: t('dieter', 'emojiCategory.animalsAndNature', {}, '動物と自然'),
        icon: '🐶',
        emojis: animalsAndNatureEmojis
    },
    {
        name: t('dieter', 'emojiCategory.foodAndDrink', {}, '食べ物と飲み物'),
        icon: '🍎',
        emojis: foodAndDrinkEmojis
    },
    {
        name: t('dieter', 'emojiCategory.activities', {}, 'アクティビティ'),
        icon: '⚽',
        emojis: activitiesEmojis
    },
    {
        name: t('dieter', 'emojiCategory.travelAndPlaces', {}, '旅行と場所'),
        icon: '🚗',
        emojis: travelAndPlacesEmojis
    },
    {
        name: t('dieter', 'emojiCategory.objects', {}, 'もの'),
        icon: '💡',
        emojis: objectsEmojis
    },
    {
        name: t('dieter', 'emojiCategory.symbols', {}, '記号'),
        icon: '❤️',
        emojis: symbolsEmojis
    },
    {
        name: t('dieter', 'emojiCategory.flags', {}, '旗'),
        icon: '🚩',
        emojis: flagsEmojis
    }
];

// デフォルトのカテゴリー（後方互換性のため）
export const emojiCategories: EmojiCategory[] = getTranslatedEmojiCategories(
    (_cat, _key, _ph, fallback) => fallback || ''
);

// すべての絵文字を一つの配列として取得
export const allEmojis = emojiCategories.reduce((acc, category) => {
    return [...acc, ...category.emojis];
}, [] as string[]);
