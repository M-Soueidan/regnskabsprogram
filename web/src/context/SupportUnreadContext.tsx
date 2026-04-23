import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'
import { subscriptionOk, useApp } from '@/context/AppProvider'

type SupportUnreadContextValue = {
  unreadCount: number
  refresh: () => Promise<void>
}

const SupportUnreadContext = createContext<SupportUnreadContextValue | null>(null)

export function useSupportUnread() {
  const ctx = useContext(SupportUnreadContext)
  if (!ctx) {
    return { unreadCount: 0, refresh: async () => {} }
  }
  return ctx
}

export function SupportUnreadProvider({ children }: { children: ReactNode }) {
  const { currentCompany, user, subscription } = useApp()
  const [unreadCount, setUnreadCount] = useState(0)

  const subOk = subscriptionOk(subscription)

  const refresh = useCallback(async () => {
    if (!currentCompany || !user || !subOk) {
      setUnreadCount(0)
      return
    }
    const { data, error } = await supabase.rpc('support_unread_staff_count', {
      p_company_id: currentCompany.id,
    })
    if (error) {
      console.warn('[support unread]', error.message)
      return
    }
    const n = typeof data === 'number' ? data : Number(data)
    setUnreadCount(Number.isFinite(n) ? n : 0)
  }, [currentCompany, user, subOk])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!subOk || !currentCompany) return

    const ch = supabase.channel(`support-unread:${currentCompany.id}`)
    ch.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'support_messages' },
      () => {
        void refresh()
      },
    )
    void ch.subscribe()

    return () => {
      void supabase.removeChannel(ch)
    }
  }, [currentCompany?.id, refresh, subOk])

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('setAppBadge' in navigator)) return
    const nav = navigator as Navigator & {
      setAppBadge?: (n?: number) => Promise<void>
      clearAppBadge?: () => Promise<void>
    }
    void (async () => {
      try {
        if (unreadCount > 0) await nav.setAppBadge?.(unreadCount)
        else await nav.clearAppBadge?.()
      } catch {
        /* ignore */
      }
    })()
  }, [unreadCount])

  const value = useMemo(
    () => ({
      unreadCount,
      refresh,
    }),
    [unreadCount, refresh],
  )

  return (
    <SupportUnreadContext.Provider value={value}>{children}</SupportUnreadContext.Provider>
  )
}
