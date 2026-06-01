// Service Worker para PWA - Projeto do Agrinho
// Versão 1.0 - Cache-first strategy com fallback

const CACHE_NAME = 'agrinho-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌾</text></svg>'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache aberto:', CACHE_NAME);
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch((error) => {
        console.error('❌ Erro ao cachear recursos:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we got a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return a fallback response
        return new Response(
          '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Offline</title><style>body{font-family:Arial;text-align:center;padding:50px;background:#f5f5f5}h1{color:#2E7D32}p{color:#666}</style></head><body><h1>📵 Você está offline</h1><p>Parece que você perdeu a conexão com a internet.</p><p>Tente novamente quando tiver conexão.</p></body></html>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      })
  );
});

// Handle background sync (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-agrinho') {
    event.waitUntil(
      fetch('/api/sync')
        .catch(() => {
          console.log('Sync failed, will retry...');
        })
    );
  }
});

console.log('✅ Service Worker carregado com sucesso!');
