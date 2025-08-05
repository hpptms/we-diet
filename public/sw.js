const CACHE_NAME = 'we-diet-v1.1.0';
const STATIC_CACHE = 'static-v1.1.0';
const DYNAMIC_CACHE = 'dynamic-v1.1.0';
const IMAGE_CACHE = 'images-v1.1.0';

// キャッシュするリソースのリスト
const STATIC_ASSETS = [
    '/',
    '/static/css/main.css',
    '/static/js/main.js',
    '/favicon.ico',
    '/manifest.json'
];

// 画像の最大キャッシュサイズ（MB）
const MAX_IMAGE_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

// Service Worker のインストール
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                // インストール後すぐにアクティブになる
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Failed to cache static assets:', error);
            })
    );
});

// Service Worker のアクティベーション
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        Promise.all([
            // 古いキャッシュを削除
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE &&
                            cacheName !== DYNAMIC_CACHE &&
                            cacheName !== IMAGE_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // すべてのクライアントを制御下に置く
            self.clients.claim()
        ])
    );
});

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // APIリクエストは常にネットワークから取得
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
        event.respondWith(
            fetch(request).catch(() => {
                // ネットワークエラー時の処理
                return new Response(
                    JSON.stringify({ error: 'Network unavailable' }),
                    {
                        status: 503,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            })
        );
        return;
    }

    // 画像リクエストの処理
    if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
        return;
    }

    // 静的アセットの処理
    if (url.pathname.startsWith('/static/') ||
        url.pathname.startsWith('/assets/') ||
        url.pathname.includes('.js') ||
        url.pathname.includes('.css')) {
        event.respondWith(handleStaticAssets(request));
        return;
    }

    // HTMLページの処理（SPA対応）
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigation(request));
        return;
    }

    // その他のリクエスト
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});

// 画像リクエストの処理関数
async function handleImageRequest(request) {
    try {
        // キャッシュから確認
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // ネットワークから取得
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // 画像キャッシュに保存（サイズ制限あり）
            const cache = await caches.open(IMAGE_CACHE);

            // キャッシュサイズをチェック
            await limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE);

            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Image fetch failed:', error);
        // フォールバック画像を返す
        return new Response(
            '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ddd"/></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

// 静的アセットの処理関数
async function handleStaticAssets(request) {
    try {
        // Cache First戦略
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // ネットワークから取得してキャッシュ
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Static asset fetch failed:', error);
        return new Response('Asset not available', { status: 404 });
    }
}

// ナビゲーションリクエストの処理関数
async function handleNavigation(request) {
    try {
        // Network First戦略（HTMLは最新を優先）
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Navigation fetch failed:', error);

        // キャッシュからフォールバック
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // メインページにフォールバック（SPA）
        const fallbackResponse = await caches.match('/');
        if (fallbackResponse) {
            return fallbackResponse;
        }

        return new Response('Page not available offline', {
            status: 503,
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

// キャッシュサイズ制限関数
async function limitCacheSize(cacheName, maxSize) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    let totalSize = 0;
    const sizePromises = keys.map(async (key) => {
        const response = await cache.match(key);
        const size = await getResponseSize(response);
        return { key, size };
    });

    const keysWithSizes = await Promise.all(sizePromises);
    keysWithSizes.sort((a, b) => b.size - a.size); // サイズ順にソート

    for (const { key, size } of keysWithSizes) {
        totalSize += size;
        if (totalSize > maxSize) {
            await cache.delete(key);
            console.log('Deleted from cache due to size limit:', key.url);
        }
    }
}

// レスポンスサイズを取得する関数
async function getResponseSize(response) {
    if (!response) return 0;
    const cloned = response.clone();
    const buffer = await cloned.arrayBuffer();
    return buffer.byteLength;
}

// メッセージイベントの処理
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE).then((cache) => {
                return cache.addAll(event.data.payload);
            })
        );
    }
});

// バックグラウンド同期（利用可能な場合）
if ('sync' in self.registration) {
    self.addEventListener('sync', (event) => {
        if (event.tag === 'background-sync') {
            event.waitUntil(doBackgroundSync());
        }
    });
}

async function doBackgroundSync() {
    try {
        // 必要に応じてバックグラウンド同期処理を実装
        console.log('Background sync triggered');
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}
