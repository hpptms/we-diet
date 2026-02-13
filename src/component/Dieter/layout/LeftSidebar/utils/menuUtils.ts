import React from 'react';
import {
    Home,
    Notifications,
    Message,
    Person,
    People,
} from '@mui/icons-material';
import { MenuItem } from '../types';
import { TranslationKey } from '../../../../../i18n';

export const createMenuItems = (
    showNotifications: boolean,
    onNavigateToNotifications: (() => void) | undefined,
    onNavigateToProfile?: () => void,
    onNavigateToExercise?: () => void,
    onNavigateToFoodLog?: () => void,
    onNavigateToMessages?: () => void,
    onNavigateToHome?: () => void,
    onToggleFollowingPosts?: () => void,
    showFollowingPosts?: boolean,
    resetNotificationCount?: () => void,
    t?: (category: TranslationKey, key: string, placeholders?: Record<string, string | number>, fallback?: string) => string
): { leftMenuItems: MenuItem[], additionalMenuItems: MenuItem[] } => {
    const leftMenuItems: MenuItem[] = [
        {
            icon: React.createElement(Home),
            label: t ? t('dieter', 'navigation.home', {}, 'ホーム') : 'ホーム',
            active: !showNotifications && !(showFollowingPosts || false),
            onClick: () => {
                // ホームに戻る処理（メッセージ画面、フォローTLから戻る）
                if (onNavigateToHome) {
                    onNavigateToHome(); // 統一されたホーム戻り処理
                } else if ((showFollowingPosts || false) && onToggleFollowingPosts) {
                    onToggleFollowingPosts(); // フォローTLからホームに切り替え（従来の処理）
                }
            }
        },
        {
            icon: React.createElement(People),
            label: t ? t('dieter', 'navigation.followTL', {}, 'フォローTL') : 'フォローTL',
            active: !showNotifications && (showFollowingPosts || false),
            onClick: () => {
                if (!(showFollowingPosts || false) && onToggleFollowingPosts) {
                    onToggleFollowingPosts(); // ホームからフォローTLに切り替え
                }
            }
        },
        {
            icon: React.createElement(Notifications),
            label: t ? t('dieter', 'navigation.notifications', {}, '通知') : '通知',
            active: showNotifications,
            onClick: () => {
                // 通知タブを開く前にカウントをリセット
                if (resetNotificationCount) {
                    resetNotificationCount();
                }
                // 通知ページに移動
                if (onNavigateToNotifications) {
                    onNavigateToNotifications();
                }
            },
            hasNotification: true // We'll use this to show the notification bell component
        },
        { icon: React.createElement(Message), label: t ? t('dieter', 'navigation.messages', {}, 'メッセージ') : 'メッセージ', active: false, onClick: onNavigateToMessages },
        { icon: React.createElement(Person), label: t ? t('dieter', 'navigation.profile', {}, 'プロフィール') : 'プロフィール', active: false, onClick: onNavigateToProfile },
    ];

    // 新しく追加するメニューアイテム
    const additionalMenuItems: MenuItem[] = [
        { icon: React.createElement('span', { style: { fontSize: '24px' } }, '💪'), label: t ? t('dieter', 'navigation.todaysExercise', {}, '今日の運動') : '今日の運動', active: false, onClick: onNavigateToExercise },
        { icon: React.createElement('span', { style: { fontSize: '24px' } }, '🍽️'), label: t ? t('dieter', 'navigation.recordMeal', {}, '食事を記録') : '食事を記録', active: false, onClick: onNavigateToFoodLog },
        { icon: React.createElement('span', { style: { fontSize: '24px' } }, '📝'), label: t ? t('dieter', 'navigation.blog', {}, 'ブログ') : 'ブログ', active: false, onClick: () => window.open('https://we-diet.net/blog/', '_blank') },
        { icon: React.createElement('span', { style: { fontSize: '24px' } }, '⚖️'), label: t ? t('dieter', 'navigation.weightTransition', {}, '体重の推移') : '体重の推移', active: false, onClick: () => { window.location.href = '/WeightManagement'; } },
    ];

    return { leftMenuItems, additionalMenuItems };
};
