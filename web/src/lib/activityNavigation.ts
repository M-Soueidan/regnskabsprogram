import type { Database } from '@/types/database'

type Activity = Database['public']['Tables']['activity_events']['Row']

function metaObject(meta: Activity['meta']): Record<string, unknown> | null {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return null
  return meta as Record<string, unknown>
}

/** Sti til detaljevisning for aktivitet, hvis kendt — ellers `null` (vis som ren tekst). */
export function activityEventHref(a: Activity): string | null {
  const m = metaObject(a.meta)
  if (m) {
    const invoiceId = m.invoice_id
    if (typeof invoiceId === 'string' && invoiceId.length > 0) {
      return `/app/invoices/${invoiceId}`
    }
    const voucherId = m.voucher_id
    if (typeof voucherId === 'string' && voucherId.length > 0) {
      return `/app/vouchers?voucher=${encodeURIComponent(voucherId)}`
    }
  }
  if (a.event_type === 'bank_connected') {
    return '/app/bank'
  }
  return null
}
