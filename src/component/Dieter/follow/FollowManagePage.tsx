import React, { useState, useEffect } from 'react';
import { postsApi } from '../../../api/postsApi';
import { getBlockedUsers, unblockUser } from '../../../api/blockApi';

interface User {
  id: number;
  username: string;
  picture?: string;
}

interface BlockedUser {
  id: number;
  username: string;
  picture?: string;
}

interface FollowManagePageProps {
  onClose: () => void;
}

const FollowManagePage: React.FC<FollowManagePageProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'blocked'>('following');
  const [following, setFollowing] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 現在のユーザーIDを取得
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('認証トークンがありません');
      }
      const userId = JSON.parse(atob(token.split('.')[1])).user_id;

      if (activeTab === 'following') {
        const data = await postsApi.getFollowing(userId);
        setFollowing(data.following || []);
      } else if (activeTab === 'followers') {
        const data = await postsApi.getFollowers(userId);
        setFollowers(data.followers || []);
      } else if (activeTab === 'blocked') {
        const data = await getBlockedUsers();
        setBlockedUsers(
          (data || []).map((user: any) => ({
            id: user.id,
            username: user.userName,
            picture: user.picture,
          }))
        );
      }
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId: number) => {
    try {
      await unblockUser(userId);
      // ブロックリストを再取得
      const data = await getBlockedUsers();
      setBlockedUsers(
        (data || []).map((user: any) => ({
          id: user.id,
          username: user.userName,
          picture: user.picture,
        }))
      );
    } catch (error) {
      console.error('ブロック解除に失敗しました:', error);
    }
  };

  const renderUserList = (users: User[] | BlockedUser[], isBlocked = false) => {
    if (loading) {
      return <div className="text-center py-4">読み込み中...</div>;
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {activeTab === 'following' && 'フォロー中のユーザーはいません'}
          {activeTab === 'followers' && 'フォロワーはいません'}
          {activeTab === 'blocked' && 'NG中のユーザーはいません'}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={user.picture || '/default-avatar.png'}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
              </div>
            </div>
            {isBlocked && (
              <button
                onClick={() => handleUnblock(user.id)}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                ブロック解除
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">フォロー管理</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'following'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            フォロー中
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'followers'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            フォロワー
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'blocked'
                ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            NG中
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'following' && renderUserList(following)}
          {activeTab === 'followers' && renderUserList(followers)}
          {activeTab === 'blocked' && renderUserList(blockedUsers, true)}
        </div>
      </div>
    </div>
  );
};

export default FollowManagePage;
