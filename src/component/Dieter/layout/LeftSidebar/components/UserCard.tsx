import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FollowCounts } from '../types';

interface UserCardProps {
    getIconSrc: () => string | undefined;
    getDisplayName: () => string;
    getUserId: () => string;
    followCounts: FollowCounts;
    onNavigateToFollowManagement?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
    getIconSrc,
    getDisplayName,
    getUserId,
    followCounts,
    onNavigateToFollowManagement
}) => {
    const navigate = useNavigate();

    return (
        <Card sx={{ 
            mt: 2,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)'
            }
        }}>
            <CardContent sx={{ 
                p: 2,
                '&:last-child': { pb: 2 }
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <Avatar 
                        src={getIconSrc()}
                        sx={{ 
                            width: 48, 
                            height: 48,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            boxShadow: '0 3px 10px rgba(102, 126, 234, 0.4)',
                            border: '2px solid rgba(255, 255, 255, 0.8)'
                        }}
                    >
                        {!getIconSrc() && <AccountCircle sx={{ fontSize: '1.8rem' }} />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            fontSize: '1rem',
                            mb: 0.3
                        }}>
                            {getDisplayName()}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                            color: '#6c757d',
                            fontSize: '0.8rem'
                        }}>
                            {getUserId()}
                        </Typography>
                        <Box sx={{ 
                            mt: 1,
                            display: 'flex',
                            gap: 1.5
                        }}>
                            <Box 
                                sx={{ 
                                    textAlign: 'center',
                                    cursor: onNavigateToFollowManagement ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease',
                                    borderRadius: 1,
                                    p: 0.5,
                                    '&:hover': onNavigateToFollowManagement ? {
                                        backgroundColor: 'rgba(41, 182, 246, 0.1)',
                                        transform: 'scale(1.05)'
                                    } : {}
                                }}
                                onClick={() => navigate('/Dieter/Follow')}
                            >
                                <Typography variant="caption" sx={{ 
                                    color: '#495057',
                                    fontWeight: 600,
                                    display: 'block',
                                    fontSize: '0.7rem'
                                }}>
                                    フォロー
                                </Typography>
                                <Typography variant="h6" sx={{ 
                                    color: '#29b6f6',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    {followCounts.followingCount}
                                </Typography>
                            </Box>
                            <Box 
                                sx={{ 
                                    textAlign: 'center',
                                    cursor: onNavigateToFollowManagement ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease',
                                    borderRadius: 1,
                                    p: 0.5,
                                    '&:hover': onNavigateToFollowManagement ? {
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                        transform: 'scale(1.05)'
                                    } : {}
                                }}
                                onClick={() => navigate('/Dieter/Follow')}
                            >
                                <Typography variant="caption" sx={{ 
                                    color: '#495057',
                                    fontWeight: 600,
                                    display: 'block',
                                    fontSize: '0.7rem'
                                }}>
                                    フォロワー
                                </Typography>
                                <Typography variant="h6" sx={{ 
                                    color: '#4CAF50',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    {followCounts.followerCount}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;
