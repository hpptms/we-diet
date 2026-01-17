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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Repeat,
  Send,
  AccountCircle,
  MoreVert,
  Flag,
  Delete,
  PersonAdd,
  PersonRemove,
  Block,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { Post, Comment } from '../types';
import { postsApi, UserProfile } from '../../../api/postsApi';
import { blockUser, checkBlockStatus } from '../../../api/blockApi';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { profileSettingsState, serverProfileState } from '../../../recoil/profileSettingsAtom';
import { DEFAULT_IMAGES } from '../../../image/DefaultImage';
import UserProfileModal from '../profile/UserProfileModal';
import { useFollowContextOptional } from '../../../context/FollowContext';
import ImageLightbox from './ImageLightbox';
import LinkPreview from './LinkPreview';
import MediaPlayer from './MediaPlayer';
import { formatRelativeTime } from '../../../utils/timeFormat';
import { useLinkPreview } from '../../../hooks/useLinkPreview';

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
  onPostDelete?: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostDelete }) => {
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlockLoading, setIsBlockLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [clickPosition, setClickPosition] = useState<{x: number, y: number} | null>(null);
  
  // フォローコンテキストを取得（オプション）
  const followContext = useFollowContextOptional();

  // リンクプレビューとメディア埋め込みをフックで管理
  const { linkPreviews, mediaEmbeds } = useLinkPreview(post.Content);

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReport = async () => {
    try {
      const result = await postsApi.reportPost(post.ID);
      console.log('投稿を報告しました:', result);
      
      // 投稿が非表示になった場合、親コンポーネントに通知
      if (result.is_hide && onPostDelete) {
        onPostDelete(post.ID);
      }
      
      // ユーザーに結果を通知
      alert(result.message);
      
    } catch (error) {
      console.error('投稿の報告に失敗しました:', error);
      alert('投稿の報告に失敗しました。もう一度お試しください。');
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await postsApi.hidePost(post.ID);
      if (onPostDelete) {
        onPostDelete(post.ID);
      }
      setDeleteDialogOpen(false);
      console.log('投稿を非表示にしました:', post.ID);
    } catch (error) {
      console.error('投稿の非表示に失敗しました:', error);
      alert('投稿の非表示に失敗しました。もう一度お試しください。');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // アバタークリック処理
  const handleAvatarClick = async () => {
    if (isLoadingProfile) return;
    
    try {
      setIsLoadingProfile(true);
      const profile = await postsApi.getUserProfile(post.UserID);
      setUserProfile(profile);
      setProfileModalOpen(true);
    } catch (error) {
      console.error('プロフィール取得に失敗しました:', error);
      alert('プロフィールの取得に失敗しました。');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // プロフィールモーダルを閉じる処理
  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
    setUserProfile(null);
  };

  // 現在のユーザーの投稿かどうかを判定
  const isOwnPost = serverProfile.userId === post.UserID;

  // フォロー状態とブロック状態を確認
  React.useEffect(() => {
    const checkFollowStatus = async () => {
      if (!isOwnPost && post.UserID) {
        try {
          const status = await postsApi.getFollowStatus(post.UserID);
          setIsFollowing(status.is_following);
        } catch (error) {
          console.error('フォロー状態の取得に失敗しました:', error);
        }
      }
    };

    const checkBlockStatusAsync = async () => {
      if (!isOwnPost && post.UserID) {
        try {
          const blocked = await checkBlockStatus(post.UserID);
          setIsBlocked(blocked);
        } catch (error) {
          console.error('ブロック状態の取得に失敗しました:', error);
        }
      }
    };

    checkFollowStatus();
    checkBlockStatusAsync();
  }, [post.UserID, isOwnPost]);

  // フォロー/アンフォロー処理
  const handleFollow = async () => {
    if (isFollowLoading || isOwnPost) return;

    try {
      setIsFollowLoading(true);
      console.log('フォロー操作開始 - UserID:', post.UserID, 'Current User:', serverProfile.userId);
      const result = await postsApi.toggleFollow(post.UserID);
      setIsFollowing(result.following);
      
      // 成功メッセージをコンソールに表示（アラートは削除）
      console.log('✅ フォロー操作成功:', result.message);
      
      // フォロー操作後、即座にフォロー数を更新（リトライ処理を簡素化）
      if (followContext) {
        try {
          // 0.5秒待機してからフォロー数を更新
          await new Promise(resolve => setTimeout(resolve, 500));
          await followContext.refreshFollowCounts();
          console.log('PostCard: フォロー数を更新しました');
          
          // 追加で1秒後にもう一度更新（確実性のため）
          setTimeout(async () => {
            try {
              await followContext.refreshFollowCounts();
              console.log('PostCard: フォロー数を再更新しました');
            } catch (error) {
              console.error('PostCard: フォロー数の再更新に失敗:', error);
            }
          }, 1000);
        } catch (error) {
          console.error('PostCard: フォロー数の更新に失敗しました:', error);
        }
      }
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
    } finally {
      setIsFollowLoading(false);
      handleMenuClose();
    }
  };

  // ブロック処理
  const handleBlock = async () => {
    if (isBlockLoading || isOwnPost) return;

    try {
      setIsBlockLoading(true);
      await blockUser(post.UserID);
      setIsBlocked(true);
      alert('ユーザーをブロックしました');
      
      // 投稿を非表示にする（親コンポーネントに通知）
      if (onPostDelete) {
        onPostDelete(post.ID);
      }
    } catch (error: any) {
      console.error('ブロックに失敗しました:', error);
      const errorMessage = error.message || 'ブロックに失敗しました。もう一度お試しください。';
      alert(`エラー: ${errorMessage}`);
    } finally {
      setIsBlockLoading(false);
      handleMenuClose();
    }
  };

  // 画像ライトボックス関連の関数
  const handleImageClick = (index: number, event?: React.MouseEvent) => {
    if (event) {
      setClickPosition({ x: event.clientX, y: event.clientY });
    }
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleLightboxNext = () => {
    const allImages = post.Images && post.Images.length > 0 ? post.Images : (post.ImageURL ? [post.ImageURL] : []);
    if (allImages.length > 0) {
      setLightboxImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const handleLightboxPrevious = () => {
    const allImages = post.Images && post.Images.length > 0 ? post.Images : (post.ImageURL ? [post.ImageURL] : []);
    if (allImages.length > 0) {
      setLightboxImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  // 表示用の画像配列を取得
  const getDisplayImages = () => {
    if (post.Images && post.Images.length > 0) {
      return post.Images;
    }
    if (post.ImageURL) {
      return [post.ImageURL];
    }
    return [];
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
      {/* リツイート情報の表示 */}
      {post.IsRetweet && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 2,
          color: isDarkMode ? '#81c784' : '#4caf50'
        }}>
          <Repeat sx={{ fontSize: '1rem' }} />
          <Typography variant="body2" sx={{ 
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            {post.RetweetUserName || 'ユーザー'}がリツイート
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#90a4ae',
            fontSize: '0.8rem'
          }}>
            · {post.RetweetedAt ? formatRelativeTime(post.RetweetedAt) : ''}
          </Typography>
        </Box>
      )}
      <Box display="flex" gap={3}>
        <Avatar 
          src={post.AuthorPicture && post.AuthorPicture.trim() !== '' ? post.AuthorPicture : undefined}
          alt={post.AuthorName || 'ユーザー'}
          onClick={handleAvatarClick}
          slotProps={{
            img: {
              onError: () => {
                // Avatar画像の読み込みに失敗した場合、フォールバックを表示
              }
            }
          }}
          sx={{ 
            bgcolor: 'linear-gradient(45deg, #42a5f5 30%, #29b6f6 90%)',
            width: 48,
            height: 48,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            boxShadow: '0 3px 10px rgba(66, 165, 245, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 20px rgba(66, 165, 245, 0.4)',
            }
          }}
        >
          {post.AuthorName ? post.AuthorName.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        <Box flex={1} sx={{ 
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
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
              {formatRelativeTime(post.CreatedAt)}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ 
            mb: 3, 
            lineHeight: 1.6,
            fontSize: '1.1rem',
            color: isDarkMode ? '#ffffff' : '#37474f',
            maxWidth: '100%',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            overflow: 'hidden'
          }}>
            {post.Content}
          </Typography>

          {/* メディアプレイヤー */}
          {mediaEmbeds.map((media, index) => (
            <MediaPlayer
              key={`media-${post.ID}-${index}`}
              media={media}
            />
          ))}

          {/* リンクプレビュー */}
          {linkPreviews.map((item, index) => (
            <Box key={`link-${post.ID}-${index}`} sx={{ 
              mb: 2,
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
              <LinkPreview preview={item.preview} />
            </Box>
          ))}
          {/* 複数画像対応 */}
          {(post.Images && post.Images.length > 0) ? (
            <Box mb={3}>
              {post.Images.length === 1 ? (
                // 画像が1枚の場合
                <img
                  src={post.Images[0]}
                  alt="投稿画像"
                  onClick={(e) => handleImageClick(0, e)}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #e1f5fe',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                  }}
                />
              ) : post.Images.length === 2 ? (
                // 画像が2枚の場合
                <Box display="flex" gap={1}>
                  {post.Images.map((image, index) => (
                    <img
                      key={`post-${post.ID}-${post.CreatedAt}-image-2-${index}`}
                      src={image}
                      alt={`投稿画像${index + 1}`}
                      onClick={(e) => handleImageClick(index, e)}
                      style={{
                        width: '50%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        border: '2px solid #e1f5fe',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                      }}
                    />
                  ))}
                </Box>
              ) : (
                // 画像が3枚の場合
                <Box>
                  <Box mb={1}>
                    <img
                      key={`post-${post.ID}-${post.CreatedAt}-image-3-0`}
                      src={post.Images[0]}
                      alt="投稿画像1"
                      onClick={() => handleImageClick(0)}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        border: '2px solid #e1f5fe',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                      }}
                    />
                  </Box>
                  <Box display="flex" gap={1}>
                    {post.Images.slice(1).map((image, index) => (
                      <img
                        key={`post-${post.ID}-${post.CreatedAt}-image-3-${index + 1}`}
                        src={image}
                        alt={`投稿画像${index + 2}`}
                        onClick={(e) => handleImageClick(index + 1, e)}
                        style={{
                          width: '50%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '16px',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                          border: '2px solid #e1f5fe',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
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
                onClick={() => handleImageClick(0)}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #e1f5fe',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
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
              onClick={handleMenuClick}
              sx={{
                color: '#757575',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(117, 117, 117, 0.1)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px rgba(117, 117, 117, 0.3)'
                }
              }}
            >
              <MoreVert />
            </IconButton>

            {/* 多機能メニュー */}
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
                    color: isDarkMode ? 'white' : 'black',
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    border: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
                    minWidth: 200,
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {isOwnPost ? (
                <MenuItem onClick={handleDelete}>
                  <ListItemIcon>
                    <Delete fontSize="small" sx={{ color: '#f44336' }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: '#f44336' }}>削除</ListItemText>
                </MenuItem>
              ) : (
                <>
                  <MenuItem onClick={handleFollow} disabled={isFollowLoading}>
                    <ListItemIcon>
                      {isFollowing ? (
                        <PersonRemove fontSize="small" sx={{ color: '#ff9800' }} />
                      ) : (
                        <PersonAdd fontSize="small" sx={{ color: '#4caf50' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText sx={{ 
                      color: isFollowing ? '#ff9800' : '#4caf50',
                      opacity: isFollowLoading ? 0.5 : 1
                    }}>
                      {isFollowLoading ? '処理中...' : (isFollowing ? 'フォロー解除' : 'フォローする')}
                    </ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleBlock} disabled={isBlockLoading || isBlocked}>
                    <ListItemIcon>
                      <Block fontSize="small" sx={{ color: '#f44336' }} />
                    </ListItemIcon>
                    <ListItemText sx={{ 
                      color: '#f44336',
                      opacity: isBlockLoading ? 0.5 : 1
                    }}>
                      {isBlockLoading ? '処理中...' : (isBlocked ? 'ブロック済み' : 'NGに追加する')}
                    </ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleReport}>
                    <ListItemIcon>
                      <Flag fontSize="small" sx={{ color: '#f44336' }} />
                    </ListItemIcon>
                    <ListItemText sx={{ color: '#f44336' }}>報告</ListItemText>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* 削除確認ダイアログ */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            PaperProps={{
              sx: {
                backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
                color: isDarkMode ? 'white' : 'black',
                borderRadius: 2,
              }
            }}
          >
            <DialogTitle sx={{ fontWeight: 600 }}>
              投稿を削除しますか？
            </DialogTitle>
            <DialogContent>
              <Typography>
                この操作は取り消すことができません。本当に削除しますか？
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                onClick={handleDeleteCancel}
                variant="outlined"
                sx={{
                  borderColor: isDarkMode ? '#666' : '#ccc',
                  color: isDarkMode ? 'white' : 'black',
                  '&:hover': {
                    borderColor: isDarkMode ? '#888' : '#999',
                  }
                }}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="contained"
                color="error"
                sx={{
                  bgcolor: '#f44336',
                  '&:hover': {
                    bgcolor: '#d32f2f',
                  }
                }}
              >
                削除
              </Button>
            </DialogActions>
          </Dialog>

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
                    onKeyDown={handleKeyDown}
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
                              {formatRelativeTime(comment.CreatedAt, true)}
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

      {/* プロフィールモーダル */}
      <UserProfileModal
        open={profileModalOpen}
        onClose={handleProfileModalClose}
        profile={userProfile}
      />

      {/* 画像ライトボックス */}
      <ImageLightbox
        open={lightboxOpen}
        onClose={handleLightboxClose}
        images={getDisplayImages()}
        currentIndex={lightboxImageIndex}
        onNext={handleLightboxNext}
        onPrevious={handleLightboxPrevious}
        clickPosition={clickPosition}
      />
    </Box>
  );
};

export default React.memo(PostCard);
