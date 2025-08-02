import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { LeftSidebar } from '../../component/Dieter/layout';
import { PostForm, PostCard } from '../../component/Dieter/post';
import { SearchBar, TrendingTopics } from '../../component/Dieter/discover';
import { RecommendedUsers, FollowManagement } from '../../component/Dieter/user';
import { Messages } from '../../component/Dieter/message';
import NotificationsPage from '../../component/Dieter/notifications/NotificationsPage';
import { Post, TrendingTopic, RecommendedUser } from '../../component/Dieter/types';
import { postsApi, RecommendedUser as ApiRecommendedUser } from '../../api/postsApi';
import { darkModeState } from '../../recoil/darkModeAtom';
import { serverProfileState } from '../../recoil/profileSettingsAtom';

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

interface DieterProps {
  onBack?: () => void;
  onViewChange?: (view: CurrentView) => void;
  subView?: string;
}

const Dieter: React.FC<DieterProps> = ({ onBack, onViewChange, subView }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const serverProfile = useRecoilValue(serverProfileState);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFollowManagement, setShowFollowManagement] = useState(false);
  const [showFollowingPosts, setShowFollowingPosts] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
          response = await postsApi.getFollowingPosts();
        } else {
          // 全体の投稿を取得
          response = await postsApi.getPosts();
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
        console.log('現在のログインユーザーID:', currentUserId);
        
        // ログインユーザーが変わった場合、キャッシュをクリア
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp, cachedUserId } = JSON.parse(cachedData);
          const now = Date.now();
          
          // ログインユーザーが変わったかチェック
          if (cachedUserId !== currentUserId) {
            console.log('ログインユーザーが変わったため、キャッシュをクリア');
            localStorage.removeItem(CACHE_KEY);
          } else if (now - timestamp < CACHE_DURATION) {
            // 同じユーザーでキャッシュが有効期限内の場合
            console.log('キャッシュからおすすめユーザーを読み込み');
            setRecommendedUsers(data);
            return;
          }
        }
        
        // APIから新しいデータを取得
        console.log('APIからおすすめユーザーを取得');
        
        const response = await postsApi.getRecommendedUsers(currentUserId);
        
        // APIのRecommendedUserをコンポーネントのRecommendedUserに変換
        const convertedUsers: RecommendedUser[] = response.users.map((user: ApiRecommendedUser) => ({
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
        console.error('おすすめユーザーの取得に失敗しました:', error);
        // エラー時はデフォルトのユーザーを表示
        setRecommendedUsers([
          { name: '健康太郎', username: '@kenkou_taro', avatar: 'K', isFollowing: false },
          { name: 'フィット花子', username: '@fit_hanako', avatar: 'F', isFollowing: false },
          { name: 'ダイエット次郎', username: '@diet_jiro', avatar: 'D', isFollowing: false },
        ]);
      }
    };

    fetchRecommendedUsers();
    
    // 5分間隔で更新
    const interval = setInterval(fetchRecommendedUsers, CACHE_DURATION);
    
    return () => clearInterval(interval);
  }, [serverProfile.userId]);

  const trendingTopics: TrendingTopic[] = [
    { hashtag: '#ダイエット', posts: 1234 },
    { hashtag: '#健康', posts: 987 },
    { hashtag: '#筋トレ', posts: 654 },
  ];

  const handlePost = async (content: string, images?: File[], isSensitive?: boolean) => {
    try {
      const postData = {
        content: content,
        images: images || [],
        is_sensitive: isSensitive || false
      };

      console.log('投稿を作成中...', postData);
      const newPost = await postsApi.createPost(postData);
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
        const response = await postsApi.getPosts();
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

  const handleSearch = (query: string) => {
    // ここで検索処理を実装
    console.log('検索クエリ:', query);
  };

  const handleFollow = async (username: string) => {
    try {
      // usernameからuserIDを抽出（@user123のような形式からIDを取得）
      const userIdMatch = username.match(/@user(\d+)/);
      if (!userIdMatch) {
        console.error('ユーザーIDの抽出に失敗しました:', username);
        return;
      }
      
      const userId = parseInt(userIdMatch[1], 10);
      console.log('フォロー/アンフォロー対象のユーザーID:', userId);
      
      const result = await postsApi.toggleFollow(userId);
      console.log('フォロー結果:', result);
      
      // UIを更新するため、おすすめユーザーリストを再取得
      const currentUserId = serverProfile.userId || undefined;
      const response = await postsApi.getRecommendedUsers(currentUserId);
      
      const convertedUsers: RecommendedUser[] = response.users.map((user: ApiRecommendedUser) => ({
        name: user.name || `ユーザー${user.id}`,
        username: user.username ? `@${user.username}` : `@user${user.id}`,
        avatar: user.avatar || (user.name ? user.name.charAt(0) : 'U'),
        isFollowing: user.is_following
      }));
      
      setRecommendedUsers(convertedUsers);
      
      // キャッシュもクリア
      localStorage.removeItem('recommended_users_cache');
      
    } catch (error) {
      console.error('フォロー処理でエラーが発生しました:', error);
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

  // フォロー管理画面を表示中の場合
  if (showFollowManagement) {
    return <FollowManagement onBack={handleBackFromFollowManagement} />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: isDarkMode 
        ? '#000000'
        : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      py: 0,
      px: 0
    }}>
      <Box sx={{ maxWidth: '100vw', mx: 0 }}>
        <Grid container spacing={0} sx={{ width: '100%' }}>
          {/* 左カラム - ナビゲーション */}
          <Grid item xs={12} sm={12} md={3} lg={3} xl={2.625} sx={{ order: { xs: 1, md: 1 } }}>
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
              showFollowingPosts={showFollowingPosts}
              showNotifications={showNotifications}
            />
          </Grid>

          {/* 中央カラム - メインコンテンツ */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6.75} sx={{ order: { xs: 2, md: 2 } }}>
            <Box sx={{ 
              backgroundColor: isDarkMode ? '#000000' : 'white', 
              minHeight: { xs: 'auto', md: '100vh' },
              borderLeft: { xs: 'none', md: '1px solid white' },
              borderRight: { xs: 'none', md: '1px solid white' },
              borderTop: { xs: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`, md: 'none' },
              borderBottom: { xs: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`, md: 'none' },
              boxShadow: { xs: 'none', md: isDarkMode 
                ? '0 4px 12px rgba(187, 134, 252, 0.15)' 
                : '0 4px 12px rgba(66, 165, 245, 0.15)' },
              maxWidth: '100%'
            }}>
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
                  {/* 投稿フォーム */}
                  <PostForm onPost={handlePost} currentUser={currentUser} />

                  {/* 投稿一覧 */}
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
                    posts.map((post) => (
                      <PostCard key={post.ID} post={post} />
                    ))
                  )}
                </>
              )}
            </Box>
          </Grid>

          {/* 右カラム - サイドバー */}
          <Grid item xs={12} sm={12} md={3} lg={3} xl={2.625} sx={{ order: { xs: 3, md: 3 } }}>
            <Box 
              position={{ xs: 'static', md: 'sticky' }} 
              top={0}
              sx={{
                maxHeight: { xs: 'auto', md: '100vh' },
                overflowY: { xs: 'visible', md: 'auto' },
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

              {/* トレンド */}
              <TrendingTopics topics={trendingTopics} />

              {/* おすすめユーザー */}
              <RecommendedUsers users={recommendedUsers} onFollow={handleFollow} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dieter;
