import clsx from 'clsx'

type SpinnerSize = 'sm' | 'md' | 'lg'

const spinnerSizeClass: Record<SpinnerSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

/** Animeret indigo-spinner (kun visuelt — brug `srLabel` på forælder eller `LoadingCentered`). */
export function LoadingSpinner({
  size = 'md',
  className,
}: {
  size?: SpinnerSize
  className?: string
}) {
  return (
    <svg
      className={clsx(
        'animate-spin text-indigo-600 drop-shadow-[0_0_12px_rgba(79,70,229,0.28)]',
        spinnerSizeClass[size],
        className,
      )}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        className="opacity-[0.22]"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        className="opacity-95"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/** Centreret spinner til helsides eller indholds-loading. */
export function LoadingCentered({
  className,
  minHeight = 'min-h-screen',
  size = 'lg',
  caption,
  srLabel = 'Indlæser',
}: {
  className?: string
  /** `false` = ingen min-højde (fx i små kort). */
  minHeight?: string | false
  size?: SpinnerSize
  /** Valgfri synlig undertekst under spinneren. */
  caption?: string
  srLabel?: string
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'flex flex-col items-center justify-center gap-4',
        minHeight === false ? '' : minHeight,
        className,
      )}
    >
      <span className="sr-only">{srLabel}</span>
      <LoadingSpinner size={size} />
      {caption ? <p className="max-w-xs text-center text-sm text-slate-500">{caption}</p> : null}
    </div>
  )
}
