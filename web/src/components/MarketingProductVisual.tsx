import {
  MarketingShowcaseBody,
  type MarketingShowcaseVariant,
} from '@/components/MarketingPageMockups'
import { SHOWCASE_FOOTNOTE } from '@/marketing/showcaseMeta'

type MarketingProductVisualProps = {
  variant: MarketingShowcaseVariant
  /** Sæt til false hvis forælder allerede har aria */
  withFootnoteLine?: boolean
  footnoteClassName?: string
  className?: string
}

export function MarketingProductVisual({
  variant,
  withFootnoteLine = true,
  footnoteClassName = 'mt-4 text-left text-xs text-slate-400',
  className = '',
}: MarketingProductVisualProps) {
  const foot = SHOWCASE_FOOTNOTE[variant]
  return (
    <div className={className}>
      <div
        className="lg:sticky lg:top-24"
        role="img"
        aria-label={foot.replace(/^Illustration:\s*/i, '')}
      >
        <MarketingShowcaseBody variant={variant} />
      </div>
      {withFootnoteLine ? <p className={footnoteClassName}>{foot}</p> : null}
    </div>
  )
}
