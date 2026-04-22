import { useEffect } from 'react'
import { subscriptionOk, useApp } from '@/context/AppProvider'
import { registerWebPushSubscription } from '@/lib/pushClient'

const STORAGE_KEY = 'hisab:pushSubscribeAttempted'

/**
 * Tilbyder Web Push én gang pr. session (efter kort pause), når brugeren har aktivt abonnement.
 */
export function RegisterPushNotifications() {
  const { user, subscription, currentCompany } = useApp()

  useEffect(() => {
    if (!user || !currentCompany || !subscriptionOk(subscription)) return
    if (typeof Notification === 'undefined' || Notification.permission === 'denied') return

    let cancelled = false
    const t = window.setTimeout(() => {
      if (cancelled) return
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) return
      } catch {
        return
      }
      void (async () => {
        try {
          const ok = await registerWebPushSubscription()
          try {
            sessionStorage.setItem(STORAGE_KEY, ok ? '1' : '0')
          } catch {
            /* ignore */
          }
        } catch {
          try {
            sessionStorage.setItem(STORAGE_KEY, '0')
          } catch {
            /* ignore */
          }
        }
      })()
    }, 4000)

    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [user, subscription, currentCompany])

  return null
}
