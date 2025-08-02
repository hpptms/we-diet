import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { postsApi, ConversationItem } from '../../../api/postsApi';

interface MessageListProps {
  onSelectConversation: (userId: number) => void;
  onConversationsLoaded?: (conversations: ConversationItem[]) => void;
}

const MessageList: React.FC<MessageListProps> = ({ onSelectConversation, onConversationsLoaded }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await postsApi.getMessageConversations();
        setConversations(response.conversations);
        // 親コンポーネントに会話データを渡す
        if (onConversationsLoaded) {
          onConversationsLoaded(response.conversations);
        }
      } catch (error) {
        console.error('会話リストの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [onConversationsLoaded]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}分前`;
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        py: 4 
      }}>
        <CircularProgress size={40} sx={{ color: '#29b6f6' }} />
      </Box>
    );
  }

  if (conversations.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        py: 4 
      }}>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? '#ffffff' : '#666666',
            textAlign: 'center'
          }}
        >
          メッセージはありません
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <List sx={{ p: 0 }}>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.user_id}
            button
            onClick={() => onSelectConversation(conversation.user_id)}
            sx={{
              borderBottom: `1px solid ${isDarkMode ? '#333' : '#eee'}`,
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(187, 134, 252, 0.1)' : 'rgba(66, 165, 245, 0.1)',
              },
            }}
          >
            <ListItemAvatar>
              <Badge
                badgeContent={conversation.unread_count}
                color="error"
                invisible={conversation.unread_count === 0}
              >
                <Avatar
                  src={conversation.user_picture}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: isDarkMode ? '#bb86fc' : '#42a5f5',
                  }}
                >
                  {conversation.user_name.charAt(0)}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: conversation.unread_count > 0 ? 'bold' : 'normal',
                    color: isDarkMode ? '#ffffff' : '#000000',
                  }}
                >
                  {conversation.user_name}
                </Typography>
              }
              secondary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? '#aaaaaa' : '#666666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '70%',
                    }}
                  >
                    {conversation.is_sender ? 'あなた: ' : ''}
                    {conversation.last_message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDarkMode ? '#aaaaaa' : '#999999',
                      fontSize: '0.75rem',
                    }}
                  >
                    {formatTime(conversation.last_message_at)}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MessageList;
