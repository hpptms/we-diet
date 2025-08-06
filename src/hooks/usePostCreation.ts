import { useRecoilState } from 'recoil';
import { postCreationState } from '../recoil/postCreationAtom';
import { usePostManager } from './usePostManager';

export const usePostCreation = () => {
    const [postState, setPostState] = useRecoilState(postCreationState);
    const postManager = usePostManager();

    const createPostFromCurrentInput = async (content: string, images: File[] = [], isSensitive: boolean = false): Promise<boolean> => {
        try {
            setPostState(prev => ({ ...prev, isCreating: true }));

            const success = await postManager.createPost({
                content: content.trim(),
                images: images,
                is_sensitive: isSensitive
            });

            if (success) {
                console.log('投稿を作成しました');
                // 投稿成功後は状態をクリア
                setPostState({
                    content: '',
                    images: [],
                    isSensitive: false,
                    isCreating: false,
                });
            }

            return success;
        } catch (error) {
            console.error('投稿作成エラー:', error);
            return false;
        } finally {
            setPostState(prev => ({ ...prev, isCreating: false }));
        }
    };

    return {
        postState,
        setPostState,
        createPostFromCurrentInput,
    };
};
