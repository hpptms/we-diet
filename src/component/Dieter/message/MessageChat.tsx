import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { serverProfileState } from '../../../recoil/profileSettingsAtom';
import { postsApi, Message } from '../../../api/postsApi';

interface MessageChatProps {
  userId: number;
  userName: string;
  userPicture: string;
  onBack: () => void;
}

const MessageChat: React.FC<MessageChatProps> = ({ userId, userName, userPicture, onBack }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const serverProfile = useRecoilValue(serverProfileState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await postsApi.getMessages(userId);
        setMessages(response.messages);
      } catch (error) {
        console.error('メッセージの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const message = await postsApi.sendMessage({
        receiver_id: userId,
        content: newMessage.trim(),
      });

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('メッセージの送信に失敗しました:', error);
      alert('メッセージの送信に失敗しました。もう一度お試しください。');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isMyMessage = (message: Message) => {
    return message.SenderID === serverProfile.userId;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderBottom: `1px solid ${isDarkMode ? '#333' : '#eee'}`,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={onBack}
            sx={{ 
              mr: 2,
              color: isDarkMode ? '#ffffff' : '#000000'
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            src={userPicture}
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              bgcolor: isDarkMode ? '#bb86fc' : '#42a5f5',
            }}
          >
            {userName.charAt(0)}
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? '#ffffff' : '#000000',
              fontWeight: 'bold',
            }}
          >
            {userName}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* メッセージリスト */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          backgroundColor: isDarkMode ? '#000000' : '#fafafa',
        }}
      >
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <CircularProgress size={40} sx={{ color: '#29b6f6' }} />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <Typography
              variant="body1"
              sx={{
                color: isDarkMode ? '#ffffff' : '#666666',
                textAlign: 'center'
              }}
            >
              まだメッセージはありません。<br />
              最初のメッセージを送信してみましょう！
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message) => (
              <Box
                key={message.ID}
                sx={{
                  display: 'flex',
                  justifyContent: isMyMessage(message) ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isMyMessage(message) ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    maxWidth: '70%',
                  }}
                >
                  <Avatar
                    src={isMyMessage(message) ? (serverProfile.profile?.uploaded_icon || undefined) : userPicture}
                    sx={{
                      width: 32,
                      height: 32,
                      mx: 1,
                      bgcolor: isDarkMode ? '#bb86fc' : '#42a5f5',
                    }}
                  >
                    {isMyMessage(message) 
                      ? (serverProfile.profile?.display_name || 'あなた').charAt(0)
                      : userName.charAt(0)
                    }
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor: isMyMessage(message)
                        ? (isDarkMode ? '#bb86fc' : '#42a5f5')
                        : (isDarkMode ? '#333333' : '#ffffff'),
                      color: isMyMessage(message)
                        ? '#ffffff'
                        : (isDarkMode ? '#ffffff' : '#000000'),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      {message.Content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isMyMessage(message)
                          ? 'rgba(255, 255, 255, 0.7)'
                          : (isDarkMode ? '#aaaaaa' : '#666666'),
                        fontSize: '0.75rem',
                      }}
                    >
                      {formatTime(message.CreatedAt)}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* メッセージ入力欄 */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderTop: `1px solid ${isDarkMode ? '#333' : '#eee'}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力..."
            variant="outlined"
            disabled={sending}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? '#333333' : '#f5f5f5',
                color: isDarkMode ? '#ffffff' : '#000000',
                '& fieldset': {
                  borderColor: isDarkMode ? '#555555' : '#cccccc',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? '#bb86fc' : '#42a5f5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? '#bb86fc' : '#42a5f5',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: isDarkMode ? '#aaaaaa' : '#999999',
              },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            sx={{
              backgroundColor: isDarkMode ? '#bb86fc' : '#42a5f5',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: isDarkMode ? '#9c4dcc' : '#1e88e5',
              },
              '&:disabled': {
                backgroundColor: isDarkMode ? '#333333' : '#cccccc',
                color: isDarkMode ? '#666666' : '#999999',
              },
            }}
          >
            {sending ? (
              <CircularProgress size={24} sx={{ color: 'inherit' }} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default MessageChat;
