import { useCallback, useEffect, useMemo, useState } from 'react'
import { SortableTh } from '@/components/SortableTh'
import { nextColumnSortState, type ColumnSortDir } from '@/lib/tableSort'
import { Navigate } from 'react-router-dom'
import { useApp } from '@/context/AppProvider'
import { supabase } from '@/lib/supabase'
import { formatDateTime } from '@/lib/format'

type StaffRow = {
  user_id: string
  role: 'superadmin' | 'support_admin'
  created_at: string
  email: string
}

type StaffSortKey = 'email' | 'role' | 'created'

function sortStaff(list: StaffRow[], key: StaffSortKey, dir: ColumnSortDir): StaffRow[] {
  const mul = dir === 'asc' ? 1 : -1
  return [...list].sort((a, b) => {
    switch (key) {
      case 'email':
        return mul * String(a.email).localeCompare(String(b.email), 'da', { sensitivity: 'base' })
      case 'role':
        return mul * String(a.role).localeCompare(String(b.role))
      case 'created':
        return mul * String(a.created_at).localeCompare(String(b.created_at))
      default:
        return 0
    }
  })
}

export function PlatformStaffPage() {
  const { platformRole } = useApp()
  const [rows, setRows] = useState<StaffRow[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<StaffSortKey | null>(null)
  const [sortDir, setSortDir] = useState<ColumnSortDir>('desc')

  const displayRows = useMemo(() => {
    if (sortKey === null) return rows
    return sortStaff(rows, sortKey, sortDir)
  }, [rows, sortKey, sortDir])

  function onSortColumn(col: StaffSortKey) {
    const next = nextColumnSortState(col, sortKey, sortDir, true)
    setSortKey(next.key as StaffSortKey | null)
    setSortDir(next.dir)
  }

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: qErr } = await supabase.rpc('list_platform_staff_with_emails')
    setLoading(false)
    if (qErr) {
      setError(qErr.message)
      return
    }
    const list = (data ?? []) as StaffRow[]
    setRows(list)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (platformRole !== 'superadmin') {
    return <Navigate to="/platform/dashboard" replace />
  }

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setBusy(true)
    setError(null)
    setInfo(null)
    const { error: rpcErr } = await supabase.rpc('add_support_admin_by_email', {
      p_email: email.trim(),
    })
    setBusy(false)
    if (rpcErr) {
      setError(rpcErr.message)
      return
    }
    setEmail('')
    setInfo('Support-admin tilføjet.')
    void load()
  }

  async function remove(userId: string) {
    if (!confirm('Fjerne denne platform-bruger?')) return
    setBusy(true)
    setError(null)
    const { error: dErr } = await supabase
      .from('platform_staff')
      .delete()
      .eq('user_id', userId)
    setBusy(false)
    if (dErr) {
      setError(dErr.message)
      return
    }
    void load()
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Platform-team</h1>
        <p className="mt-1 text-sm text-slate-600">
          Kun superadmin kan tilføje support-admins. Brugeren skal have en konto i forvejen.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : null}
      {info ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {info}
        </div>
      ) : null}

      <form
        onSubmit={(e) => void addAdmin(e)}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="min-w-[200px] flex-1">
          <label className="text-xs font-medium text-slate-600">E-mail</label>
          <input
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kollega@firma.dk"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Tilføj support-admin
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Indlæser…</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <SortableTh
                  label="E-mail"
                  isActive={sortKey === 'email'}
                  direction={sortKey === 'email' ? sortDir : null}
                  onClick={() => onSortColumn('email')}
                />
                <SortableTh
                  label="Rolle"
                  isActive={sortKey === 'role'}
                  direction={sortKey === 'role' ? sortDir : null}
                  onClick={() => onSortColumn('role')}
                />
                <SortableTh
                  label="Oprettet"
                  isActive={sortKey === 'created'}
                  direction={sortKey === 'created' ? sortDir : null}
                  onClick={() => onSortColumn('created')}
                  className="hidden sm:table-cell"
                />
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Handling
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayRows.map((r) => (
                <tr key={r.user_id}>
                  <td className="px-4 py-3 text-slate-800">
                    <span className="break-all">{r.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    {r.role === 'superadmin' ? 'Superadmin' : 'Support'}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                    {formatDateTime(r.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.role !== 'superadmin' ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void remove(r.user_id)}
                        className="text-xs font-medium text-rose-600 hover:underline disabled:opacity-50"
                      >
                        Fjern
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
