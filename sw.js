// sw.js — Service Worker básico (PWA offline shell)
const CACHE   = 'oab-v1';
const OFFLINE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/env.js',
  '/js/supabase.js',
  '/js/auth.js',
  '/js/config.js',
  '/logopsdev.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // API calls e Supabase: sempre rede, nunca cache
  if (e.request.url.includes('/api/') || e.request.url.includes('supabase.co')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
      return cached || net;
    })
  );
});
