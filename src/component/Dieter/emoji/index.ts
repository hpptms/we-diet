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

export const emojiCategories: EmojiCategory[] = [
    {
        name: '最近使った絵文字',
        icon: '🕒',
        emojis: [] // 動的に更新される
    },
    {
        name: '人と表情',
        icon: '😀',
        emojis: peopleAndFacesEmojis
    },
    {
        name: '動物と自然',
        icon: '🐶',
        emojis: animalsAndNatureEmojis
    },
    {
        name: '食べ物と飲み物',
        icon: '🍎',
        emojis: foodAndDrinkEmojis
    },
    {
        name: 'アクティビティ',
        icon: '⚽',
        emojis: activitiesEmojis
    },
    {
        name: '旅行と場所',
        icon: '🚗',
        emojis: travelAndPlacesEmojis
    },
    {
        name: 'もの',
        icon: '💡',
        emojis: objectsEmojis
    },
    {
        name: '記号',
        icon: '❤️',
        emojis: symbolsEmojis
    },
    {
        name: '旗',
        icon: '🚩',
        emojis: flagsEmojis
    }
];

// すべての絵文字を一つの配列として取得
export const allEmojis = emojiCategories.reduce((acc, category) => {
    return [...acc, ...category.emojis];
}, [] as string[]);
