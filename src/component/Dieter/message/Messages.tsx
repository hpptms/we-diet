import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { postsApi, ConversationItem } from '../../../api/postsApi';
import MessageList from './MessageList';
import MessageChat from './MessageChat';

interface MessagesProps {
  onBack?: () => void;
}

const Messages: React.FC<MessagesProps> = ({ onBack }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const [selectedConversation, setSelectedConversation] = useState<{
    userId: number;
    userName: string;
    userPicture: string;
  } | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  const handleSelectConversation = (userId: number) => {
    // 会話リストから実際のユーザー情報を取得
    const conversation = conversations.find(conv => conv.user_id === userId);
    if (conversation) {
      setSelectedConversation({
        userId: conversation.user_id,
        userName: conversation.user_name,
        userPicture: conversation.user_picture,
      });
    }
  };

  // 会話リストを受け取るためのコールバック
  const handleConversationsLoaded = (loadedConversations: ConversationItem[]) => {
    setConversations(loadedConversations);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  return (
    <Box sx={{ 
      height: '100%',
      backgroundColor: isDarkMode ? '#000000' : 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {selectedConversation ? (
        <MessageChat
          userId={selectedConversation.userId}
          userName={selectedConversation.userName}
          userPicture={selectedConversation.userPicture}
          onBack={handleBackToList}
        />
      ) : (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <MessageList 
            onSelectConversation={handleSelectConversation} 
            onConversationsLoaded={handleConversationsLoaded}
          />
        </Box>
      )}
    </Box>
  );
};

export default Messages;
