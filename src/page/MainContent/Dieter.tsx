import React, { useEffect, useMemo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
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

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

interface DieterProps {
  onBack?: () => void;
  onViewChange?: (view: CurrentView) => void;
  subView?: string;
}

const Dieter: React.FC<DieterProps> = ({ onBack, onViewChange, subView }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const { t } = useTranslation();

  // Use custom hooks for state and logic
  const dieterState = useDieterState(onViewChange);
  const dieterLogic = useDieterLogic(dieterState);

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
      onNavigateToFollowManagement={dieterLogic.handleNavigateToFollowManagement}
      onNavigateToMessages={dieterLogic.handleNavigateToMessages}
      onNavigateToNotifications={dieterLogic.handleNavigateToNotifications}
      onNavigateToHome={dieterLogic.handleNavigateToHome}
      onToggleFollowingPosts={dieterLogic.handleToggleFollowingPosts}
      onOpenPostModal={dieterLogic.handleOpenPostModal}
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
    dieterLogic.handleNavigateToFollowManagement,
    dieterLogic.handleNavigateToMessages,
    dieterLogic.handleNavigateToNotifications,
    dieterLogic.handleNavigateToHome,
    dieterLogic.handleToggleFollowingPosts,
    dieterLogic.handleOpenPostModal,
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
        onFollow={dieterLogic.handleFollow}
      />
    </>
  ), [dieterLogic.handleSearch, dieterState.trendingTopics, dieterState.recommendedUsers, dieterLogic.handleFollow]);

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
            onOpenPostModal={dieterLogic.handleOpenPostModal}
            onNavigateToProfile={dieterLogic.handleNavigateToProfile}
            onNavigateToNotifications={dieterLogic.handleNavigateToNotifications}
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
    </FollowProvider>
  );
};

export default Dieter;
