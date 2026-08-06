/* Keeps Farkler playable from the Home Screen even when the little server app on the iPad
   has been suspended. Cache-first: the game is one static file and never phones home. */
const CACHE = 'farkler-v2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch:true}).then(hit => {
      if(hit){
        // refresh the copy in the background so edits on the Mac land next launch
        fetch(e.request).then(r => {
          if(r && r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        }).catch(()=>{});
        return hit;
      }
      return fetch(e.request).then(r => {
        if(r && r.ok && new URL(e.request.url).origin === location.origin){
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      }).catch(() => caches.match('index.html'));
    })
  );
});
