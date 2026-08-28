// Service worker minimale: cache-first per i file dell'app,
// network-first (con fallback alla cache) per le librerie esterne da CDN.

const CACHE_NAME = 'tracker-analisi-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // ignora richieste non http/https (es. chrome-extension://) e non GET
  // (la Cache API supporta solo richieste GET, es. le PATCH verso l'API Drive vanno escluse)
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;
  if (event.request.method !== 'GET') return;

  const isSameOrigin = url.startsWith(self.location.origin);

  if (isSameOrigin) {
    // File dell'app: cache-first, aggiorna la cache in background
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((res) => {
            const resClone = res.clone(); // clonare SUBITO, prima che il corpo venga letto altrove
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  } else {
    // Librerie esterne (CDN): network-first, fallback alla cache se offline
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const resClone = res.clone(); // clonare SUBITO, prima che il corpo venga letto altrove
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
