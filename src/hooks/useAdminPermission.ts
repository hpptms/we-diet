import { useState, useEffect } from 'react';

interface UserInfo {
    id: number;
    user_name: string;
    permission: number;
}

export const useAdminPermission = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userPermission, setUserPermission] = useState<number | null>(null);

    const checkAdminPermission = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}user/${userId}`);

            if (!response.ok) {
                console.error('Failed to fetch user info:', response.status);
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            const userInfo: UserInfo = await response.json();

            // Permission が 555 の場合は管理者
            const adminPermission = userInfo.permission === 555;
            setIsAdmin(adminPermission);
            setUserPermission(userInfo.permission);

            console.log('User permission check:', {
                userId: userInfo.id,
                userName: userInfo.user_name,
                permission: userInfo.permission,
                isAdmin: adminPermission
            });

        } catch (error) {
            console.error('Error checking admin permission:', error);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAdminPermission();
    }, []);

    return {
        isAdmin,
        loading,
        userPermission,
        refetch: checkAdminPermission
    };
};
