import { atom } from 'recoil';

export interface PostCreationState {
    content: string;
    images: File[];
    isSensitive: boolean;
    isCreating: boolean;
}

export const postCreationState = atom<PostCreationState>({
    key: 'postCreationState',
    default: {
        content: '',
        images: [],
        isSensitive: false,
        isCreating: false,
    },
});
