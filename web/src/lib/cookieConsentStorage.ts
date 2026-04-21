const STORAGE_KEY = 'bilago:cookie-consent'
export const COOKIE_CONSENT_VERSION = 1 as const

export type CookieConsentState = {
  v: typeof COOKIE_CONSENT_VERSION
  /** Altid true — login, sikkerhed, præferencer for dette valg */
  necessary: true
  /** Valgfrie cookies (fx analyse — bruges når I tilføjer måling) */
  analytics: boolean
  decidedAt: string
}

export function getStoredCookieConsent(): CookieConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<CookieConsentState>
    if (data.v !== COOKIE_CONSENT_VERSION) return null
    if (data.necessary !== true) return null
    if (typeof data.analytics !== 'boolean') return null
    if (typeof data.decidedAt !== 'string') return null
    return data as CookieConsentState
  } catch {
    return null
  }
}

export function saveCookieConsent(analytics: boolean): CookieConsentState {
  const state: CookieConsentState = {
    v: COOKIE_CONSENT_VERSION,
    necessary: true,
    analytics,
    decidedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* private mode / quota */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bilago:cookie-consent', { detail: state }))
  }
  return state
}

export function hasCookieConsentAnswer(): boolean {
  return getStoredCookieConsent() !== null
}
