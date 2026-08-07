/* Keeps Farkler playable from the Home Screen even when the little server app on the iPad
   has been suspended. Cache-first: the game is one static file and never phones home. */
const CACHE = 'farkler-v3';
const FILES = ['index.html', 'manifest.webmanifest', 'icon-180.png'];

// Cache each file on its own: addAll() rejects the whole install if any single request fails,
// and some little server apps 404 on things like a bare directory path.
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(FILES.map(f => c.add(f))))
      .then(() => self.skipWaiting())
  );
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
      const isPage = e.request.mode === 'navigate';
      return fetch(e.request).then(r => {
        // a 404 is just as fatal as no server at all — for a page request, fall back to the app
        if(isPage && (!r || !r.ok)) return caches.match('index.html').then(f => f || r);
        if(r && r.ok && new URL(e.request.url).origin === location.origin){
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      }).catch(() => caches.match('index.html'));
    })
  );
});
