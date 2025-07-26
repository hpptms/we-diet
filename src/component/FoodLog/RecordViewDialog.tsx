import React from 'react';
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
    Chip
} from '@mui/material';
import { Close, Public, Lock } from '@mui/icons-material';
import { type FoodLog as FoodLogType } from '../../proto/food_log_pb';

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6">
                        食事記録詳細
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(record.date)}
                    </Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            
            <DialogContent>
                {/* Public/Private Status */}
                <Box sx={{ mb: 2 }}>
                    <Chip
                        icon={record.is_public ? <Public /> : <Lock />}
                        label={record.is_public ? '公開' : '非公開'}
                        color={record.is_public ? 'primary' : 'default'}
                        variant="outlined"
                    />
                </Box>

                {/* Diary Content */}
                {record.diary && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            📝 日記
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                whiteSpace: 'pre-wrap',
                                backgroundColor: 'background.paper',
                                p: 2,
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'divider'
                            }}
                        >
                            {record.diary}
                        </Typography>
                    </Box>
                )}

                {/* Photos */}
                {record.photos && record.photos.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            📸 写真 ({record.photos.length}枚)
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {record.photos.map((photo, index) => (
                                <Card key={index} sx={{ width: 200, height: 150 }}>
                                    <CardMedia
                                        component="img"
                                        image={photo}
                                        alt={`食事写真 ${index + 1}`}
                                        sx={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => window.open(photo, '_blank')}
                                    />
                                </Card>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Record Metadata */}
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                        記録日時: {new Date(record.created_at).toLocaleString('ja-JP')}
                    </Typography>
                    {record.updated_at !== record.created_at && (
                        <Typography variant="body2" color="text.secondary">
                            更新日時: {new Date(record.updated_at).toLocaleString('ja-JP')}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose}>
                    閉じる
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RecordViewDialog;
