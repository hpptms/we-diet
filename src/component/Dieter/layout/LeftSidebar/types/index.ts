export interface LeftSidebarProps {
    onBack?: () => void;
    onNavigateToProfile?: () => void;
    onNavigateToExercise?: () => void;
    onNavigateToFoodLog?: () => void;
    onNavigateToFollowManagement?: () => void;
    onNavigateToMessages?: () => void;
    onNavigateToNotifications?: () => void;
    onNavigateToHome?: () => void;
    onToggleFollowingPosts?: () => void;
    onOpenPostModal?: () => void;
    showFollowingPosts?: boolean;
    showNotifications?: boolean;
}

export interface MenuItem {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick?: () => void;
    hasNotification?: boolean;
}

export interface FollowCounts {
    followingCount: number;
    followerCount: number;
}
