import type { ReactNode } from 'react'
import { MarketingAppPhoneFrame } from '@/components/MarketingAppPhoneMockup'

function MockWindow({
  url,
  children,
  className = '',
}: {
  url: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-indigo-100/60 sm:p-5 ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" aria-hidden />
        <span className="ml-2 truncate text-xs text-slate-400">{url}</span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

/** Funktioner: CVR + bank/bilag — andet end forsiden */
export function MarketingFeaturesMockup() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
      <MockWindow url="bilago.dk/kunder/ny">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">CVR-opslag</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-800">
            12 34 56 78
          </div>
          <span className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">
            Hent
          </span>
        </div>
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/80 p-3">
          <div className="text-sm font-semibold text-slate-900">Nordhavn Consulting ApS</div>
          <div className="mt-1 text-xs text-slate-600">CVR 12345678 · København</div>
        </div>
      </MockWindow>
      <MockWindow url="bilago.dk/bank">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Kontoudtog</p>
        <ul className="mt-3 space-y-2 text-sm">
          {[
            { t: 'Indbetaling · Kunde A/S', a: '4.500,00 kr.', s: 'Matchet', pill: 'bg-emerald-100 text-emerald-800' },
            { t: 'Kort · Software A/S', a: '899,00 kr.', s: 'Forslag', pill: 'bg-indigo-100 text-indigo-800' },
            { t: 'Gebyr', a: '-15,00 kr.', s: 'Tjek', pill: 'bg-amber-100 text-amber-800' },
          ].map((r) => (
            <li
              key={r.t}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-2 py-2"
            >
              <span className="min-w-0 truncate text-slate-800">{r.t}</span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-slate-600">{r.a}</span>
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${r.pill}`}>
                  {r.s}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </MockWindow>
    </div>
  )
}

/** Priser: mobil med abonnement (andre tal end reference) */
export function MarketingPricingMockup() {
  return (
    <div className="flex justify-center">
      <MarketingAppPhoneFrame variant="pricing" />
    </div>
  )
}

/** FAQ: Hjælp i mobilen */
export function MarketingFaqMockup() {
  return (
    <div className="flex justify-center">
      <MarketingAppPhoneFrame variant="faq" />
    </div>
  )
}

/** Support: support-tråd i mobilen */
export function MarketingSupportMockup() {
  return (
    <div className="flex justify-center">
      <MarketingAppPhoneFrame variant="support" />
    </div>
  )
}

export type MarketingShowcaseVariant = 'features' | 'pricing' | 'faq' | 'support'

export function MarketingShowcaseBody({ variant }: { variant: MarketingShowcaseVariant }) {
  switch (variant) {
    case 'features':
      return <MarketingFeaturesMockup />
    case 'pricing':
      return <MarketingPricingMockup />
    case 'faq':
      return <MarketingFaqMockup />
    case 'support':
      return <MarketingSupportMockup />
  }
}
