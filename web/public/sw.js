/**
 * Minimal service worker — gør det muligt for Chrome/Edge at tilbyde «Installer app»
 * og lader siden køre i eget vindue uden browserchrome (sammen med manifest).
 * Opdater CACHE-navn ved større ændringer, hvis I senere tilføjer offline-cache.
 */
const CACHE = 'bilago-sw-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

/* Netværk først — ingen offline shell endnu */
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
