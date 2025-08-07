import { useState } from 'react';

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

/**
 * ダッシュボードのビュー切り替えアニメーション機能を管理するカスタムフック
 */
export const useDashboardAnimation = (initialView: CurrentView = 'dashboard') => {
    const [currentView, setCurrentView] = useState<CurrentView>(initialView);
    const [previousView, setPreviousView] = useState<CurrentView>('dashboard');
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationDirection, setAnimationDirection] = useState<'slideIn' | 'slideOut'>('slideIn');

    // アニメーション時間を取得する関数
    const getAnimationDuration = (view: CurrentView, direction: 'slideIn' | 'slideOut') => {
        if (direction === 'slideIn') {
            return 800; // 全ての機能を2段階スライドで統一（800ms）
        }
        if (direction === 'slideOut') {
            return 500; // すべての戻りを円形展開で統一（500ms）
        }
        return 800; // デフォルトも統一
    };

    const getAnimationClass = () => {
        if (!isAnimating) return '';

        if (animationDirection === 'slideIn') {
            return 'slide-pause-complete';
        } else {
            return 'circle-expand';
        }
    };

    // アニメーションスタイルを生成
    const getAnimationStyles = () => ({
        width: '100%',
        height: '100%',
        position: 'relative' as const,
        // 統一された2段階スライドアニメーション（全機能共通）
        '&.slide-pause-complete': {
            animation: 'slidePauseComplete 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            transform: 'translateX(100%)',
            opacity: 0.8
        },

        // ダッシュボード戻り用の円形展開
        '&.circle-expand': {
            animation: 'circleExpand 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
        },

        // 使用するキーフレーム定義のみ保持
        '@keyframes slidePauseComplete': {
            '0%': {
                transform: 'translateX(100%)',
                opacity: 0.8,
                visibility: 'visible'
            },
            '40%': {
                transform: 'translateX(0)',
                opacity: 1,
                visibility: 'visible'
            },
            '60%': {
                transform: 'translateX(0)',
                opacity: 1,
                visibility: 'visible'
            },
            '100%': {
                transform: 'translateX(0)',
                opacity: 1,
                visibility: 'visible'
            }
        },
        '@keyframes circleExpand': {
            '0%': {
                clipPath: 'circle(0% at 50% 50%)',
                opacity: 0.8,
                transform: 'scale(1.1)'
            },
            '20%': {
                clipPath: 'circle(20% at 50% 50%)',
                opacity: 0.9,
                transform: 'scale(1.05)'
            },
            '50%': {
                clipPath: 'circle(50% at 50% 50%)',
                opacity: 0.95,
                transform: 'scale(1.02)'
            },
            '80%': {
                clipPath: 'circle(80% at 50% 50%)',
                opacity: 0.98,
                transform: 'scale(1.01)'
            },
            '100%': {
                clipPath: 'circle(100% at 50% 50%)',
                opacity: 1,
                transform: 'scale(1)'
            }
        }
    });

    return {
        currentView,
        previousView,
        isAnimating,
        animationDirection,
        setCurrentView,
        setPreviousView,
        setIsAnimating,
        setAnimationDirection,
        getAnimationDuration,
        getAnimationClass,
        getAnimationStyles,
    };
};
