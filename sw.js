/* Keeps Farkler playable when the server it came from isn't answering.
   Rule number one in here: every path must return a real Response. Handing respondWith()
   an undefined kills the navigation and paints a blank white page, which is exactly the
   bug this file used to have. */
const CACHE = 'farkler-v8';
const FILES = ['index.html', 'icon-180.png'];
const SLOW = 3500;                        // how long to wait for the network before giving up on it

// a fetch that won't hang the launch on a bad connection
function tryNet(req){
  return Promise.race([
    fetch(req),
    new Promise((_, no) => setTimeout(() => no(new Error('slow')), SLOW))
  ]);
}

// One at a time: addAll() rejects the whole install if any single request fails.
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

// last resort, so a failure is always legible instead of blank
function sos(){
  return new Response(
    '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<body style="margin:0;padding:28px;background:#0a1210;color:#eaf2ee;' +
    'font:16px/1.5 -apple-system,system-ui,sans-serif">' +
    '<h2 style="color:#ffcb47;margin:0 0 10px">Farkler couldn\'t load</h2>' +
    '<p>No saved copy on this device and nothing answering at this address.</p>' +
    '<p>Start the server app, then pull down to reload. Once it loads here once, ' +
    'it will keep working on its own.</p></body>',
    {headers:{'Content-Type':'text/html;charset=utf-8'}, status:200}
  );
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  if(new URL(req.url).origin !== location.origin) return;   // leave anything external alone

  const isPage = req.mode === 'navigate';

  e.respondWith((async () => {
    // The app itself asks the network first. It used to come out of the cache and only
    // freshen itself for next time, which meant a change never showed up on the launch you
    // were looking at — you had to open it twice, and a Home Screen app that never really
    // quits might not have opened twice in days. Offline still works: that's the fallback.
    if(isPage){
      try{
        const net = await tryNet(req);
        if(net && net.ok){
          const copy = net.clone();
          caches.open(CACHE).then(c => c.put('index.html', copy)).catch(()=>{});
          return net;
        }
      }catch(err){}
      return (await caches.match('index.html', {ignoreSearch:true})) || sos();
    }

    const hit = await caches.match(req, {ignoreSearch:true});
    if(hit){
      // freshen it quietly for next launch
      fetch(req).then(r => {
        if(r && r.ok) caches.open(CACHE).then(c => c.put(req, r.clone()));
      }).catch(()=>{});
      return hit;
    }

    try{
      const net = await fetch(req);
      if(net && net.ok){
        const copy = net.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return net;
      }
      // a 404 is as fatal as no server — for a page, hand back the app instead
      if(isPage) return (await caches.match('index.html')) || net || sos();
      return net || sos();
    }catch(err){
      if(isPage) return (await caches.match('index.html')) || sos();
      return sos();
    }
  })());
});
