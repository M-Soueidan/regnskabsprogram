/**
 * Brugerpræference (kun i denne browser): skjul hele prøvebanner øverst under prøveperioden.
 * Gælder kun mens der er mindst én dag tilbage (samme regel som tidligere for knappen alene).
 */

export const TRIAL_HIDE_BANNER_KEY = 'bilago:hideTrialBannerDuringTrial'

/** @deprecated Læses stadig for bagudkompatibilitet (ældre «kun skjul knap»-gem). */
const LEGACY_HIDE_PAYMENT_CTA_KEY = 'bilago:hideTrialPaymentDuringTrial'

export function getHideTrialBannerDuringTrial(): boolean {
  if (typeof window === 'undefined') return false
  if (window.localStorage.getItem(TRIAL_HIDE_BANNER_KEY) === '1') return true
  return window.localStorage.getItem(LEGACY_HIDE_PAYMENT_CTA_KEY) === '1'
}

export function setHideTrialBannerDuringTrial(value: boolean): void {
  if (typeof window === 'undefined') return
  if (value) {
    window.localStorage.setItem(TRIAL_HIDE_BANNER_KEY, '1')
    window.localStorage.removeItem(LEGACY_HIDE_PAYMENT_CTA_KEY)
  } else {
    window.localStorage.removeItem(TRIAL_HIDE_BANNER_KEY)
    window.localStorage.removeItem(LEGACY_HIDE_PAYMENT_CTA_KEY)
  }
  window.dispatchEvent(new CustomEvent('bilago:trial-banner-pref'))
}
