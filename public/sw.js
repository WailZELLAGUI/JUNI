// Keeps JUNI working without a connection once it has been opened online.
const CACHE = 'juni-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function fetchAndKeep(request) {
  return fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Built files (code, styles, fonts) never change under the same name: serve the saved copy first.
  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(request, { ignoreVary: true }).then((hit) => hit || fetchAndKeep(request)));
    return;
  }
  // Everything else: newest version when online, saved copy when not.
  event.respondWith(fetchAndKeep(request).catch(() => caches.match(request, { ignoreSearch: true, ignoreVary: true })));
});
