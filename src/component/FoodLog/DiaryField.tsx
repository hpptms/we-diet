import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface DiaryFieldProps {
    diary: string;
    onChange: (value: string) => void;
}

const DiaryField: React.FC<DiaryFieldProps> = ({ diary, onChange }) => {
    const maxLength = 300;
    
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                📝 日記
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    ({diary.length}/{maxLength}文字)
                </Typography>
            </Typography>
            <TextField
                multiline
                rows={4}
                fullWidth
                value={diary}
                onChange={(e) => onChange(e.target.value)}
                placeholder="今日の食事について記録しましょう..."
                inputProps={{ maxLength }}
                variant="outlined"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'background.paper',
                    }
                }}
            />
        </Box>
    );
};

export default DiaryField;
