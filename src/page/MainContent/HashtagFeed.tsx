import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Tag } from '@mui/icons-material';
import { darkModeState } from '../../recoil/darkModeAtom';
import { dieterApi, LegacyPost } from '../../api/dieterApi';
import PostCard from '../../component/Dieter/post/PostCard';
import { Post } from '../../component/Dieter/types';

const HashtagFeed: React.FC = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const navigate = useNavigate();
  const isDarkMode = useRecoilValue(darkModeState);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

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

  const fetchPosts = useCallback(async (pageNum: number) => {
    if (!hashtag) return;

    try {
      setIsLoading(true);
      const response = await dieterApi.getPostsByHashtag(hashtag, pageNum, 20);

      const convertedPosts = response.posts.map(convertLegacyPostToPost);

      if (pageNum === 1) {
        setPosts(convertedPosts);
      } else {
        setPosts(prev => [...prev, ...convertedPosts]);
      }

      setTotal(response.pagination.total);
      setHasMore(convertedPosts.length === 20);
    } catch (error) {
      console.error('Failed to fetch posts by hashtag:', error);
    } finally {
      setIsLoading(false);
    }
  }, [hashtag]);

  useEffect(() => {
    setPage(1);
    fetchPosts(1);
  }, [hashtag, fetchPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePostDelete = (postId: number) => {
    setPosts(prev => prev.filter(post => post.ID !== postId));
  };

  const displayHashtag = hashtag ? (hashtag.startsWith('#') ? hashtag : `#${hashtag}`) : '';

  return (
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
            sx={{
              color: isDarkMode ? '#fff' : '#333',
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tag sx={{ color: '#1da1f2', fontSize: '1.5rem' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: isDarkMode ? '#fff' : '#333',
              }}
            >
              {displayHashtag}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: isDarkMode ? '#999' : '#666',
            mt: 0.5,
            ml: 7,
          }}
        >
          {total}件の投稿
        </Typography>
      </Box>

      {/* Posts List */}
      <Box>
        {isLoading && posts.length === 0 ? (
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
        ) : posts.length === 0 ? (
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
            <Tag sx={{ fontSize: '4rem', color: isDarkMode ? '#333' : '#ccc', mb: 2 }} />
            <Typography
              variant="h6"
              sx={{
                color: isDarkMode ? '#fff' : '#333',
                fontWeight: 600,
                mb: 1,
              }}
            >
              投稿がありません
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? '#999' : '#666',
                textAlign: 'center',
              }}
            >
              {displayHashtag} を含む投稿はまだありません
            </Typography>
          </Box>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.ID}
                post={post}
                onPostDelete={handlePostDelete}
              />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  py: 3,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={30} sx={{ color: '#1da1f2' }} />
                ) : (
                  <Typography
                    onClick={handleLoadMore}
                    sx={{
                      color: '#1da1f2',
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    もっと見る
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default HashtagFeed;
