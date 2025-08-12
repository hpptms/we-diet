import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { PlayArrow, Pause, VolumeOff, VolumeUp, Fullscreen } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { MediaEmbed } from '../../../utils/linkPreview';

interface MediaPlayerProps {
    media: MediaEmbed;
    autoPlay?: boolean;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ media, autoPlay = false }) => {
    const isDarkMode = useRecoilValue(darkModeState);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(true); // デフォルトでミュート

    const handlePlayToggle = () => {
        setIsPlaying(!isPlaying);
    };

    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
    };

    const handleFullscreen = () => {
        // 元のURLを新しいタブで開く
        window.open(media.url, '_blank', 'noopener,noreferrer');
    };

    const renderYouTubePlayer = () => {
        const embedUrl = `https://www.youtube.com/embed/${media.embedId}?${new URLSearchParams({
            autoplay: isPlaying ? '1' : '0',
            mute: isMuted ? '1' : '0',
            rel: '0',
            modestbranding: '1',
            controls: '1'
        })}`;

        return (
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: 250,
                    backgroundColor: '#000000',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '2px solid #ff0000'
                }}
            >
                <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: 'inherit' }}
                />
                
                {/* カスタムコントロール */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={handlePlayToggle}
                        sx={{ color: 'white' }}
                    >
                        {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    
                    <IconButton
                        size="small"
                        onClick={handleMuteToggle}
                        sx={{ color: 'white' }}
                    >
                        {isMuted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>

                    <Box sx={{ flex: 1 }} />

                    <Typography
                        variant="caption"
                        sx={{ color: 'white', mr: 1 }}
                    >
                        YouTube
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={handleFullscreen}
                        sx={{ color: 'white' }}
                    >
                        <Fullscreen />
                    </IconButton>
                </Box>
            </Box>
        );
    };

    const renderTikTokPlayer = () => {
        return (
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: 400,
                    backgroundColor: '#000000',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '2px solid #000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* TikTok埋め込み（簡易版） */}
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'linear-gradient(45deg, #ff0050, #00f2ea)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={handleFullscreen}
                >
                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        <PlayArrow sx={{ color: '#000000', fontSize: '3rem' }} />
                    </Box>
                    
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        TikTok Video
                    </Typography>
                    
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'white',
                            textAlign: 'center',
                            mt: 1,
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        クリックして視聴
                    </Typography>
                </Box>

                {/* カスタムコントロール */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{ color: 'white', flex: 1 }}
                    >
                        TikTok
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={handleFullscreen}
                        sx={{ color: 'white' }}
                    >
                        <Fullscreen />
                    </IconButton>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ mb: 2 }}>
            {media.type === 'youtube' && renderYouTubePlayer()}
            {media.type === 'tiktok' && renderTikTokPlayer()}
        </Box>
    );
};

export default MediaPlayer;
