import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
  Modal,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Home, Edit, People } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { LeftSidebar } from '../../component/Dieter/layout';
import { PostForm, PostCard } from '../../component/Dieter/post';
import { SearchBar, TrendingTopics } from '../../component/Dieter/discover';
import { RecommendedUsers, FollowManagement } from '../../component/Dieter/user';
import { Messages } from '../../component/Dieter/message';
import NotificationsPage from '../../component/Dieter/notifications/NotificationsPage';
import { Post, TrendingTopic, RecommendedUser } from '../../component/Dieter/types';
import { dieterApi, LegacyRecommendedUser as ApiRecommendedUser } from '../../api/dieterApi';
import { darkModeState } from '../../recoil/darkModeAtom';
import { serverProfileState, profileSettingsState } from '../../recoil/profileSettingsAtom';
import { FollowProvider } from '../../context/FollowContext';
import { notificationManager } from '../../utils/notificationManager';
import { NotificationSettings } from '../../component/NotificationSettings';
import { useFollowCounts } from '../../component/Dieter/layout/LeftSidebar/hooks/useFollowCounts';
import { useFollowContextOptional } from '../../context/FollowContext';
import { postsApi } from '../../api/postsApi';
import '../../styles/mobile-responsive-fix.css';

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

interface DieterProps {
  onBack?: () => void;
  onViewChange?: (view: CurrentView) => void;
  subView?: string;
}

const Dieter: React.FC<DieterProps> = ({ onBack, onViewChange, subView }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const serverProfile = useRecoilValue(serverProfileState);
  const profileSettings = useRecoilValue(profileSettingsState);
  const navigate = useNavigate();
  const { followCounts, refreshFollowCounts } = useFollowCounts();
  
  // フォローコンテキストを取得（オプション）
  const followContext = useFollowContextOptional();
  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFollowManagement, setShowFollowManagement] = useState(false);
  const [showFollowingPosts, setShowFollowingPosts] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [deletedPostIds, setDeletedPostIds] = useState<Set<number>>(new Set());
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showMobileLeftSidebar, setShowMobileLeftSidebar] = useState(false);
  const [showMobileRightSidebar, setShowMobileRightSidebar] = useState(false);

  // subViewに基づいてフォロー管理画面の表示を制御
  useEffect(() => {
    if (subView === 'follow') {
      setShowFollowManagement(true);
    } else {
      setShowFollowManagement(false);
    }
  }, [subView]);
  
  const handleNavigateToProfile = () => {
    // ProfileSettings.tsxに移動
    console.log('プロフィールに移動');
    if (onViewChange) {
      onViewChange('profile');
    }
  };

  const handleNavigateToExercise = () => {
    // ExerciseRecord.tsxに移動
    console.log('運動記録に移動');
    if (onViewChange) {
      onViewChange('exercise');
    }
  };

  const handleNavigateToFoodLog = () => {
    // FoodLog.tsxに移動
    console.log('食事記録に移動');
    if (onViewChange) {
      onViewChange('FoodLog');
    }
  };

  // 投稿一覧を取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let response;
        if (showFollowingPosts) {
          // フォロー中ユーザーの投稿を取得
          response = await dieterApi.getFollowingPosts();
        } else {
          // 全体の投稿を取得
          response = await dieterApi.getPosts();
        }
        setPosts(response.posts);
      } catch (error) {
        console.error('投稿の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [showFollowingPosts]);

  // おすすめユーザーを取得（5分間隔でキャッシュ）
  useEffect(() => {
    const CACHE_KEY = 'recommended_users_cache';
    const CACHE_DURATION = 5 * 60 * 1000; // 5分間
    
    const fetchRecommendedUsers = async () => {
      try {
        // 実際のログインユーザーIDを取得
        const currentUserId = serverProfile.userId || undefined;
        
        // ログインユーザーが変わった場合、キャッシュをクリア
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp, cachedUserId } = JSON.parse(cachedData);
          const now = Date.now();
          
          // ログインユーザーが変わったかチェック
          if (cachedUserId !== currentUserId) {
            localStorage.removeItem(CACHE_KEY);
          } else if (now - timestamp < CACHE_DURATION) {
            // 同じユーザーでキャッシュが有効期限内の場合
            setRecommendedUsers(data);
            return;
          }
        }
        
        const response = await dieterApi.getRecommendedUsers(currentUserId);
        
        // APIのRecommendedUserをコンポーネントのRecommendedUserに変換
        const convertedUsers: RecommendedUser[] = response.users.map((user: ApiRecommendedUser) => ({
          id: user.id,
          name: user.name || `ユーザー${user.id}`,
          username: user.username ? `@${user.username}` : `@user${user.id}`,
          avatar: user.avatar || (user.name ? user.name.charAt(0) : 'U'),
          isFollowing: user.is_following
        }));
        
        // データをキャッシュに保存（ログインユーザーIDも保存）
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: convertedUsers,
          timestamp: Date.now(),
          cachedUserId: currentUserId
        }));
        
        setRecommendedUsers(convertedUsers);
      } catch (error) {
        // console.error('おすすめユーザーの取得に失敗しました:', error);
        // エラー時はデフォルトのユーザーを表示
        setRecommendedUsers([
          { id: 1, name: '健康太郎', username: '@kenkou_taro', avatar: 'K', isFollowing: false },
          { id: 2, name: 'フィット花子', username: '@fit_hanako', avatar: 'F', isFollowing: false },
          { id: 3, name: 'ダイエット次郎', username: '@diet_jiro', avatar: 'D', isFollowing: false },
        ]);
      }
    };

    fetchRecommendedUsers();
    
    // 5分間隔で更新
    const interval = setInterval(fetchRecommendedUsers, CACHE_DURATION);
    
    return () => clearInterval(interval);
  }, [serverProfile.userId]);

  // トレンドトピックを取得（30分間隔でキャッシュ）
  useEffect(() => {
    const TRENDING_CACHE_KEY = 'trending_topics_cache';
    const TRENDING_CACHE_DURATION = 30 * 60 * 1000; // 30分間
    
    const fetchTrendingTopics = async () => {
      try {
        // キャッシュから取得を試行
        const cachedData = localStorage.getItem(TRENDING_CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const now = Date.now();
          
          if (now - timestamp < TRENDING_CACHE_DURATION) {
            // キャッシュが有効期限内の場合
            setTrendingTopics(data);
            return;
          }
        }
        
        // APIからトレンドを取得
        const response = await dieterApi.getTrendingTopics();
        
        // データをTrendingTopic形式に変換
        const convertedTopics: TrendingTopic[] = response.topics.map((topic) => ({
          hashtag: topic.hashtag,
          posts: topic.posts,
        }));
        
        // データをキャッシュに保存
        localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify({
          data: convertedTopics,
          timestamp: Date.now(),
        }));
        
        setTrendingTopics(convertedTopics);
        
        console.log('トレンドトピックを取得しました:', convertedTopics);
      } catch (error) {
        console.error('トレンドトピックの取得に失敗しました:', error);
        // エラー時は空の配列を設定
        setTrendingTopics([]);
      }
    };

    fetchTrendingTopics();
    
    // 30分間隔で更新
    const interval = setInterval(fetchTrendingTopics, TRENDING_CACHE_DURATION);
    
    return () => clearInterval(interval);
  }, []);

  const handlePost = async (content: string, images?: File[], isSensitive?: boolean) => {
    try {
      const postData = {
        content: content,
        images: images || [],
        is_sensitive: isSensitive || false
      };

      console.log('投稿を作成中...', postData);
      const newPost = await dieterApi.createPost(postData);
      console.log('投稿が作成されました:', newPost);
      console.log('NewPost AuthorName:', newPost.AuthorName);
      console.log('NewPost AuthorPicture:', newPost.AuthorPicture);
      
      // 新しい投稿を投稿リストの先頭に追加（安全に更新）
      setPosts(prevPosts => {
        // 既存の投稿と重複しないかチェック
        const exists = prevPosts.find(post => post.ID === newPost.ID);
        if (exists) {
          return prevPosts;
        }
        
        // 新しい投稿をリストの先頭に追加
        const updatedPosts = [newPost, ...prevPosts];
        console.log('投稿リストが更新されました:', updatedPosts.length);
        return updatedPosts;
      });
      
      // 投稿後にもう一度投稿一覧を取得して同期を取る（オプション）
      try {
        const response = await dieterApi.getPosts();
        const allPosts = response.posts;
        console.log('投稿一覧を再取得しました:', allPosts.length);
        
        // サーバーからの最新データでUIを更新
        setPosts(allPosts);
      } catch (fetchError) {
        console.warn('投稿一覧の再取得に失敗しましたが、ローカル更新は成功しています:', fetchError);
      }
      
    } catch (error) {
      console.error('投稿の作成に失敗しました:', error);
      // ユーザーにエラーを表示（アラートまたはトーストなど）
      alert('投稿の作成に失敗しました。もう一度お試しください。');
      throw error; // PostFormでエラーハンドリングができるようにthrow
    }
  };

  // 現在のユーザー情報（PostFormが内部でRecoilから取得するため、基本情報のみ）
  const currentUser = {
    name: 'ダイエッター太郎',
    avatar: undefined // PostForm内部でRecoilから適切なアイコンを取得
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    // 空のクエリの場合は検索モードを終了
    if (query.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    // 検索モードに切り替え
    setIsSearching(true);
    setSearchLoading(true);

    try {
      const response = await dieterApi.searchPosts(query.trim());
      setSearchResults(response.posts);
    } catch (error) {
      console.error('検索に失敗しました:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFollow = async (userId: number) => {
    try {
      console.log('フォロー操作開始 - UserID:', userId, 'Current User:', serverProfile.userId);
      
      // PostCard.tsxと同じpostsApi.toggleFollowを使用
      const result = await postsApi.toggleFollow(userId);
      console.log('フォロー操作成功:', result.message);
      
      // 成功メッセージをコンソールに表示（アラートは削除）
      console.log('✅ フォロー操作成功:', result.message);
      
      // フォロー操作後、即座にフォロー数を更新（PostCardと同じ手法）
      try {
        // 0.5秒待機してからフォロー数を更新
        await new Promise(resolve => setTimeout(resolve, 500));
        await refreshFollowCounts();
        console.log('Dieter: ローカルフォロー数を更新しました');
        
        // 追加で1秒後にもう一度更新（確実性のため）
        setTimeout(async () => {
          try {
            await refreshFollowCounts();
            console.log('Dieter: フォロー数を再更新しました');
          } catch (error) {
            console.error('Dieter: フォロー数の再更新に失敗:', error);
          }
        }, 1000);
      } catch (error) {
        console.error('Dieter: フォロー数の更新に失敗しました:', error);
      }
      
      // UIを更新するため、おすすめユーザーリストを再取得
      const currentUserId = serverProfile.userId || undefined;
      const response = await dieterApi.getRecommendedUsers(currentUserId);
      
      const convertedUsers: RecommendedUser[] = response.users.map((user: ApiRecommendedUser) => ({
        id: user.id,
        name: user.name || `ユーザー${user.id}`,
        username: user.username ? `@${user.username}` : `@user${user.id}`,
        avatar: user.avatar || (user.name ? user.name.charAt(0) : 'U'),
        isFollowing: user.is_following
      }));
      
      setRecommendedUsers(convertedUsers);
      
      // キャッシュもクリア
      localStorage.removeItem('recommended_users_cache');
      
    } catch (error: any) {
      console.error('フォロー操作に失敗しました:', error);
      console.error('エラーの詳細:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // より詳細なエラーメッセージを表示
      const errorMessage = error.response?.data?.error || error.message || 'フォロー操作に失敗しました。もう一度お試しください。';
      alert(`エラー: ${errorMessage}`);
    }
  };

  const handleNavigateToFollowManagement = () => {
    console.log('フォロー管理画面に移動');
    navigate('/Dieter/Follow');
  };

  const handleBackFromFollowManagement = () => {
    navigate('/Dieter');
  };

  // フォローTLとホームTLを切り替える関数
  const handleToggleFollowingPosts = () => {
    setShowFollowingPosts(!showFollowingPosts);
  };

  // メッセージ画面に切り替える関数
  const handleNavigateToMessages = () => {
    console.log('メッセージ画面に移動');
    setShowMessages(true);
  };

  // メッセージ画面から戻る関数
  const handleBackFromMessages = () => {
    setShowMessages(false);
  };

  // ホームに戻る関数（メッセージ画面、通知画面、フォローTLから戻る）
  const handleNavigateToHome = () => {
    setShowMessages(false);
    setShowNotifications(false);
    setShowFollowingPosts(false);
  };

  // 通知画面に切り替える関数
  const handleNavigateToNotifications = () => {
    console.log('通知画面に移動');
    setShowNotifications(true);
    setShowMessages(false);
  };

  // 通知画面から戻る関数
  const handleBackFromNotifications = () => {
    setShowNotifications(false);
  };

  // ポストモーダルを開く関数
  const handleOpenPostModal = () => {
    setIsPostModalOpen(true);
  };

  // ポストモーダルを閉じる関数
  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  // 投稿削除ハンドラー（フロントエンドでの非表示処理）
  const handlePostDelete = (postId: number) => {
    setDeletedPostIds(prev => new Set(Array.from(prev).concat(postId)));
  };

  // センシティブコンテンツフィルタリング機能
  const filterSensitivePosts = (posts: Post[]): Post[] => {
    // センシティブフィルターが有効でない場合、センシティブな投稿を除外
    if (!profileSettings.enableSensitiveFilter) {
      return posts.filter(post => !post.IsSensitive);
    }
    // センシティブフィルターが有効な場合、すべての投稿を表示
    return posts;
  };


  // フォロー管理画面を表示中の場合
  if (showFollowManagement) {
    return <FollowManagement onBack={handleBackFromFollowManagement} />;
  }


  return (
    <FollowProvider refreshFollowCounts={refreshFollowCounts} followCounts={followCounts}>
      <Box sx={{ 
        minHeight: '100vh',
        background: isDarkMode 
          ? '#000000'
          : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
        py: 0,
        px: 0
      }}>
      <Box sx={{ maxWidth: '100vw', mx: 0 }}>
        {/* モバイル用左サイドバーオーバーレイ */}
        {showMobileLeftSidebar && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1300,
              display: { xs: 'block', md: 'none' }
            }}
          >
            {/* バックドロップ */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                animation: 'fadeIn 0.3s ease-out'
              }}
              onClick={() => setShowMobileLeftSidebar(false)}
            />
            
            {/* サイドバーコンテンツ */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '280px',
                backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
                boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
                animation: 'slideInLeft 0.3s ease-out',
                overflowY: 'auto'
              }}
            >
              {/* ヘッダー */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: isDarkMode ? '#ffffff' : '#333333',
                    fontWeight: 'bold'
                  }}
                >
                  メニュー
                </Typography>
                <Button
                  onClick={() => setShowMobileLeftSidebar(false)}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    color: isDarkMode ? '#ffffff' : '#333333'
                  }}
                >
                  ✕
                </Button>
              </Box>
              
              {/* サイドバーコンテンツ */}
              <LeftSidebar 
                onBack={onBack}
                onNavigateToProfile={handleNavigateToProfile}
                onNavigateToExercise={handleNavigateToExercise}
                onNavigateToFoodLog={handleNavigateToFoodLog}
                onNavigateToFollowManagement={handleNavigateToFollowManagement}
                onNavigateToMessages={handleNavigateToMessages}
                onNavigateToNotifications={handleNavigateToNotifications}
                onNavigateToHome={handleNavigateToHome}
                onToggleFollowingPosts={handleToggleFollowingPosts}
                onOpenPostModal={handleOpenPostModal}
                showFollowingPosts={showFollowingPosts}
                showNotifications={showNotifications}
              />
            </Box>
          </Box>
        )}

        {/* モバイル用右サイドバーオーバーレイ */}
        {showMobileRightSidebar && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1300,
              display: { xs: 'block', md: 'none' }
            }}
          >
            {/* バックドロップ */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                animation: 'fadeIn 0.3s ease-out'
              }}
              onClick={() => setShowMobileRightSidebar(false)}
            />
            
            {/* サイドバーコンテンツ */}
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '300px',
                backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
                boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
                animation: 'slideInRight 0.3s ease-out',
                overflowY: 'auto'
              }}
            >
              {/* ヘッダー */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: isDarkMode ? '#ffffff' : '#333333',
                    fontWeight: 'bold'
                  }}
                >
                  検索・おすすめ
                </Typography>
                <Button
                  onClick={() => setShowMobileRightSidebar(false)}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    color: isDarkMode ? '#ffffff' : '#333333'
                  }}
                >
                  ✕
                </Button>
              </Box>
              
              {/* 右サイドバーコンテンツ */}
              <Box sx={{ p: 2 }}>
                {/* 検索 */}
                <SearchBar onSearch={handleSearch} />

                {/* トレンド（トレンドがある場合のみ表示） */}
                {trendingTopics.length > 0 && (
                  <TrendingTopics topics={trendingTopics} />
                )}

                {/* おすすめユーザー */}
                <RecommendedUsers 
                  users={recommendedUsers} 
                  onFollow={handleFollow}
                />
              </Box>
            </Box>
          </Box>
        )}

        <Grid container spacing={0} sx={{ width: '100%' }}>
          {/* デスクトップ用左カラム - ナビゲーション */}
          <Grid item xs={0} sm={0} md={3} lg={3} xl={2.625} sx={{ 
            order: { xs: 1, md: 1 },
            display: { xs: 'none', md: 'block' }
          }}>
            <LeftSidebar 
              onBack={onBack}
              onNavigateToProfile={handleNavigateToProfile}
              onNavigateToExercise={handleNavigateToExercise}
              onNavigateToFoodLog={handleNavigateToFoodLog}
              onNavigateToFollowManagement={handleNavigateToFollowManagement}
              onNavigateToMessages={handleNavigateToMessages}
              onNavigateToNotifications={handleNavigateToNotifications}
              onNavigateToHome={handleNavigateToHome}
              onToggleFollowingPosts={handleToggleFollowingPosts}
              onOpenPostModal={handleOpenPostModal}
              showFollowingPosts={showFollowingPosts}
              showNotifications={showNotifications}
            />
          </Grid>

          {/* 中央カラム - メインコンテンツ */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6.75} sx={{ order: { xs: 1, md: 2 } }}>
            <Box sx={{ 
              backgroundColor: isDarkMode ? '#000000' : 'white', 
              minHeight: { xs: 'calc(100vh - 80px)', md: '100vh' },
              borderLeft: { xs: 'none', md: '1px solid white' },
              borderRight: { xs: 'none', md: '1px solid white' },
              borderTop: { xs: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`, md: 'none' },
              borderBottom: { xs: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`, md: 'none' },
              boxShadow: { xs: 'none', md: isDarkMode 
                ? '0 4px 12px rgba(187, 134, 252, 0.15)' 
                : '0 4px 12px rgba(66, 165, 245, 0.15)' },
              maxWidth: '100%',
              pb: { xs: 10, md: 0 } // Add padding bottom for mobile navigation
            }}>
              {/* モバイル用ヘッダー */}
              <Box sx={{
                display: { xs: 'block', md: 'none' },
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: isDarkMode ? '#000000' : 'white',
                borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
                p: 2
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  {/* ダッシュボードに戻るボタン */}
                  <Button
                    onClick={onBack}
                    sx={{
                      minWidth: 'auto',
                      p: 1,
                      color: isDarkMode ? '#ffffff' : '#333333',
                      fontSize: '0.9rem'
                    }}
                  >
                    ← ダッシュボード
                  </Button>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      color: isDarkMode ? '#ffffff' : '#333333',
                      fontWeight: 'bold'
                    }}
                  >
                    {showMessages ? 'メッセージ' : 
                     showNotifications ? '通知' :
                     showFollowingPosts ? 'フォロー中' : 'Dieter'}
                  </Typography>
                  
                  {/* 右側のサイドバーボタン */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* 左カラム表示ボタン（水色） */}
                    <Button
                      onClick={() => setShowMobileLeftSidebar(true)}
                      sx={{
                        minWidth: 'auto',
                        p: 1,
                        backgroundColor: '#4fc3f7',
                        color: 'white',
                        borderRadius: 2,
                        fontSize: '0.8rem',
                        '&:hover': {
                          backgroundColor: '#29b6f6',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      メニュー
                    </Button>
                    
                    {/* 右カラム表示ボタン（青） */}
                    <Button
                      onClick={() => setShowMobileRightSidebar(true)}
                      sx={{
                        minWidth: 'auto',
                        p: 1,
                        backgroundColor: '#1976d2',
                        color: 'white',
                        borderRadius: 2,
                        fontSize: '0.8rem',
                        '&:hover': {
                          backgroundColor: '#1565c0',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      検索
                    </Button>
                  </Box>
                </Box>
              </Box>

              {showMessages ? (
                /* メッセージ画面 */
                <Messages onBack={handleBackFromMessages} />
              ) : showNotifications ? (
                /* 通知画面 */
                <NotificationsPage 
                  onBack={handleBackFromNotifications}
                  onNotificationClick={(notification) => {
                    console.log('通知アイテムクリック:', notification);
                    // 通知をクリックしたときの処理（投稿詳細へ移動など）
                    setShowNotifications(false);
                  }}
                />
              ) : (
                <>
                  {/* 検索モードでない場合のみ投稿フォームを表示 */}
                  {!isSearching && (
                    <PostForm onPost={handlePost} currentUser={currentUser} />
                  )}

                  {/* 検索モードの場合は検索結果を表示 */}
                  {isSearching ? (
                    <>
                      {/* 検索結果ヘッダー */}
                      <Box sx={{ 
                        p: 2, 
                        borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
                        backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa'
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: isDarkMode ? '#ffffff' : '#333333',
                            fontSize: '1.1rem',
                            fontWeight: 600 
                          }}
                        >
                          "{searchQuery}" の検索結果
                        </Typography>
                      </Box>

                      {/* 検索結果 */}
                      {searchLoading ? (
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          py: 8,
                          flexDirection: 'column',
                          gap: 2
                        }}>
                          <CircularProgress 
                            size={40} 
                            sx={{ 
                              color: '#29b6f6' 
                            }} 
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              color: isDarkMode ? '#ffffff' : '#666666',
                              fontSize: '1rem'
                            }}
                          >
                            検索中...
                          </Typography>
                        </Box>
                      ) : searchResults.length === 0 ? (
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          py: 8
                        }}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: isDarkMode ? '#ffffff' : '#666666',
                              fontSize: '1rem',
                              textAlign: 'center'
                            }}
                          >
                            "{searchQuery}" に一致する投稿が見つかりませんでした。<br />
                            別のキーワードで検索してみてください。
                          </Typography>
                        </Box>
                      ) : (
                        filterSensitivePosts(searchResults)
                          .filter(post => !deletedPostIds.has(post.ID))
                          .map((post, index) => (
                            <PostCard 
                              key={`search-${post.ID}-${post.CreatedAt}-${index}`} 
                              post={post} 
                              onPostDelete={handlePostDelete}
                            />
                          ))
                      )}
                    </>
                  ) : (
                    <>
                      {/* 通常の投稿一覧 */}
                      {loading ? (
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          py: 8,
                          flexDirection: 'column',
                          gap: 2
                        }}>
                          <CircularProgress 
                            size={40} 
                            sx={{ 
                              color: '#29b6f6' 
                            }} 
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              color: isDarkMode ? '#ffffff' : '#666666',
                              fontSize: '1rem'
                            }}
                          >
                            投稿を読み込み中...
                          </Typography>
                        </Box>
                      ) : posts.length === 0 ? (
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          py: 8
                        }}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: isDarkMode ? '#ffffff' : '#666666',
                              fontSize: '1rem',
                              textAlign: 'center'
                            }}
                          >
                            まだ投稿がありません。<br />
                            最初の投稿をしてみましょう！
                          </Typography>
                        </Box>
                      ) : (
                        filterSensitivePosts(posts)
                          .filter(post => !deletedPostIds.has(post.ID))
                          .map((post, index) => (
                            <PostCard 
                              key={`${post.ID}-${post.CreatedAt}-${index}`} 
                              post={post} 
                              onPostDelete={handlePostDelete}
                            />
                          ))
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </Grid>

          {/* デスクトップ用右カラム - サイドバー */}
          <Grid item xs={0} sm={0} md={3} lg={3} xl={2.625} sx={{ 
            order: { xs: 2, md: 3 },
            display: { xs: 'none', md: 'block' }
          }}>
            <Box 
              position="sticky"
              top={0}
              sx={{
                maxHeight: '100vh',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(41, 182, 246, 0.5)',
                  borderRadius: '3px',
                  '&:hover': {
                    background: 'rgba(41, 182, 246, 0.7)',
                  },
                },
              }}
            >
              {/* 検索 */}
              <SearchBar onSearch={handleSearch} />

              {/* トレンド（トレンドがある場合のみ表示） */}
              {trendingTopics.length > 0 && (
                <TrendingTopics topics={trendingTopics} />
              )}

              {/* おすすめユーザー */}
              <RecommendedUsers 
                users={recommendedUsers} 
                onFollow={handleFollow}
              />
            </Box>
          </Grid>

          {/* モバイル用ボトムナビゲーション */}
          <Grid item xs={12} sx={{ 
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            order: 3
          }}>
            <Box sx={{
              backgroundColor: isDarkMode ? '#000000' : 'white',
              borderTop: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`,
              py: 1,
              paddingBottom: 'env(safe-area-inset-bottom)' // iOS Safari対応
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                maxWidth: 500,
                mx: 'auto'
              }}>
                {/* ホームボタン */}
                <Button
                  onClick={handleNavigateToHome}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    color: (!showFollowingPosts && !showMessages && !showNotifications) 
                      ? '#29b6f6' 
                      : (isDarkMode ? '#888' : '#666'),
                    flexDirection: 'column',
                    fontSize: '0.7rem'
                  }}
                >
                  <Home sx={{ fontSize: 20, mb: 0.5 }} />
                  ホーム
                </Button>

                {/* 検索ボタン */}
                <Button
                  onClick={() => {
                    // 簡単な検索プロンプトを表示
                    const query = prompt('検索キーワードを入力してください:');
                    if (query && query.trim()) {
                      handleSearch(query.trim());
                    }
                  }}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    color: isSearching ? '#29b6f6' : (isDarkMode ? '#888' : '#666'),
                    flexDirection: 'column',
                    fontSize: '0.7rem'
                  }}
                >
                  <Box sx={{ fontSize: 20, mb: 0.5 }}>🔍</Box>
                  検索
                </Button>

                {/* 投稿ボタン */}
                <Button
                  onClick={handleOpenPostModal}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    color: '#29b6f6',
                    flexDirection: 'column',
                    fontSize: '0.7rem'
                  }}
                >
                  <Edit sx={{ fontSize: 20, mb: 0.5 }} />
                  投稿
                </Button>

                {/* 通知ボタン */}
                <Button
                  onClick={handleNavigateToNotifications}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    color: showNotifications 
                      ? '#29b6f6' 
                      : (isDarkMode ? '#888' : '#666'),
                    flexDirection: 'column',
                    fontSize: '0.7rem',
                    position: 'relative'
                  }}
                >
                  <Box sx={{ fontSize: 20, mb: 0.5 }}>🔔</Box>
                  通知
                </Button>

                {/* プロフィールボタン */}
                <Button
                  onClick={handleNavigateToProfile}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    color: isDarkMode ? '#888' : '#666',
                    flexDirection: 'column',
                    fontSize: '0.7rem'
                  }}
                >
                  <People sx={{ fontSize: 20, mb: 0.5 }} />
                  設定
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Post Modal - モバイル対応 */}
      <Modal
        open={isPostModalOpen}
        onClose={handleClosePostModal}
        aria-labelledby="post-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1, md: 2 },
        }}
      >
        <Paper
          sx={{
            width: '100%',
            maxWidth: { xs: '95vw', sm: 600 },
            maxHeight: { xs: '90vh', md: '80vh' },
            overflow: 'auto',
            backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
            color: isDarkMode ? 'white' : 'black',
            borderRadius: 2,
            boxShadow: 24,
            position: 'relative',
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: 1,
              borderColor: isDarkMode ? '#333' : '#e0e0e0',
            }}
          >
            <Typography
              id="post-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 600 }}
            >
              新しい投稿
            </Typography>
            <IconButton
              onClick={handleClosePostModal}
              sx={{
                color: isDarkMode ? 'white' : 'black',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 0 }}>
            <PostForm onPost={handlePost} currentUser={currentUser} />
          </Box>
        </Paper>
      </Modal>
      </Box>
    </FollowProvider>
  );
};

export default Dieter;
