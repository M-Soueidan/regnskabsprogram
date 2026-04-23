import clsx from 'clsx'
import { Link } from 'react-router-dom'
import type { FeatureCard } from '@/marketing/featureCards'

export function MarketingFeatureCard({
  card,
  titleClassName = 'mt-5 text-base font-semibold text-slate-900',
}: {
  card: FeatureCard
  titleClassName?: string
}) {
  const content = (
    <>
      {card.comingSoon ? (
        <span className="absolute right-4 top-4 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
          Kommer snart
        </span>
      ) : null}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
        <card.icon className="h-6 w-6" />
      </div>
      <h3 className={clsx(titleClassName, card.comingSoon && 'pr-24 sm:pr-28')}>{card.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100">
        Læs mere <span aria-hidden>→</span>
      </span>
    </>
  )

  const baseClass = clsx(
    'group relative block rounded-2xl border bg-white p-6 transition hover:shadow-md',
    card.comingSoon ? 'border-indigo-100 hover:border-indigo-200' : 'border-slate-200 hover:border-indigo-200',
  )

  return (
    <Link to={`/funktioner/${card.slug}`} className={baseClass}>
      {content}
    </Link>
  )
}
