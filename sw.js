// Service Worker for offline support
const CACHE_NAME = 'weather-app-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/css/styles.css',
  './assets/css/theme.css',
  './assets/css/pwa.css',
  './assets/css/components.css',
  './assets/js/script.js',
  './assets/js/weatherService.js',
  './assets/js/domManager.js',
  './assets/js/security.js',
  './assets/js/env.js',
  './assets/js/pwaManager.js',
  './assets/icons/logo.png',
  './assets/weather-icon.png',
  './manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.openweathermap.org') || 
      event.request.url.includes('api.waqi.info')) {
    // Network first for API calls
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache first for static assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});