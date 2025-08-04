// Service Worker for We diet App
const CACHE_NAME = 'we-diet-v1';
const urlsToCache = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json',
    '/favicon.ico'
];

// インストール時のキャッシュ設定
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Service Worker: キャッシュを開きました');
                return cache.addAll(urlsToCache);
            })
    );
});

// ネットワークリクエスト時のキャッシュ戦略
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // キャッシュにあれば返す、なければネットワークから取得
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// 古いキャッシュの削除
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: 古いキャッシュを削除しました', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
