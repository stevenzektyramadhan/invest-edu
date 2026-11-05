// ponytail: self-destructing Service Worker to evict stale localhost:3000 SWs (e.g. labkom-pwa) and clear poisoned CacheStorage
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() =>
        self.clients.matchAll({ type: "window", includeUncontrolled: true })
      )
      .then((clients) => {
        clients.forEach((client) => {
          if ("navigate" in client) {
            client.navigate(client.url);
          }
        });
      })
  );
});
