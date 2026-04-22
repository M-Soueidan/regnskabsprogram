/**
 * Afspejler `src/lib/landingSeo.ts` (til Netlify Edge — kører i Deno, ikke Vite-bundl).
 * Hold defaults og nøgler i sync ved ændringer.
 */
export type LandingSeoSettings = {
  document_title: string
  meta_description: string
  meta_keywords: string
  og_title: string
  og_description: string
  og_image_url: string
  og_type: string
  og_site_name: string
  twitter_card: string
  canonical_url: string
  robots: string
  theme_color: string
  json_ld: string
}

const DEFAULT: LandingSeoSettings = {
  document_title: 'Bilago — dansk regnskab for SMB',
  meta_description:
    'Bilago samler fakturering, bilag og bank-afstemning for danske virksomheder — med CVR-opslag, moms og bogføringslov.',
  meta_keywords:
    'regnskab, faktura, bilag, bogføring, Danmark, SMB, moms, CVR, bogføringslov',
  og_title: 'Bilago — regnskab uden bøvl',
  og_description: 'Fakturering, bilag og bank ét sted. Bygget til danske virksomheder.',
  og_image_url: 'https://bilago.dk/og-image.png',
  og_type: 'website',
  og_site_name: 'Bilago',
  twitter_card: 'summary_large_image',
  canonical_url: 'https://bilago.dk/',
  robots: 'index, follow',
  theme_color: '#4f46e5',
  json_ld: '',
}

export function mergeLandingSeo(raw: unknown): LandingSeoSettings {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const str = (k: keyof LandingSeoSettings, fallback: string) => {
    const v = o[k as string]
    return typeof v === 'string' ? v : fallback
  }
  return {
    document_title: str('document_title', DEFAULT.document_title),
    meta_description: str('meta_description', DEFAULT.meta_description),
    meta_keywords: str('meta_keywords', DEFAULT.meta_keywords),
    og_title: str('og_title', DEFAULT.og_title),
    og_description: str('og_description', DEFAULT.og_description),
    og_image_url: str('og_image_url', DEFAULT.og_image_url),
    og_type: str('og_type', DEFAULT.og_type),
    og_site_name: str('og_site_name', DEFAULT.og_site_name),
    twitter_card: str('twitter_card', DEFAULT.twitter_card),
    canonical_url: str('canonical_url', DEFAULT.canonical_url),
    robots: str('robots', DEFAULT.robots),
    theme_color: str('theme_color', DEFAULT.theme_color),
    json_ld: str('json_ld', DEFAULT.json_ld),
  }
}
