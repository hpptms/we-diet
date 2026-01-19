import React, { useEffect } from 'react';
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
  const getMobileHeaderTitle = () => {
    if (dieterState.showMessages) return t('messages', 'messages');
    if (dieterState.showNotifications) return t('notifications', 'notifications');
    if (dieterState.showFollowingPosts) return t('profile', 'following');
    return 'Dieter';
  };

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    console.log('Notification item clicked:', notification);
    dieterState.setShowNotifications(false);
  };

  // フォロー管理画面を表示中の場合
  if (dieterState.showFollowManagement) {
    return <FollowManagement onBack={() => dieterState.navigate('/Dieter')} />;
  }


  return (
    <FollowProvider refreshFollowCounts={dieterState.refreshFollowCounts} followCounts={dieterState.followCounts}>
      <ResponsiveLayout
        isDarkMode={isDarkMode}
        leftSidebar={
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
        }
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
            onBackFromMessages={() => dieterState.setShowMessages(false)}
            onBackFromNotifications={() => dieterState.setShowNotifications(false)}
            onNotificationClick={handleNotificationClick}
            onPost={dieterLogic.handlePost}
            onPostDelete={dieterLogic.handlePostDelete}
            filterSensitivePosts={dieterLogic.filterSensitivePosts}
          />
        }
        rightSidebar={
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
        }
        mobileHeader={
          <MobileHeader
            onBack={onBack}
            title={getMobileHeaderTitle()}
            isDarkMode={isDarkMode}
            onShowLeftSidebar={() => dieterState.setShowMobileLeftSidebar(true)}
            onShowRightSidebar={() => dieterState.setShowMobileRightSidebar(true)}
          />
        }
        mobileLeftOverlay={
          <MobileOverlays
            showLeftSidebar={dieterState.showMobileLeftSidebar}
            showRightSidebar={false}
            onCloseLeftSidebar={() => dieterState.setShowMobileLeftSidebar(false)}
            onCloseRightSidebar={() => {}}
            isDarkMode={isDarkMode}
            leftSidebarContent={
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
            }
            rightSidebarContent={<></>}
          />
        }
        mobileRightOverlay={
          <MobileOverlays
            showLeftSidebar={false}
            showRightSidebar={dieterState.showMobileRightSidebar}
            onCloseLeftSidebar={() => {}}
            onCloseRightSidebar={() => dieterState.setShowMobileRightSidebar(false)}
            isDarkMode={isDarkMode}
            leftSidebarContent={<></>}
            rightSidebarContent={
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
            }
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
