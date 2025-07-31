import React from 'react';
import { Paper, FormControlLabel, Checkbox, Box, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

interface PublicToggleProps {
    isPublic: boolean;
    onChange: (isPublic: boolean) => void;
    label?: string;
    isDarkMode?: boolean;
}

const PublicToggle: React.FC<PublicToggleProps> = ({ 
    isPublic, 
    onChange, 
    label = 'dieterに投稿',
    isDarkMode = false
}) => {
    return (
        <Paper elevation={2} sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 2,
            background: isDarkMode ? '#000000' : 'white',
            border: isDarkMode ? '1px solid white' : 'none'
        }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isPublic}
                        onChange={(e) => onChange(e.target.checked)}
                        color="primary"
                        sx={{
                            color: isDarkMode ? 'white' : 'inherit',
                            '&.Mui-checked': {
                                color: isDarkMode ? 'white' : '#1976d2',
                            },
                        }}
                    />
                }
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupIcon sx={{ color: isDarkMode ? 'white' : 'inherit' }} />
                        <Typography sx={{ color: isDarkMode ? 'white' : 'inherit' }}>{label}</Typography>
                    </Box>
                }
            />
        </Paper>
    );
};

export default PublicToggle;
