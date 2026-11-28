// Service worker: deixa o app funcionando sem internet
const CACHE = 'fv-checklist-v1';
const ARQUIVOS = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest',
  'img/logo-fv-vidros.png', 'img/android-chrome-192x192.png', 'img/android-chrome-512x512.png', 'img/favicon-32x32.png', 'img/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('viacep')) return; // busca de CEP sempre online
  // arquivos do app: rede primeiro (pega atualizações), cache se estiver offline
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && (url.origin === location.origin || url.hostname.includes('fonts.g'))) {
        const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia));
      }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
