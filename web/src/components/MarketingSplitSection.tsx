import type { ReactNode } from 'react'
import clsx from 'clsx'

type MarketingSplitLayoutProps = {
  left: ReactNode
  right: ReactNode
  visualOnLeft?: boolean
  className?: string
}

export function MarketingSplitLayout({
  left,
  right,
  visualOnLeft = false,
  className = '',
}: MarketingSplitLayoutProps) {
  return (
    <div
      className={clsx(
        'grid gap-10 sm:gap-12 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16 2xl:gap-20',
        visualOnLeft && 'lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1',
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl space-y-4 lg:max-w-none">{left}</div>
      <div className="min-w-0 lg:justify-self-stretch">{right}</div>
    </div>
  )
}

type MarketingSplitSectionProps = MarketingSplitLayoutProps & {
  className?: string
  withMarketingSurface?: boolean
  /** Indigo/lys hero-wash som forsiden; section får `relative overflow-hidden` */
  withHeroGradient?: boolean
  innerClassName?: string
}

/**
 * 50/50 (ca.) split på lg+ — som forsiderens fakturering / bank. Mobil: tekst, derefter visuel.
 */
export function MarketingSplitSection({
  left,
  right,
  visualOnLeft = false,
  className = '',
  withMarketingSurface = true,
  withHeroGradient = false,
  innerClassName = '',
}: MarketingSplitSectionProps) {
  return (
    <section
      className={clsx(
        'border-b border-slate-100',
        withHeroGradient && 'relative overflow-hidden',
        withMarketingSurface && !withHeroGradient && 'bg-gradient-to-b from-slate-50/80 to-white',
        className,
      )}
    >
      {withHeroGradient ? (
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white"
          aria-hidden
        />
      ) : null}
      <div
        className={clsx(
          'mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:py-24',
          withHeroGradient && 'relative',
          innerClassName,
        )}
      >
        <MarketingSplitLayout left={left} right={right} visualOnLeft={visualOnLeft} />
      </div>
    </section>
  )
}
