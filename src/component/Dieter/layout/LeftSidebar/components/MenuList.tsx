import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../../../recoil/darkModeAtom';
import { MenuItem } from '../types';

interface MenuListProps {
    leftMenuItems: MenuItem[];
    additionalMenuItems: MenuItem[];
    unreadNotificationCount: number;
    unreadMessageCount?: number;
}

const MenuList: React.FC<MenuListProps> = ({
    leftMenuItems,
    additionalMenuItems,
    unreadNotificationCount,
    unreadMessageCount = 0
}) => {
    const isDarkMode = useRecoilValue(darkModeState);

    return (
        <List sx={{ p: 0 }}>
            {leftMenuItems.map((item, index) => (
                <ListItem
                    key={`left-menu-${index}`}
                    button
                    onClick={item.onClick}
                    sx={{
                        borderRadius: 3,
                        mb: 1,
                        px: 2,
                        py: 1.5,
                        backgroundColor: item.active ? 'rgba(41, 182, 246, 0.15)' : 'transparent',
                        border: item.active ? '2px solid #29b6f6' : '2px solid transparent',
                        transition: 'all 0.3s ease',
                        cursor: item.onClick ? 'pointer' : 'default',
                        '&:hover': { 
                            backgroundColor: 'rgba(41, 182, 246, 0.1)',
                            transform: item.onClick ? 'translateX(6px)' : 'none',
                            boxShadow: item.onClick ? '0 3px 8px rgba(41, 182, 246, 0.3)' : 'none'
                        },
                    }}
                >
                    <ListItemIcon sx={{ 
                        color: item.active ? '#0288d1' : '#757575',
                        minWidth: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {item.label}
                                {/* 通知数をバッジとして表示 */}
                                {item.label === '通知' && unreadNotificationCount > 0 && (
                                    <Box
                                        sx={{
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            borderRadius: '50%',
                                            minWidth: '20px',
                                            height: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                                    </Box>
                                )}
                            </Box>
                        }
                        sx={{ 
                            color: item.active ? '#0288d1' : (isDarkMode ? '#ffffff' : '#424242'),
                            '& .MuiTypography-root': {
                                fontWeight: item.active ? 600 : 400,
                                fontSize: '1rem'
                            }
                        }}
                    />
                </ListItem>
            ))}
            
            {/* 新しく追加するメニューアイテム */}
            {additionalMenuItems.map((item, index) => (
                <ListItem
                    key={`additional-${index}`}
                    button
                    onClick={item.onClick}
                    sx={{
                        borderRadius: 3,
                        mb: 1,
                        px: 2,
                        py: 1.5,
                        backgroundColor: item.active ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
                        border: item.active ? '2px solid #4CAF50' : '2px solid transparent',
                        transition: 'all 0.3s ease',
                        cursor: item.onClick ? 'pointer' : 'default',
                        '&:hover': { 
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            transform: item.onClick ? 'translateX(6px)' : 'none',
                            boxShadow: item.onClick ? '0 3px 8px rgba(76, 175, 80, 0.3)' : 'none'
                        },
                    }}
                >
                    <ListItemIcon sx={{ 
                        color: item.active ? '#4CAF50' : '#757575',
                        minWidth: '36px'
                    }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        sx={{ 
                            color: item.active ? '#4CAF50' : (isDarkMode ? '#ffffff' : '#424242'),
                            '& .MuiTypography-root': {
                                fontWeight: item.active ? 600 : 400,
                                fontSize: '1rem'
                            }
                        }}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default MenuList;
