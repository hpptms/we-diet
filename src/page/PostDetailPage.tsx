import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { darkModeState } from '../recoil/darkModeAtom';
import { useTranslation } from '../hooks/useTranslation';
import { dieterApi, LegacyPost } from '../api/dieterApi';
import PostCard from '../component/Dieter/post/PostCard';
import { Post } from '../component/Dieter/types';
import { SEOHelmet } from '../component/SEOHelmet';

// LegacyPost を Post に変換
const convertLegacyPostToPost = (legacyPost: LegacyPost): Post => ({
  ID: legacyPost.ID,
  UserID: legacyPost.UserID,
  Content: legacyPost.Content,
  ImageURL: legacyPost.ImageURL,
  Images: legacyPost.Images,
  IsPublic: legacyPost.IsPublic,
  IsSensitive: legacyPost.IsSensitive,
  AuthorName: legacyPost.AuthorName,
  AuthorPicture: legacyPost.AuthorPicture,
  IsRetweet: legacyPost.IsRetweet,
  RetweetUserID: legacyPost.RetweetUserID,
  RetweetUserName: legacyPost.RetweetUserName,
  RetweetUserPicture: legacyPost.RetweetUserPicture,
  RetweetedAt: legacyPost.RetweetedAt,
  User: legacyPost.User ? {
    ID: legacyPost.User.ID,
    UserName: legacyPost.User.UserName,
    Email: legacyPost.User.Email,
    Picture: legacyPost.User.Picture,
  } : undefined,
  Comments: legacyPost.Comments?.map(c => ({
    ID: c.ID,
    PostID: c.PostID,
    UserID: c.UserID,
    Content: c.Content,
    AuthorName: c.AuthorName,
    AuthorPicture: c.AuthorPicture,
    User: c.User ? {
      ID: c.User.ID,
      UserName: c.User.UserName,
      Email: c.User.Email,
      Picture: c.User.Picture,
    } : undefined,
    CreatedAt: c.CreatedAt,
    UpdatedAt: c.UpdatedAt,
  })),
  Retweets: legacyPost.Retweets?.map(r => ({
    ID: r.ID,
    PostID: r.PostID,
    UserID: r.UserID,
    User: r.User ? {
      ID: r.User.ID,
      UserName: r.User.UserName,
      Email: r.User.Email,
      Picture: r.User.Picture,
    } : undefined,
    CreatedAt: r.CreatedAt,
    UpdatedAt: r.UpdatedAt,
  })),
  Likes: legacyPost.Likes?.map(l => ({
    ID: l.ID,
    PostID: l.PostID,
    UserID: l.UserID,
    User: l.User ? {
      ID: l.User.ID,
      UserName: l.User.UserName,
      Email: l.User.Email,
      Picture: l.User.Picture,
    } : undefined,
    CreatedAt: l.CreatedAt,
    UpdatedAt: l.UpdatedAt,
  })),
  CreatedAt: legacyPost.CreatedAt,
  UpdatedAt: legacyPost.UpdatedAt,
});

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDarkMode = useRecoilValue(darkModeState);
  const { t } = useTranslation();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!id) return;

    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      setError(t('dieter', 'post.invalidPostId', {}, '無効な投稿IDです'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await dieterApi.getPost(postId);
      setPost(convertLegacyPostToPost(response));
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setError(t('dieter', 'post.postNotFound', {}, '投稿が見つかりませんでした'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handlePostDelete = () => {
    navigate('/');
  };

  // OGP用のデータ
  const ogTitle = post
    ? t('dieter', 'post.userPostTitle', {user: post.AuthorName}, `${post.AuthorName}さんの投稿 | We Diet`)
    : `We Diet - ${t('dieter', 'post.dietSNS', {}, 'ダイエットSNS')}`;
  const ogDescription = post
    ? post.Content.length > 100
      ? post.Content.substring(0, 100) + '...'
      : post.Content
    : t('dieter', 'post.defaultDescription', {}, 'ダイエット仲間と一緒に頑張ろう');
  const ogImage = post?.Images && post.Images.length > 0
    ? post.Images[0]
    : post?.ImageURL || undefined;

  return (
    <>
      <SEOHelmet
        title={ogTitle}
        description={ogDescription}
        canonicalUrl={`https://we-diet.net/post/${id}`}
        ogType="article"
        ogImage={ogImage}
      />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: isDarkMode ? '#000000' : '#f5f8fa',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: isDarkMode ? '1px solid #29b6f6' : '1px solid #e1f5fe',
            px: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handleBack}
              sx={{ color: isDarkMode ? '#fff' : '#333' }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: isDarkMode ? '#fff' : '#333',
              }}
            >
              {t('dieter', 'post.postHeader', {}, '投稿')}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 8,
              }}
            >
              <CircularProgress sx={{ color: '#1da1f2' }} />
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: isDarkMode ? '#fff' : '#333',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {error}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? '#999' : '#666',
                  textAlign: 'center',
                  mb: 3,
                }}
              >
                {t('dieter', 'post.postMayBeDeletedOrPrivate', {}, 'この投稿は削除されたか、非公開に設定されている可能性があります。')}
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                sx={{
                  backgroundColor: '#29b6f6',
                  color: '#fff',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#0288d1',
                  },
                }}
              >
                {t('dieter', 'post.goToTopPage', {}, 'トップページへ')}
              </Button>
            </Box>
          ) : post ? (
            <>
              <PostCard
                post={post}
                onPostDelete={handlePostDelete}
              />

              {/* CTA: ログインしていない場合 */}
              {!localStorage.getItem('jwt_token') && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    px: 3,
                    borderTop: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: isDarkMode ? '#ccc' : '#555',
                      mb: 2,
                    }}
                  >
                    {t('dieter', 'post.joinWeDiet', {}, 'We Dietに参加してダイエット仲間と一緒に頑張ろう！')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      sx={{
                        backgroundColor: '#29b6f6',
                        color: '#fff',
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#0288d1',
                        },
                      }}
                    >
                      {t('auth', 'register', {}, '新規登録')}
                    </Button>
                    <Button
                      component={Link}
                      to="/login"
                      variant="outlined"
                      sx={{
                        borderColor: '#29b6f6',
                        color: '#29b6f6',
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#0288d1',
                          backgroundColor: 'rgba(41, 182, 246, 0.05)',
                        },
                      }}
                    >
                      {t('auth', 'login', {}, 'ログイン')}
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          ) : null}
        </Box>
      </Box>
    </>
  );
};

export default PostDetailPage;
