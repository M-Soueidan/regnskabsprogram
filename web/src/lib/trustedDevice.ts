/**
 * Browser-genereret enheds-id der lever i localStorage. Bruges sammen med tabellen
 * `public.mfa_trusted_devices` til at huske enheden i fx 30 dage efter et 2-trins login.
 */

const STORAGE_KEY = 'bilago_mfa_device_id'
export const TRUSTED_DEVICE_TTL_DAYS = 30

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return ''
  const existing = window.localStorage.getItem(STORAGE_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  window.localStorage.setItem(STORAGE_KEY, id)
  return id
}

/** Udløb som ISO-string (timezone-uafhængig). */
export function trustedDeviceExpiry(days: number = TRUSTED_DEVICE_TTL_DAYS): string {
  const ms = Date.now() + days * 24 * 60 * 60 * 1000
  return new Date(ms).toISOString()
}
