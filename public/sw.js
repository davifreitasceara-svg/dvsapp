// Service Worker básico para PWA
self.addEventListener('install', (e) => {
  console.log('[SW] Instalado');
});

self.addEventListener('fetch', (e) => {
  // Apenas passa as requisições adiante (estratégia network-only)
  // Isso é suficiente para o navegador considerar o app instalável
  e.respondWith(fetch(e.request));
});
