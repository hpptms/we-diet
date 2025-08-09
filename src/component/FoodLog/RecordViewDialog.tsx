import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Card,
    CardMedia,
    IconButton,
    Chip,
    Zoom,
    Fade,
    Avatar,
    Paper,
    Grid,
    Divider
} from '@mui/material';
import { 
    Close, 
    Public, 
    Lock, 
    Restaurant, 
    PhotoCamera, 
    Edit, 
    Favorite,
    AccessTime,
    CalendarToday
} from '@mui/icons-material';
import { type FoodLog as FoodLogType } from '../../proto/food_log_pb';
import { useTranslation } from '../../hooks/useTranslation';

interface RecordViewDialogProps {
    open: boolean;
    onClose: () => void;
    record?: FoodLogType;
}

const RecordViewDialog: React.FC<RecordViewDialogProps> = ({
    open,
    onClose,
    record
}) => {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    if (!record) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Dialog 
                open={open} 
                onClose={onClose} 
                maxWidth="md" 
                fullWidth
                TransitionComponent={Zoom}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        overflow: 'hidden'
                    }
                }}
            >
                {/* Header with gradient background */}
                <DialogTitle 
                    sx={{ 
                        position: 'relative',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        p: 3
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                    width: 56,
                                    height: 56,
                                    fontSize: '1.5rem'
                                }}
                            >
                                🍽️
                            </Avatar>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    美味しい記録
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarToday sx={{ fontSize: 16, opacity: 0.8 }} />
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        {formatDate(record.date)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                icon={record.is_public ? <Public /> : <Lock />}
                                label={record.is_public ? '公開中' : 'プライベート'}
                                sx={{
                                    bgcolor: record.is_public 
                                        ? 'rgba(76, 175, 80, 0.8)' 
                                        : 'rgba(158, 158, 158, 0.8)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                            <IconButton 
                                onClick={onClose}
                                sx={{ 
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.2)'
                                    }
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent
                    sx={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(240,240,255,0.95) 100%)',
                        color: 'text.primary',
                        px: 4,
                        py: 1,
                        minHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    {/* Diary Section with beautiful card */}
                    {record.diary && (
                        <Fade in timeout={800}>
                            <Paper
                                elevation={6}
                                sx={{
                                    mt: 2,
                                    mb: 2,
                                    p: 3,
                                    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                                    borderRadius: 3,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #ff6b6b, #ee5a52, #feca57, #48dbfb, #ff9ff3)'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', mr: 2 }}>
                                        <Edit sx={{ color: '#333' }} />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                        今日の記録
                                    </Typography>
                                    <Restaurant sx={{ ml: 'auto', color: '#ff6b6b' }} />
                                </Box>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: 1.8,
                                        color: '#444',
                                        fontSize: '1.1rem',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    "{record.diary}"
                                </Typography>
                            </Paper>
                        </Fade>
                    )}

                    {/* Photos Gallery */}
                    {record.photos && record.photos.length > 0 && (
                        <Fade in timeout={1000}>
                            <Paper
                                elevation={6}
                                sx={{
                                    mt: record.diary ? 0 : 6,
                                    mb: 2,
                                    p: 3,
                                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                    borderRadius: 3
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', mr: 2 }}>
                                        <PhotoCamera sx={{ color: '#333' }} />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                        フォトギャラリー ({record.photos.length}枚)
                                    </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    {record.photos.map((photo, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={`photo-${index}-${photo.slice(-10)}`}>
                                            <Card 
                                                elevation={8}
                                                sx={{ 
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.05) rotate(1deg)',
                                                        boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                                                    },
                                                    '&:hover .expand-button': {
                                                        opacity: 1
                                                    }
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={photo}
                                                    alt={`美味しい料理 ${index + 1}`}
                                                    sx={{ 
                                                        width: '100%', 
                                                        height: 180, 
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <IconButton
                                                    className="expand-button"
                                                    onClick={() => setSelectedPhoto(photo)}
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 8,
                                                        right: 8,
                                                        bgcolor: 'rgba(0,0,0,0.7)',
                                                        color: 'white',
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(0,0,0,0.9)'
                                                        }
                                                    }}
                                                >
                                                    📸
                                                </IconButton>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Fade>
                    )}

                </DialogContent>
                
                <DialogActions
                    sx={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        p: 3,
                        borderTop: '1px solid rgba(0,0,0,0.1)'
                    }}
                >
                    <Button 
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 'bold',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
                            }
                        }}
                    >
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Photo Modal */}
            <Dialog
                open={!!selectedPhoto}
                onClose={() => setSelectedPhoto(null)}
                maxWidth="lg"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        borderRadius: 2
                    }
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    <IconButton
                        onClick={() => setSelectedPhoto(null)}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            zIndex: 1,
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.7)'
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                    {selectedPhoto && (
                        <img
                            src={selectedPhoto}
                            alt="拡大表示"
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '80vh',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RecordViewDialog;
