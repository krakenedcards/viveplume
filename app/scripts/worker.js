const prefix = 'viveplume-liseuse:';
const version = prefix + '__VERSION__';
const urls = /* URLS */[];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(version);
    await cache.addAll(urls.map(url => new Request(url, {cache:'reload'})));
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(prefix) && name !== version) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(version);
    const path = url.pathname.replace(/\/index\.html$/, '/');
    const saved = await cache.match(path) || await cache.match(path + '/');
    return saved || fetch(event.request);
  })());
});
