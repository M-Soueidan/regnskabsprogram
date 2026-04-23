import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/context/AppProvider'
import { activityDisplayTitle, activityLooksLikeCreditNote } from '@/lib/activityDisplay'
import { LoadingSpinner } from '@/components/LoadingIndicator'
import { activityEventHref } from '@/lib/activityNavigation'
import { formatDateTime } from '@/lib/format'
import type { Database } from '@/types/database'

type Activity = Database['public']['Tables']['activity_events']['Row']

const FETCH_LIMIT = 300

export function ActivityLogPage() {
  const { currentCompany } = useApp()
  const [rows, setRows] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentCompany) {
      setLoading(false)
      return
    }
    let c = false
    void (async () => {
      const { data, error } = await supabase
        .from('activity_events')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false })
        .limit(FETCH_LIMIT)
      if (c) return
      if (error) {
        setRows([])
        setLoading(false)
        return
      }
      setRows(data ?? [])
      setLoading(false)
    })()
    return () => {
      c = true
    }
  }, [currentCompany])

  if (!currentCompany) return null

  return (
    <div className="-mx-4 flex min-h-0 flex-1 flex-col md:-mx-8">
      <div className="space-y-1 px-4 pb-4 md:px-8">
        <Link
          to="/app/dashboard"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Tilbage til oversigt
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Aktivitetslog</h1>
        <p className="text-sm text-slate-600">
          Seneste {FETCH_LIMIT} hændelser for {currentCompany.name}
        </p>
      </div>

      <ul className="flex-1 divide-y divide-slate-100 border-y border-slate-200 bg-white">
        {loading ? (
          <li className="flex flex-col items-center justify-center gap-2 px-4 py-12 md:px-8">
            <span className="sr-only">Indlæser</span>
            <LoadingSpinner size="md" />
          </li>
        ) : rows.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-slate-500 md:px-8">Ingen aktivitet endnu.</li>
        ) : (
          rows.map((a) => {
            const credit = activityLooksLikeCreditNote(a)
            const href = activityEventHref(a)
            const rowPad = credit
              ? 'border-l-4 border-l-rose-600 bg-rose-50 px-4 py-3.5 md:px-8'
              : 'px-4 py-3.5 md:px-8'
            const titleCls = credit ? 'text-rose-950' : 'text-slate-800'
            const timeCls = credit ? 'text-rose-800/90' : 'text-slate-500'

            const inner = (
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  {credit ? (
                    <span
                      className="mt-0.5 shrink-0 rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                      title="Kreditnota"
                    >
                      Kredit
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold ${titleCls}`}>
                      {activityDisplayTitle(a)}
                    </div>
                    <div className={`mt-0.5 text-xs ${timeCls}`}>{formatDateTime(a.created_at)}</div>
                  </div>
                </div>
                {href ? (
                  <span
                    className="shrink-0 text-xs font-semibold text-indigo-600"
                    aria-hidden
                  >
                    Vis →
                  </span>
                ) : null}
              </div>
            )

            if (href) {
              return (
                <li key={a.id}>
                  <Link
                    to={href}
                    aria-label={`${activityDisplayTitle(a)} — åbn`}
                    className={clsx(
                      'block transition',
                      rowPad,
                      credit
                        ? 'hover:bg-rose-100/70 active:bg-rose-100'
                        : 'hover:bg-indigo-50/50 active:bg-indigo-50',
                    )}
                  >
                    {inner}
                  </Link>
                </li>
              )
            }

            return (
              <li key={a.id} className={rowPad}>
                {inner}
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
