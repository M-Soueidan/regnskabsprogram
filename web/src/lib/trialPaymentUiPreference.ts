/** Brugerpræference (kun i denne browser): skjul «Tilføj betaling» i prøvebanner mens der er dage tilbage. */
export const TRIAL_HIDE_PAYMENT_CTA_KEY = 'bilago:hideTrialPaymentDuringTrial'

export function getHideTrialPaymentCtaDuringTrial(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(TRIAL_HIDE_PAYMENT_CTA_KEY) === '1'
}

export function setHideTrialPaymentCtaDuringTrial(value: boolean): void {
  if (typeof window === 'undefined') return
  if (value) window.localStorage.setItem(TRIAL_HIDE_PAYMENT_CTA_KEY, '1')
  else window.localStorage.removeItem(TRIAL_HIDE_PAYMENT_CTA_KEY)
  window.dispatchEvent(new CustomEvent('bilago:trial-payment-cta-pref'))
}
