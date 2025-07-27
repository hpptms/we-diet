import { useState, useEffect } from 'react';

export interface ScreenInfo {
    width: number;
    height: number;
    aspectRatio: number;
    isPortrait: boolean;
    isLandscape: boolean;
    isPortraitDesktop: boolean; // 1080×1920のような縦画面大型ディスプレイ
    isLandscapeDesktop: boolean; // 1920×1080のような横画面大型ディスプレイ
}

export const useScreenOrientation = (): ScreenInfo => {
    const [screenInfo, setScreenInfo] = useState<ScreenInfo>(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspectRatio = width / height;

        return {
            width,
            height,
            aspectRatio,
            isPortrait: aspectRatio < 1,
            isLandscape: aspectRatio >= 1,
            isPortraitDesktop: aspectRatio < 0.7 && width >= 1080,
            isLandscapeDesktop: aspectRatio > 1.5 && width >= 1920,
        };
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspectRatio = width / height;

            setScreenInfo({
                width,
                height,
                aspectRatio,
                isPortrait: aspectRatio < 1,
                isLandscape: aspectRatio >= 1,
                isPortraitDesktop: aspectRatio < 0.7 && width >= 1080,
                isLandscapeDesktop: aspectRatio > 1.5 && width >= 1920,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenInfo;
};
