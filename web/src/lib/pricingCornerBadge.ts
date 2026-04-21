/** Tekst til hjørne-badge på priskort: brugerdefineret, ellers auto «Spar X%». */
export function resolvePricingCornerBadge(options: {
  customCorner: string | null | undefined
  compareCents: number | null | undefined
  amountCents: number
}): string | null {
  const custom = options.customCorner?.trim()
  if (custom) return custom
  const { compareCents, amountCents } = options
  if (
    compareCents != null &&
    compareCents > 0 &&
    amountCents > 0 &&
    compareCents > amountCents
  ) {
    const pct = Math.round((1 - amountCents / compareCents) * 100)
    if (pct > 0) return `Spar ${pct}%`
  }
  return null
}
