import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { OpenInNew, PlayArrow } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { LinkPreview as LinkPreviewType } from '../../../utils/linkPreview';

interface LinkPreviewProps {
    preview: LinkPreviewType;
    onLinkClick?: (url: string) => void;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ preview, onLinkClick }) => {
    const isDarkMode = useRecoilValue(darkModeState);

    const handleClick = () => {
        onLinkClick?.(preview.url) || window.open(preview.url, '_blank', 'noopener,noreferrer');
    };

    const getIconForType = () => {
        switch (preview.type) {
            case 'youtube':
            case 'tiktok':
                return <PlayArrow sx={{ color: '#ff4444', fontSize: '2rem' }} />;
            default:
                return <OpenInNew sx={{ color: '#29b6f6', fontSize: '1.2rem' }} />;
        }
    };

    const getAccentColor = () => {
        switch (preview.type) {
            case 'youtube':
                return '#ff0000';
            case 'tiktok':
                return '#000000';
            case 'twitter':
                return '#1da1f2';
            case 'instagram':
                return '#e4405f';
            default:
                return '#29b6f6';
        }
    };

    return (
        <Box
            onClick={handleClick}
            sx={{
                border: `2px solid ${getAccentColor()}`,
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                maxWidth: '100%',
                width: '100%',
                boxSizing: 'border-box',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${getAccentColor()}33`,
                    borderColor: getAccentColor(),
                }
            }}
        >
            {/* 画像部分 */}
            {preview.image && (
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '100%',
                        height: 200,
                        backgroundImage: `url(${preview.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    {/* 再生ボタンオーバーレイ */}
                    {(preview.type === 'youtube' || preview.type === 'tiktok') && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '50%',
                                    width: 60,
                                    height: 60,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                {getIconForType()}
                            </Box>
                        </Box>
                    )}
                </Box>
            )}

            {/* コンテンツ部分 */}
            <Box sx={{ 
                p: 2,
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 2,
                    maxWidth: '100%',
                    overflow: 'hidden'
                }}>
                    <Box sx={{ 
                        flex: 1,
                        minWidth: 0,
                        maxWidth: '100%',
                        overflow: 'hidden'
                    }}>
                        {/* サイト名 */}
                        {preview.siteName && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: getAccentColor(),
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100%',
                                    display: 'block'
                                }}
                            >
                                {preview.siteName}
                            </Typography>
                        )}

                        {/* タイトル */}
                        {preview.title && (
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    color: isDarkMode ? '#ffffff' : '#333333',
                                    mb: 0.5,
                                    lineHeight: 1.3,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    maxWidth: '100%',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {preview.title}
                            </Typography>
                        )}

                        {/* 説明 */}
                        {preview.description && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isDarkMode ? '#cccccc' : '#666666',
                                    lineHeight: 1.4,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {preview.description}
                            </Typography>
                        )}

                        {/* URL表示 */}
                        <Typography
                            variant="caption"
                            sx={{
                                color: isDarkMode ? '#999999' : '#999999',
                                mt: 1,
                                display: 'block',
                                wordBreak: 'break-all',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%'
                            }}
                        >
                            {new URL(preview.url).hostname}
                        </Typography>
                    </Box>

                    {/* 右上のアイコン */}
                    <IconButton
                        size="small"
                        sx={{
                            color: getAccentColor(),
                            '&:hover': {
                                backgroundColor: `${getAccentColor()}15`
                            }
                        }}
                    >
                        {getIconForType()}
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default LinkPreview;
