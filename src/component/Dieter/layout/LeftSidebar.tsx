import React from 'react';
import {
    Box,
    Button,
} from '@mui/material';
import {
    Edit,
    ArrowBack,
    Home,
    People,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { profileSettingsState, serverProfileState } from '../../../recoil/profileSettingsAtom';
import NotificationsPage from '../notifications/NotificationsPage';
import { Notification } from '../types';
import {
    useFollowCounts,
    useNotifications,
    useMessages,
    UserCard,
    MenuList,
    getUserUtils,
    createMenuItems,
    LeftSidebarProps
} from './LeftSidebar/index';
import { useFollowContextOptional } from '../../../context/FollowContext';

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
    onBack, 
    onNavigateToProfile,
    onNavigateToExercise, 
    onNavigateToFoodLog,
    onNavigateToFollowManagement,
    onNavigateToMessages,
    onNavigateToNotifications,
    onNavigateToHome,
    onToggleFollowingPosts,
    onOpenPostModal,
    showFollowingPosts = false,
    showNotifications = false
}) => {
    // Recoilからプロフィール情報を取得
    const profileSettings = useRecoilValue(profileSettingsState);
    const serverProfile = useRecoilValue(serverProfileState);
    
    // フォローコンテキストを取得（親のDieter.tsxから）
    const followContext = useFollowContextOptional();
    
    // カスタムフックを使用（フォロー数はコンテキストがない場合のフォールバック）
    const { followCounts: localFollowCounts, refreshFollowCounts: localRefreshFollowCounts } = useFollowCounts();
    const {
        unreadNotificationCount,
        resetNotificationCount
    } = useNotifications();
    const { unreadMessageCount } = useMessages();
    
    // フォロー数を表示するための関数を定義
    const getFollowCounts = () => {
        // FollowContextが利用可能で、かつフォロー数が取得されている場合はそれを使用
        if (followContext && followContext.followCounts) {
            return followContext.followCounts;
        }
        // フォールバックとしてローカルのフォロー数を使用
        return localFollowCounts;
    };

    // ユーザー情報取得関数
    const { getIconSrc, getDisplayName, getUserId } = getUserUtils(profileSettings, serverProfile);

    // メニューアイテムを生成
    const { leftMenuItems, additionalMenuItems } = createMenuItems(
        showNotifications,
        onNavigateToNotifications,
        onNavigateToProfile,
        onNavigateToExercise,
        onNavigateToFoodLog,
        onNavigateToMessages,
        onNavigateToHome,
        onToggleFollowingPosts,
        showFollowingPosts,
        resetNotificationCount
    );


    return (
        <Box sx={{ p: 2, position: 'sticky', top: 0, minHeight: '100vh' }}>
            {/* 戻るボタン */}
            {onBack && (
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                    fullWidth
                    sx={{ 
                        mb: 2, 
                        borderRadius: 3, 
                        py: 1,
                        fontSize: '0.9rem',
                        borderColor: '#29b6f6',
                        color: '#29b6f6',
                        '&:hover': {
                            borderColor: '#0288d1',
                            backgroundColor: 'rgba(41, 182, 246, 0.08)'
                        }
                    }}
                >
                    ダッシュボードに戻る
                </Button>
            )}

            
            <MenuList
                leftMenuItems={leftMenuItems}
                additionalMenuItems={additionalMenuItems}
                unreadNotificationCount={unreadNotificationCount}
                unreadMessageCount={unreadMessageCount}
            />
            
            <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={onOpenPostModal}
                fullWidth
                sx={{ 
                    mt: 2, 
                    borderRadius: 3, 
                    py: 1.5,
                    px: 2,
                    background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
                    boxShadow: '0 4px 16px rgba(41, 182, 246, 0.4)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #0288d1 30%, #1976d2 90%)',
                        boxShadow: '0 6px 20px rgba(41, 182, 246, 0.6)',
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                ポストする
            </Button>
            
            {/* ユーザーカード */}
            <UserCard
                getIconSrc={getIconSrc}
                getDisplayName={getDisplayName}
                getUserId={getUserId}
                followCounts={getFollowCounts()}
                onNavigateToFollowManagement={onNavigateToFollowManagement}
            />
        </Box>
    );
};

export default LeftSidebar;
