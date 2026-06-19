// sw.js — Service Worker básico (PWA shell para assets estáticos)
const CACHE   = 'oab-v2';
const OFFLINE = [
  '/css/styles.css',
  '/js/env.js',
  '/js/supabase.js',
  '/js/auth.js',
  '/js/config.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // add resiliente: um asset que falhe não derruba a instalação inteira
      .then(c => Promise.allSettled(OFFLINE.map(u => c.add(u))))
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
  const req = e.request;

  // Navegações (HTML): sempre rede direta — evita cachear redirects do cleanUrls
  if (req.mode === 'navigate') return;

  // Somente GET; nunca API nem Supabase
  if (req.method !== 'GET') return;
  if (req.url.includes('/api/') || req.url.includes('supabase.co')) return;

  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        // não cacheia respostas com erro nem redirecionadas
        if (res.ok && !res.redirected) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
