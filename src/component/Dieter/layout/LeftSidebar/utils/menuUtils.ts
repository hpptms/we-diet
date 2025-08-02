import React from 'react';
import {
    Home,
    Notifications,
    Message,
    Person,
    People,
} from '@mui/icons-material';
import { MenuItem } from '../types';

export const createMenuItems = (
    showNotifications: boolean,
    onNavigateToNotifications: (() => void) | undefined,
    onNavigateToProfile?: () => void,
    onNavigateToExercise?: () => void,
    onNavigateToFoodLog?: () => void,
    onNavigateToMessages?: () => void,
    onNavigateToHome?: () => void,
    onToggleFollowingPosts?: () => void,
    showFollowingPosts?: boolean
): { leftMenuItems: MenuItem[], additionalMenuItems: MenuItem[] } => {
    const leftMenuItems: MenuItem[] = [
        {
            icon: React.createElement(Home),
            label: 'ホーム',
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
            label: 'フォローTL',
            active: !showNotifications && (showFollowingPosts || false),
            onClick: () => {
                if (!(showFollowingPosts || false) && onToggleFollowingPosts) {
                    onToggleFollowingPosts(); // ホームからフォローTLに切り替え
                }
            }
        },
        {
            icon: React.createElement(Notifications),
            label: '通知',
            active: showNotifications,
            onClick: onNavigateToNotifications,
            hasNotification: true // We'll use this to show the notification bell component
        },
        { icon: React.createElement(Message), label: 'メッセージ', active: false, onClick: onNavigateToMessages },
        { icon: React.createElement(Person), label: 'プロフィール', active: false, onClick: onNavigateToProfile },
    ];

    // 新しく追加するメニューアイテム
    const additionalMenuItems: MenuItem[] = [
        { icon: React.createElement('span', { style: { fontSize: '24px' } }, '💪'), label: '今日の運動', active: false, onClick: onNavigateToExercise },
        { icon: React.createElement('span', { style: { fontSize: '24px' } }, '🍽️'), label: '食事を記録', active: false, onClick: onNavigateToFoodLog },
    ];

    return { leftMenuItems, additionalMenuItems };
};
