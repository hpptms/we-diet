import React from 'react';
import {
  Box,
  Container,
  Grid,
} from '@mui/material';
import LeftSidebar from '../../component/Dieter/LeftSidebar';
import PostForm from '../../component/Dieter/PostForm';
import PostCard from '../../component/Dieter/PostCard';
import SearchBar from '../../component/Dieter/SearchBar';
import TrendingTopics from '../../component/Dieter/TrendingTopics';
import RecommendedUsers from '../../component/Dieter/RecommendedUsers';
import { Post, TrendingTopic, RecommendedUser } from '../../component/Dieter/types';

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

interface DieterProps {
  onBack?: () => void;
  onViewChange?: (view: CurrentView) => void;
}

const Dieter: React.FC<DieterProps> = ({ onBack, onViewChange }) => {
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

  // サンプルデータ
  const posts: Post[] = [
    {
      id: 1,
      user: {
        name: '田中太郎',
        username: '@tanaka_taro',
        avatar: 'T',
      },
      content: '今日は1万歩歩きました！健康的な一日でした 💪 #健康 #ダイエット #運動',
      timestamp: '2時間前',
      likes: 12,
      retweets: 3,
      comments: 5,
    },
    {
      id: 2,
      user: {
        name: '佐藤花子',
        username: '@sato_hanako',
        avatar: 'S',
      },
      content: 'ヘルシーなサラダランチ🥗 カロリー控えめで美味しかった！',
      timestamp: '4時間前',
      likes: 25,
      retweets: 8,
      comments: 12,
      image: 'https://via.placeholder.com/400x200',
    },
    {
      id: 3,
      user: {
        name: '山田次郎',
        username: '@yamada_jiro',
        avatar: 'Y',
      },
      content: '筋トレ3セット完了！継続は力なり 💪 #筋トレ #フィットネス',
      timestamp: '6時間前',
      likes: 18,
      retweets: 5,
      comments: 8,
    },
  ];

  const trendingTopics: TrendingTopic[] = [
    { hashtag: '#ダイエット', posts: 1234 },
    { hashtag: '#健康', posts: 987 },
    { hashtag: '#筋トレ', posts: 654 },
  ];

  const recommendedUsers: RecommendedUser[] = [
    { name: '健康太郎', username: '@kenkou_taro', avatar: 'K', isFollowing: false },
    { name: 'フィット花子', username: '@fit_hanako', avatar: 'F', isFollowing: false },
    { name: 'ダイエット次郎', username: '@diet_jiro', avatar: 'D', isFollowing: false },
  ];

  const handlePost = (content: string) => {
    // ここで投稿処理を実装
    console.log('新しい投稿:', content);
  };

  const handleSearch = (query: string) => {
    // ここで検索処理を実装
    console.log('検索クエリ:', query);
  };

  const handleFollow = (username: string) => {
    // ここでフォロー処理を実装
    console.log('フォロー:', username);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
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
            />
          </Grid>

          {/* 中央カラム - メインコンテンツ */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6.75} sx={{ order: { xs: 2, md: 2 } }}>
            <Box sx={{ 
              backgroundColor: 'white', 
              minHeight: { xs: 'auto', md: '100vh' },
              borderLeft: { xs: 'none', md: '1px solid' },
              borderRight: { xs: 'none', md: '1px solid' },
              borderTop: { xs: '1px solid #42a5f5', md: 'none' },
              borderBottom: { xs: '1px solid #42a5f5', md: 'none' },
              borderColor: '#42a5f5',
              boxShadow: { xs: 'none', md: '0 4px 12px rgba(66, 165, 245, 0.15)' },
              maxWidth: '100%'
            }}>
              {/* 投稿フォーム */}
              <PostForm onPost={handlePost} />

              {/* 投稿一覧 */}
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Box>
          </Grid>

          {/* 右カラム - サイドバー */}
          <Grid item xs={12} sm={12} md={3} lg={3} xl={2.625} sx={{ order: { xs: 3, md: 3 } }}>
            <Box position={{ xs: 'static', md: 'sticky' }} top={0}>
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
