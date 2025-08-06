import React from 'react';
import { Modal, Paper, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PostForm } from '../post';

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onPost: (content: string, images?: File[], isSensitive?: boolean) => Promise<void>;
  currentUser: any;
}

const PostModal: React.FC<PostModalProps> = ({
  open,
  onClose,
  isDarkMode,
  onPost,
  currentUser
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
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
            onClick={onClose}
            sx={{
              color: isDarkMode ? 'white' : 'black',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 0 }}>
          <PostForm onPost={onPost} currentUser={currentUser} />
        </Box>
      </Paper>
    </Modal>
  );
};

export default PostModal;
