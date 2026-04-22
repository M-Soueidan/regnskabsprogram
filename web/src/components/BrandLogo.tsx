import clsx from 'clsx'

/** Fuld logo med pay-off til marketing-header og -footer (`/public/bilago-logo.png`). */
export function BrandLogo({
  className,
  variant = 'header',
}: {
  className?: string
  variant?: 'header' | 'footer'
}) {
  return (
    <img
      src="/bilago-logo.png"
      alt="Bilago — Enkelt regnskab. Fuldt overblik."
      width={240}
      height={44}
      className={clsx(
        'h-auto w-auto object-contain object-left',
        variant === 'header' && 'h-7 max-w-[min(100%,240px)] sm:h-8',
        variant === 'footer' && 'h-8 max-w-[min(100%,280px)] sm:h-9',
        className,
      )}
    />
  )
}
