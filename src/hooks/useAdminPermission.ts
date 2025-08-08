import { useState, useEffect } from 'react';
import axios from 'axios';

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

            // axios + protobuf APIを使用
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/proto/user/${userId}`,
                {
                    headers: {
                        'Content-Type': 'application/x-protobuf',
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.status === 200 && response.data) {
                const userInfo: UserInfo = response.data;

                // Permission が 555 の場合は管理者
                const adminPermission = userInfo.permission === 555;
                setIsAdmin(adminPermission);
                setUserPermission(userInfo.permission);

                console.log('User permission check (protobuf):', {
                    userId: userInfo.id,
                    userName: userInfo.user_name,
                    permission: userInfo.permission,
                    isAdmin: adminPermission
                });
            } else {
                console.error('Invalid response from user API:', response.status);
                setIsAdmin(false);
            }

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
