/* Service worker de Ritmo Diario
   - Precachea la app y la fuente Bravura (funciona sin conexión).
   - Cachea en tiempo de ejecución los sonidos del banco (mismo origen o GitHub raw).
   Sube VERSION cada vez que cambies archivos para forzar la actualización. */
const VERSION = 'v1';
const CORE = `ritmo-core-${VERSION}`;
const RUNTIME = `ritmo-runtime-${VERSION}`;
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts/Bravura.otf',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './sounds/click.wav',
  './sounds/accent.wav'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CORE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => ![CORE, RUNTIME].includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const AUDIO_RE = /\.(wav|mp3|ogg|oga|m4a|flac|aac|webm)(\?.*)?$/i;

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Navegación: red primero, caché como respaldo offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CORE).then(c => c.put('./index.html', copy));
        return r;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Sonidos (cualquier origen con CORS, p. ej. raw.githubusercontent.com): caché primero
  if (AUDIO_RE.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(r => {
        if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(RUNTIME).then(c => c.put(req, copy)); }
        return r;
      }))
    );
    return;
  }

  // Resto del mismo origen: caché primero y actualiza en segundo plano
  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then(hit => {
        const net = fetch(req).then(r => {
          if (r.ok) { const copy = r.clone(); caches.open(CORE).then(c => c.put(req, copy)); }
          return r;
        }).catch(() => hit);
        return hit || net;
      })
    );
  }
});
