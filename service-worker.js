const CACHE_NAME = "cbn-cache-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/Cart.html",
  "/Checkout.html",
  "/Contact-us.html",
  "/manifest.json"
];

// Install: cache all core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // If offline and not cached, show nothing (graceful fail)
      });
    })
  );
});
