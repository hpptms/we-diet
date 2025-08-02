import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Repeat,
  Share,
  Send,
  AccountCircle,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { Post, Comment } from '../types';
import { postsApi } from '../../../api/postsApi';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { profileSettingsState, serverProfileState } from '../../../recoil/profileSettingsAtom';
import { DEFAULT_IMAGES } from '../../../image/DefaultImage';

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const profileSettings = useRecoilValue(profileSettingsState);
  const serverProfile = useRecoilValue(serverProfileState);
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.Comments || []);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [retweetCount, setRetweetCount] = useState(post.Retweets?.length || 0);
  const [likeCount, setLikeCount] = useState(post.Likes?.length || 0);

  // 現在のユーザーのリツイート/ライク状態を確認
  React.useEffect(() => {
    const currentUserId = serverProfile.userId;
    if (currentUserId && post.Retweets) {
      const hasRetweeted = post.Retweets.some(retweet => retweet.UserID === currentUserId);
      setRetweeted(hasRetweeted);
    }
    if (currentUserId && post.Likes) {
      const hasLiked = post.Likes.some(like => like.UserID === currentUserId);
      setLiked(hasLiked);
    }
    setRetweetCount(post.Retweets?.length || 0);
    setLikeCount(post.Likes?.length || 0);
  }, [post.Retweets, post.Likes, serverProfile.userId]);
  
  // デバッグ用：ユーザー情報をコンソールに出力
  React.useEffect(() => {
    console.log('PostCard - AuthorName:', post.AuthorName);
    console.log('PostCard - AuthorPicture:', post.AuthorPicture);
    console.log('PostCard - AuthorPicture type:', typeof post.AuthorPicture);
    console.log('PostCard - AuthorPicture length:', post.AuthorPicture?.length);
    console.log('PostCard - User情報:', post.User);
    
    // AuthorPictureが有効なURLかチェック
    const isValidUrl = post.AuthorPicture && post.AuthorPicture.trim() !== '' && post.AuthorPicture.startsWith('http');
    console.log('PostCard - AuthorPicture is valid URL:', isValidUrl);
  }, [post.AuthorName, post.AuthorPicture, post.User]);
  
  // タイムスタンプを日本時間で表示
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}日前`;
    } else if (diffHours > 0) {
      return `${diffHours}時間前`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}分前`;
    }
  };

  // タイムスタンプを日本時間で表示（コメント用）
  const formatCommentTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}日前`;
    } else if (diffHours > 0) {
      return `${diffHours}時間前`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? 'たった今' : `${diffMinutes}分前`;
    }
  };

  const handleLike = async () => {
    if (liked) return; // すでにライクしている場合は何もしない
    
    try {
      const result = await postsApi.likePost(post.ID);
      setLiked(true);
      setLikeCount(prevCount => prevCount + 1);
      console.log('ライクしました');
    } catch (error) {
      console.error('ライクに失敗しました:', error);
    }
  };

  const handleRetweet = async () => {
    if (retweeted) return; // すでにリツイートしている場合は何もしない
    
    try {
      const result = await postsApi.retweetPost(post.ID);
      setRetweeted(true);
      setRetweetCount(prevCount => prevCount + 1);
      console.log('リツイートしました');
    } catch (error) {
      console.error('リツイートに失敗しました:', error);
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      const newComment = await postsApi.createComment(post.ID, {
        content: commentText.trim(),
      });
      
      // コメントリストに新しいコメントを追加
      setComments(prevComments => [...prevComments, newComment]);
      
      // 入力フィールドをクリア
      setCommentText('');
      
      console.log('コメントが投稿されました:', newComment);
    } catch (error) {
      console.error('コメントの投稿に失敗しました:', error);
      alert('コメントの投稿に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleSubmitComment();
    }
  };

  // 現在のユーザーのアイコンを取得する関数（UserAvatarと同じロジック）
  const getCurrentUserIcon = () => {
    // サーバーからのデータを優先
    if (serverProfile.profile) {
      if (serverProfile.profile.icon_type === 'upload' && serverProfile.profile.uploaded_icon) {
        return serverProfile.profile.uploaded_icon;
      }
      if (serverProfile.profile.icon_type === 'preset' && serverProfile.profile.selected_preset_id) {
        const presetImage = DEFAULT_IMAGES.find(img => img.id === serverProfile.profile!.selected_preset_id);
        return presetImage?.url;
      }
    }
    
    // ローカルデータにフォールバック
    if (profileSettings.iconType === 'upload' && profileSettings.uploadedIcon) {
      return profileSettings.uploadedIcon;
    }
    if (profileSettings.iconType === 'preset' && profileSettings.selectedPresetId) {
      const presetImage = DEFAULT_IMAGES.find(img => img.id === profileSettings.selectedPresetId);
      return presetImage?.url;
    }
    
    return undefined;
  };

  // 現在のユーザー名を取得する関数
  const getCurrentUserName = () => {
    // サーバーからのデータを優先
    if (serverProfile.profile?.display_name) {
      return serverProfile.profile.display_name;
    }
    
    // ローカルデータにフォールバック
    if (profileSettings.displayName) {
      return profileSettings.displayName;
    }
    
    return 'ユーザー';
  };

  const handleShare = () => {
    // TODO: シェア機能の実装
    console.log('シェア機能は今後実装予定');
  };

  return (
    <Box sx={{ 
      p: 4, 
      mb: 0, 
      borderBottom: isDarkMode ? '2px solid #29b6f6' : '2px solid #e1f5fe',
      transition: 'all 0.3s ease',
      '&:hover': { 
        backgroundColor: isDarkMode ? 'rgba(41, 182, 246, 0.05)' : 'rgba(227, 242, 253, 0.4)',
        transform: 'translateX(4px)',
        boxShadow: '0 4px 20px rgba(41, 182, 246, 0.1)'
      } 
    }}>
      <Box display="flex" gap={3}>
        <Avatar 
          src={post.AuthorPicture && post.AuthorPicture.trim() !== '' ? post.AuthorPicture : undefined}
          alt={post.AuthorName || 'ユーザー'}
          imgProps={{
            onError: (e) => {
              console.log('Avatar画像の読み込みに失敗:', post.AuthorPicture);
              console.log('フォールバックを表示します');
            }
          }}
          sx={{ 
            bgcolor: 'linear-gradient(45deg, #42a5f5 30%, #29b6f6 90%)',
            width: 48,
            height: 48,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            boxShadow: '0 3px 10px rgba(66, 165, 245, 0.3)'
          }}
        >
          {post.AuthorName ? post.AuthorName.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600,
              color: '#0277bd',
              fontSize: '1.1rem'
            }}>
              {post.AuthorName || 'ユーザー'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#546e7a' }}>
              @{post.AuthorName || 'user'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#90a4ae' }}>
              ·
            </Typography>
            <Typography variant="body2" sx={{ color: '#90a4ae' }}>
              {formatTimestamp(post.CreatedAt)}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ 
            mb: 3, 
            lineHeight: 1.6,
            fontSize: '1.1rem',
            color: isDarkMode ? '#ffffff' : '#37474f'
          }}>
            {post.Content}
          </Typography>
          {/* 複数画像対応 */}
          {(post.Images && post.Images.length > 0) ? (
            <Box mb={3}>
              {post.Images.length === 1 ? (
                // 画像が1枚の場合
                <img
                  src={post.Images[0]}
                  alt="投稿画像"
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #e1f5fe'
                  }}
                />
              ) : post.Images.length === 2 ? (
                // 画像が2枚の場合
                <Box display="flex" gap={1}>
                  {post.Images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`投稿画像${index + 1}`}
                      style={{
                        width: '50%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        border: '2px solid #e1f5fe'
                      }}
                    />
                  ))}
                </Box>
              ) : (
                // 画像が3枚の場合
                <Box>
                  <Box mb={1}>
                    <img
                      src={post.Images[0]}
                      alt="投稿画像1"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        border: '2px solid #e1f5fe'
                      }}
                    />
                  </Box>
                  <Box display="flex" gap={1}>
                    {post.Images.slice(1).map((image, index) => (
                      <img
                        key={index + 1}
                        src={image}
                        alt={`投稿画像${index + 2}`}
                        style={{
                          width: '50%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '16px',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                          border: '2px solid #e1f5fe'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ) : post.ImageURL ? (
            // 後方互換性のため、ImageURLがある場合は表示
            <Box mb={3}>
              <img
                src={post.ImageURL}
                alt="投稿画像"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #e1f5fe'
                }}
              />
            </Box>
          ) : null}
          <Box display="flex" justifyContent="space-between" maxWidth={400}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="medium"
                onClick={handleComment}
                sx={{
                  color: '#29b6f6',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(41, 182, 246, 0.1)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(41, 182, 246, 0.3)'
                  }
                }}
              >
                <ChatBubbleOutline />
              </IconButton>
              <Typography variant="body2" sx={{ 
                color: isDarkMode ? '#ffffff' : '#546e7a',
                fontWeight: 500
              }}>
                {comments.length}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="medium"
                onClick={handleRetweet}
                sx={{
                  color: retweeted ? '#4caf50' : '#29b6f6',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                  }
                }}
              >
                <Repeat />
              </IconButton>
              <Typography variant="body2" sx={{ 
                color: isDarkMode ? '#ffffff' : '#546e7a',
                fontWeight: 500
              }}>
                {retweetCount}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="medium"
                onClick={handleLike}
                sx={{
                  color: liked ? '#e91e63' : '#29b6f6',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(233, 30, 99, 0.1)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
                  }
                }}
              >
                {liked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <Typography variant="body2" sx={{ 
                color: isDarkMode ? '#ffffff' : '#546e7a',
                fontWeight: 500
              }}>
                {likeCount}
              </Typography>
            </Box>
            <IconButton 
              size="medium"
              onClick={handleShare}
              sx={{
                color: '#ff9800',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                }
              }}
            >
              <Share />
            </IconButton>
          </Box>

          {/* コメント入力フィールドとコメント一覧 */}
          <Collapse in={showComments}>
            <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${isDarkMode ? '#29b6f6' : '#e1f5fe'}` }}>
              <Box display="flex" gap={2} alignItems="flex-start">
                <Avatar 
                  src={getCurrentUserIcon()}
                  sx={{ 
                    bgcolor: getCurrentUserIcon() ? undefined : 'linear-gradient(45deg, #42a5f5 30%, #29b6f6 90%)',
                    width: 32,
                    height: 32,
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}
                >
                  {!getCurrentUserIcon() && <AccountCircle sx={{ fontSize: '1.2rem' }} />}
                </Avatar>
                <Box flex={1}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="返信を投稿..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    size="small"
                    disabled={isSubmittingComment}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDarkMode ? 'rgba(41, 182, 246, 0.05)' : '#f8f9fa',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: isDarkMode ? '#29b6f6' : '#e1f5fe',
                        },
                        '&:hover fieldset': {
                          borderColor: '#29b6f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#29b6f6',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: isDarkMode ? '#ffffff' : '#37474f',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: isDarkMode ? '#90a4ae' : '#90a4ae',
                        opacity: 1,
                      },
                    }}
                  />
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography variant="caption" sx={{ color: '#90a4ae' }}>
                      Ctrl + Enter で投稿
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || isSubmittingComment}
                      startIcon={<Send />}
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        fontWeight: 600,
                        bgcolor: '#29b6f6',
                        '&:hover': {
                          bgcolor: '#1e88e5',
                        },
                        '&:disabled': {
                          bgcolor: '#90a4ae',
                        },
                      }}
                    >
                      {isSubmittingComment ? '投稿中...' : '返信'}
                    </Button>
                  </Box>
                </Box>
              </Box>
              
              {/* コメント一覧 */}
              {comments.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 3, borderColor: isDarkMode ? '#29b6f6' : '#e1f5fe' }} />
                  {comments.map((comment) => (
                    <Box key={comment.ID} sx={{ mb: 3 }}>
                      <Box display="flex" gap={2}>
                        <Avatar 
                          src={comment.AuthorPicture && comment.AuthorPicture.trim() !== '' ? comment.AuthorPicture : comment.User?.Picture}
                          alt={comment.AuthorName || comment.User?.UserName}
                          sx={{ 
                            bgcolor: 'linear-gradient(45deg, #42a5f5 30%, #29b6f6 90%)',
                            width: 32,
                            height: 32,
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {(comment.AuthorName || comment.User?.UserName || 'U').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="subtitle2" sx={{ 
                              fontWeight: 600,
                              color: '#0277bd',
                              fontSize: '0.9rem'
                            }}>
                              {comment.AuthorName || comment.User?.UserName || 'ユーザー'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#90a4ae' }}>
                              ·
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#90a4ae' }}>
                              {formatCommentTimestamp(comment.CreatedAt)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ 
                            lineHeight: 1.5,
                            color: isDarkMode ? '#ffffff' : '#37474f'
                          }}>
                            {comment.Content}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
};

export default PostCard;
