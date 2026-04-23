import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { MarketingFooter } from '@/components/MarketingFooter'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingMobileBottomNav } from '@/components/MarketingMobileBottomNav'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type PublicSettings = Database['public']['Tables']['platform_public_settings']['Row']

export const MarketingPublicSettingsContext = createContext<PublicSettings | null>(null)

export function useMarketingPublicSettings() {
  return useContext(MarketingPublicSettingsContext)
}

export function MarketingShell({
  children,
  pageTitle,
}: {
  children: ReactNode
  /** Vises som «{pageTitle} · Bilago» */
  pageTitle: string
}) {
  const [pub, setPub] = useState<PublicSettings | null>(null)

  useEffect(() => {
    const prev = document.title
    document.title = `${pageTitle} · Bilago`
    return () => {
      document.title = prev
    }
  }, [pageTitle])

  useEffect(() => {
    if (!isSupabaseConfigured) return
    void supabase
      .from('platform_public_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => setPub(data ?? null))
  }, [])

  return (
    <MarketingPublicSettingsContext.Provider value={pub}>
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <MarketingHeader />
        <div className="flex-1">{children}</div>
        <MarketingFooter pub={pub} />
        <MarketingMobileBottomNav />
      </div>
    </MarketingPublicSettingsContext.Provider>
  )
}
