/**
 * Service worker: netværk først + Web Push til support.
 * Opdater CACHE-navn ved ændringer for at tvinge opdatering hos klienter.
 */
const CACHE = 'bilago-sw-v3'

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

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})

self.addEventListener('push', (event) => {
  let title = 'Bilago'
  let body = 'Du har en ny besked.'
  let url = '/app/support'
  try {
    if (event.data) {
      const j = event.data.json()
      if (typeof j.title === 'string') title = j.title
      if (typeof j.body === 'string') body = j.body
      if (typeof j.url === 'string') url = j.url
    }
  } catch {
    /* brug defaults */
  }
  const origin = self.location.origin
  const openUrl = url.startsWith('http') ? url : `${origin}${url.startsWith('/') ? '' : '/'}${url}`

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: `${origin}/pwa-192.png`,
      badge: `${origin}/favicon-32.png`,
      tag: 'bilago-support',
      renotify: true,
      data: { url: openUrl },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const raw = event.notification.data && event.notification.data.url
  const url =
    typeof raw === 'string' && raw.length > 0 ? raw : `${self.location.origin}/app/support`

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url && c.url.startsWith(self.location.origin) && 'focus' in c) {
          void c.focus()
          if ('navigate' in c && typeof c.navigate === 'function') {
            try {
              return c.navigate(url)
            } catch {
              /* ignore */
            }
          }
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    }),
  )
})
