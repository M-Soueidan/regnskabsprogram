import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { formatDkk, formatKrPerMonth } from '@/lib/format'
import { CheckIcon } from '@/marketing/MarketingIcons'
import { PRICING_DEFAULTS } from '@/lib/pricingPublicDefaults'
import { resolvePricingCornerBadge } from '@/lib/pricingCornerBadge'
import type { Database } from '@/types/database'

type PublicSettings = Database['public']['Tables']['platform_public_settings']['Row']

function PricingPitchParagraph({
  template,
  beløb,
}: {
  template: string | null | undefined
  beløb: string
}) {
  const raw = template?.trim() || PRICING_DEFAULTS.pitch
  const parts = raw.split('{beløb}')
  return (
    <p className="mt-3 text-xs text-slate-600">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 ? (
            <strong className="text-slate-900">{beløb}</strong>
          ) : null}
        </Fragment>
      ))}
    </p>
  )
}

export function MarketingPricingSection({ pub }: { pub: PublicSettings | null }) {
  const amountCents =
    pub?.pricing_amount_cents ?? pub?.monthly_price_cents ?? 9900
  const compareCents = pub?.pricing_compare_cents
  const title = pub?.pricing_title?.trim() || PRICING_DEFAULTS.title
  const subtitle = pub?.pricing_subtitle?.trim() || PRICING_DEFAULTS.subtitle
  const badge = pub?.pricing_badge?.trim() || PRICING_DEFAULTS.badge
  const planName = pub?.pricing_plan_name?.trim() || PRICING_DEFAULTS.planName
  const beløb = formatKrPerMonth(amountCents)
  const featureLines = (pub?.pricing_features?.trim() || PRICING_DEFAULTS.features)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const cta = pub?.pricing_cta_label?.trim() || PRICING_DEFAULTS.cta
  const krWhole = Math.round(amountCents / 100)
  const cornerLabel = resolvePricingCornerBadge({
    customCorner: pub?.pricing_corner_badge,
    compareCents,
    amountCents,
  })

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg text-slate-600">{subtitle}</p>
      <div className="relative mx-auto mt-10 max-w-md rounded-2xl border-2 border-indigo-200 bg-white p-8 pt-10 shadow-lg shadow-indigo-100/60">
        {cornerLabel ? (
          <span className="absolute right-4 top-4 max-w-[min(11rem,calc(100%-2rem))] text-right text-[11px] font-semibold leading-tight text-emerald-800 sm:text-xs">
            <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 ring-1 ring-emerald-200">
              {cornerLabel}
            </span>
          </span>
        ) : null}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            {badge}
          </span>
        </div>
        <div className="mt-5 text-sm font-semibold uppercase tracking-wide text-indigo-600">
          {planName}
        </div>
        {compareCents != null && compareCents > 0 ? (
          <div className="mt-2 text-sm text-slate-400">
            <span className="line-through">{formatKrPerMonth(compareCents)}</span>
          </div>
        ) : null}
        <div className="mt-1 flex items-baseline justify-center gap-1">
          <span className="text-5xl font-semibold text-slate-900">{krWhole}</span>
          <span className="text-base text-slate-500">kr./md</span>
        </div>
        {pub?.monthly_price_cents != null && pub.monthly_price_cents > 0 ? (
          <p className="mt-2 text-xs text-slate-500">
            Listepris i systemet: {formatDkk(pub.monthly_price_cents)} / md (kan styres under
            platform).
          </p>
        ) : null}
        <PricingPitchParagraph template={pub?.pricing_pitch} beløb={beløb} />
        <ul className="mt-6 space-y-3 text-left text-sm text-slate-700">
          {featureLines.map((l, i) => (
            <li key={`${i}-${l.slice(0, 24)}`} className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              {l}
            </li>
          ))}
        </ul>
        <Link
          to="/signup"
          className="mt-8 block rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {cta}
        </Link>
      </div>
    </div>
  )
}
