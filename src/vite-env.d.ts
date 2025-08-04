/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_ENDPOINT: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_FACEBOOK_APP_ID: string;
    // 他の環境変数があればここに追加
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
