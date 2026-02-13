import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { darkModeState } from '../../recoil/darkModeAtom';
import { LeftSidebar } from '../../component/Dieter/layout';
import { SearchBar, TrendingTopics } from '../../component/Dieter/discover';
import { RecommendedUsers, FollowManagement } from '../../component/Dieter/user';
import { FollowProvider } from '../../context/FollowContext';
import { useTranslation } from '../../hooks/useTranslation';
import '../../styles/mobile-responsive-fix.css';

// Import new components
import ResponsiveLayout from '../../component/Dieter/layout/ResponsiveLayout';
import MobileOverlays from '../../component/Dieter/mobile/MobileOverlays';
import MobileHeader from '../../component/Dieter/mobile/MobileHeader';
import MobileBottomNav from '../../component/Dieter/mobile/MobileBottomNav';
import MainContent from '../../component/Dieter/content/MainContent';
import PostModal from '../../component/Dieter/modal/PostModal';

// Import custom hooks
import { useDieterState } from '../../hooks/useDieterState';
import { useDieterLogic } from '../../hooks/useDieterLogic';

// 認証チェック関数
const checkIsAuthenticated = (): boolean => {
  return !!localStorage.getItem("accountName") || !!localStorage.getItem("jwt_token");
};

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

interface DieterProps {
  onBack?: () => void;
  onViewChange?: (view: CurrentView) => void;
  subView?: string;
}

const Dieter: React.FC<DieterProps> = ({ onBack, onViewChange, subView }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 認証必要ダイアログの状態
  const [loginRequiredDialogOpen, setLoginRequiredDialogOpen] = useState(false);

  // 認証が必要なアクションをガードするラッパー
  const requireAuth = useCallback((action: () => void) => {
    if (checkIsAuthenticated()) {
      action();
    } else {
      setLoginRequiredDialogOpen(true);
    }
  }, []);

  // Use custom hooks for state and logic
  const dieterState = useDieterState(onViewChange);
  const dieterLogic = useDieterLogic(dieterState);

  // 認証ガード付きのコールバック
  const handleOpenPostModalGuarded = useCallback(() => {
    requireAuth(dieterLogic.handleOpenPostModal);
  }, [requireAuth, dieterLogic.handleOpenPostModal]);

  const handleFollowGuarded = useCallback(async (userId: number) => {
    if (checkIsAuthenticated()) {
      await dieterLogic.handleFollow(userId);
    } else {
      setLoginRequiredDialogOpen(true);
    }
  }, [dieterLogic.handleFollow]);

  const handleNavigateToMessagesGuarded = useCallback(() => {
    requireAuth(dieterLogic.handleNavigateToMessages);
  }, [requireAuth, dieterLogic.handleNavigateToMessages]);

  const handleNavigateToNotificationsGuarded = useCallback(() => {
    requireAuth(dieterLogic.handleNavigateToNotifications);
  }, [requireAuth, dieterLogic.handleNavigateToNotifications]);

  const handleToggleFollowingPostsGuarded = useCallback(() => {
    requireAuth(dieterLogic.handleToggleFollowingPosts);
  }, [requireAuth, dieterLogic.handleToggleFollowingPosts]);

  const handleNavigateToFollowManagementGuarded = useCallback(() => {
    requireAuth(dieterLogic.handleNavigateToFollowManagement);
  }, [requireAuth, dieterLogic.handleNavigateToFollowManagement]);

  // subViewに基づいてフォロー管理画面の表示を制御
  useEffect(() => {
    if (subView === 'follow') {
      dieterState.setShowFollowManagement(true);
    } else {
      dieterState.setShowFollowManagement(false);
    }
  }, [subView]);

  // Title for mobile header
  const mobileHeaderTitle = useMemo(() => {
    if (dieterState.showMessages) return t('messages', 'messages');
    if (dieterState.showNotifications) return t('notifications', 'notifications');
    if (dieterState.showFollowingPosts) return t('profile', 'following');
    return 'Dieter';
  }, [dieterState.showMessages, dieterState.showNotifications, dieterState.showFollowingPosts, t]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: any) => {
    console.log('Notification item clicked:', notification);
    dieterState.setShowNotifications(false);
  }, [dieterState.setShowNotifications]);

  // Memoize callbacks for mobile overlays
  const handleShowMobileLeftSidebar = useCallback(() => dieterState.setShowMobileLeftSidebar(true), [dieterState.setShowMobileLeftSidebar]);
  const handleShowMobileRightSidebar = useCallback(() => dieterState.setShowMobileRightSidebar(true), [dieterState.setShowMobileRightSidebar]);
  const handleCloseMobileLeftSidebar = useCallback(() => dieterState.setShowMobileLeftSidebar(false), [dieterState.setShowMobileLeftSidebar]);
  const handleCloseMobileRightSidebar = useCallback(() => dieterState.setShowMobileRightSidebar(false), [dieterState.setShowMobileRightSidebar]);
  const handleBackFromMessages = useCallback(() => dieterState.setShowMessages(false), [dieterState.setShowMessages]);
  const handleBackFromNotifications = useCallback(() => dieterState.setShowNotifications(false), [dieterState.setShowNotifications]);
  const handleFollowManagementBack = useCallback(() => dieterState.navigate('/Dieter'), [dieterState.navigate]);
  const noopCallback = useCallback(() => {}, []);

  // Memoize LeftSidebar component to avoid re-rendering
  const leftSidebarContent = useMemo(() => (
    <LeftSidebar
      onBack={onBack}
      onNavigateToProfile={dieterLogic.handleNavigateToProfile}
      onNavigateToExercise={dieterLogic.handleNavigateToExercise}
      onNavigateToFoodLog={dieterLogic.handleNavigateToFoodLog}
      onNavigateToFollowManagement={handleNavigateToFollowManagementGuarded}
      onNavigateToMessages={handleNavigateToMessagesGuarded}
      onNavigateToNotifications={handleNavigateToNotificationsGuarded}
      onNavigateToHome={dieterLogic.handleNavigateToHome}
      onToggleFollowingPosts={handleToggleFollowingPostsGuarded}
      onOpenPostModal={handleOpenPostModalGuarded}
      showFollowingPosts={dieterState.showFollowingPosts}
      showNotifications={dieterState.showNotifications}
      notificationManager={dieterState.notificationManager}
      messageManager={dieterState.messageManager}
    />
  ), [
    onBack,
    dieterLogic.handleNavigateToProfile,
    dieterLogic.handleNavigateToExercise,
    dieterLogic.handleNavigateToFoodLog,
    handleNavigateToFollowManagementGuarded,
    handleNavigateToMessagesGuarded,
    handleNavigateToNotificationsGuarded,
    dieterLogic.handleNavigateToHome,
    handleToggleFollowingPostsGuarded,
    handleOpenPostModalGuarded,
    dieterState.showFollowingPosts,
    dieterState.showNotifications,
    dieterState.notificationManager,
    dieterState.messageManager
  ]);

  // Memoize RightSidebar content to avoid re-rendering
  const rightSidebarContent = useMemo(() => (
    <>
      <SearchBar onSearch={dieterLogic.handleSearch} />
      {dieterState.trendingTopics.length > 0 && (
        <TrendingTopics topics={dieterState.trendingTopics} />
      )}
      <RecommendedUsers
        users={dieterState.recommendedUsers}
        onFollow={handleFollowGuarded}
      />
    </>
  ), [dieterLogic.handleSearch, dieterState.trendingTopics, dieterState.recommendedUsers, handleFollowGuarded]);

  // フォロー管理画面を表示中の場合
  if (dieterState.showFollowManagement) {
    return <FollowManagement onBack={handleFollowManagementBack} />;
  }

  return (
    <FollowProvider refreshFollowCounts={dieterState.refreshFollowCounts} followCounts={dieterState.followCounts}>
      <ResponsiveLayout
        isDarkMode={isDarkMode}
        leftSidebar={leftSidebarContent}
        mobileBottomNav={
          <MobileBottomNav
            isDarkMode={isDarkMode}
            showFollowingPosts={dieterState.showFollowingPosts}
            showMessages={dieterState.showMessages}
            showNotifications={dieterState.showNotifications}
            isSearching={dieterState.isSearching}
            onNavigateToHome={dieterLogic.handleNavigateToHome}
            onOpenPostModal={handleOpenPostModalGuarded}
            onNavigateToProfile={dieterLogic.handleNavigateToProfile}
            onNavigateToNotifications={handleNavigateToNotificationsGuarded}
            onSearch={dieterLogic.handleSearch}
          />
        }
        mainContent={
          <MainContent
            isDarkMode={isDarkMode}
            showMessages={dieterState.showMessages}
            showNotifications={dieterState.showNotifications}
            isSearching={dieterState.isSearching}
            searchQuery={dieterState.searchQuery}
            searchLoading={dieterState.searchLoading}
            searchResults={dieterState.searchResults}
            loading={dieterState.loading}
            posts={dieterState.posts}
            deletedPostIds={dieterState.deletedPostIds}
            currentUser={dieterLogic.currentUser}
            showFollowingPosts={dieterState.showFollowingPosts}
            onBackFromMessages={handleBackFromMessages}
            onBackFromNotifications={handleBackFromNotifications}
            onNotificationClick={handleNotificationClick}
            onPost={dieterLogic.handlePost}
            onPostDelete={dieterLogic.handlePostDelete}
            filterSensitivePosts={dieterLogic.filterSensitivePosts}
          />
        }
        rightSidebar={rightSidebarContent}
        mobileHeader={
          <MobileHeader
            onBack={onBack}
            title={mobileHeaderTitle}
            isDarkMode={isDarkMode}
            onShowLeftSidebar={handleShowMobileLeftSidebar}
            onShowRightSidebar={handleShowMobileRightSidebar}
          />
        }
        mobileLeftOverlay={
          <MobileOverlays
            showLeftSidebar={dieterState.showMobileLeftSidebar}
            showRightSidebar={false}
            onCloseLeftSidebar={handleCloseMobileLeftSidebar}
            onCloseRightSidebar={noopCallback}
            isDarkMode={isDarkMode}
            leftSidebarContent={leftSidebarContent}
            rightSidebarContent={<></>}
          />
        }
        mobileRightOverlay={
          <MobileOverlays
            showLeftSidebar={false}
            showRightSidebar={dieterState.showMobileRightSidebar}
            onCloseLeftSidebar={noopCallback}
            onCloseRightSidebar={handleCloseMobileRightSidebar}
            isDarkMode={isDarkMode}
            leftSidebarContent={<></>}
            rightSidebarContent={rightSidebarContent}
          />
        }
      />

      {/* Post Modal */}
      <PostModal
        open={dieterState.isPostModalOpen}
        onClose={dieterLogic.handleClosePostModal}
        isDarkMode={isDarkMode}
        onPost={dieterLogic.handlePost}
        currentUser={dieterLogic.currentUser}
      />

      {/* 認証必要ダイアログ */}
      <Dialog
        open={loginRequiredDialogOpen}
        onClose={() => setLoginRequiredDialogOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            padding: 1,
            backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
            color: isDarkMode ? 'white' : 'black',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {t('dieter', 'loginRequired.title', {}, '登録が必要です')}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography>
            {t('dieter', 'loginRequired.message', {}, '投稿するには登録が必要です')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button
            onClick={() => setLoginRequiredDialogOpen(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            {t('dieter', 'loginRequired.cancel', {}, 'キャンセル')}
          </Button>
          <Button
            onClick={() => {
              setLoginRequiredDialogOpen(false);
              navigate('/login');
            }}
            variant="contained"
            sx={{
              minWidth: 100,
              background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0288d1 30%, #1976d2 90%)',
              },
            }}
          >
            {t('dieter', 'loginRequired.register', {}, '登録する')}
          </Button>
        </DialogActions>
      </Dialog>
    </FollowProvider>
  );
};

export default Dieter;
