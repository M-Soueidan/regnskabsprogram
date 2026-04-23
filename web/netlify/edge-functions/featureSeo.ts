// Pr.-feature SEO til /funktioner/:slug. Spejler src/marketing/featureDetails.ts (seo-feltet).
// Holdes som statisk tabel så edge-funktionen ikke behøver Supabase-opslag pr. request.
// Opdater begge filer når du ændrer tekster.

export type FeatureSeo = {
  title: string
  description: string
  keywords?: string
}

export const FEATURE_SEO: Record<string, FeatureSeo> = {
  fakturering: {
    title: 'Fakturering — dansk fakturaprogram med moms og CVR',
    description:
      'Opret og send danske fakturaer med korrekt moms, forfaldsdato og fortløbende numre. CVR-opslag, PDF, kreditnotaer — bygget til dansk bogføringslov.',
    keywords:
      'fakturering, faktura program, dansk faktura, CVR opslag, moms, fortløbende numre, EAN faktura, kreditnota',
  },
  bilag: {
    title: 'Bilag — digital kvittering og udgiftsbogføring',
    description:
      'Scan kvitteringer og upload PDF-bilag direkte i Bilago. Momsen trækkes automatisk fra, og alt opbevares digitalt efter bogføringsloven.',
    keywords:
      'bilag, kvitteringer, udgiftsbogføring, scan bilag, digital kvittering, bogføringslov, købsmoms',
  },
  'bank-afstemning': {
    title: 'Bank-afstemning — match banken mod fakturaer automatisk',
    description:
      'Importér kontoudtog som CSV fra danske banker og lad Bilago matche linjerne mod dine fakturaer og bilag. Ingen Excel, færre fejl ved månedsafslutning.',
    keywords:
      'bank afstemning, CSV import, danske banker, kontoudtog, bogføring, månedsafslutning, PSD2',
  },
  'cvr-opslag': {
    title: 'CVR-opslag — udfyld kundedata automatisk',
    description:
      'Slå danske kunder op via CVR-nummer og få navn, adresse og status direkte fra Virk.dk. Indbygget gratis i Bilago — klar til fakturering.',
    keywords: 'CVR opslag, Virk.dk, kundeoprettelse, dansk CVR, autoudfyldning, fakturering',
  },
  'moms-rapporter': {
    title: 'Moms og rapporter — dansk momsopgørelse pr. periode',
    description:
      'Salgsmoms, købsmoms og tilsvar pr. periode — med drill-down til de fakturaer og bilag der ligger bag. Eksport klar til SKAT’s Tastselv.',
    keywords:
      'moms, momsopgørelse, salgsmoms, købsmoms, SKAT, Tastselv, dansk moms, momsindberetning',
  },
  'medlemmer-roller': {
    title: 'Medlemmer og roller — invitér bogholder og styr adgang',
    description:
      'Invitér bogholder, revisor eller partner som medlem i din Bilago-virksomhed. Roller og rettigheder sikrer at alle ser præcis det de skal — intet mere.',
    keywords:
      'medlemmer, roller, adgang, bogholder invitation, regnskabssamarbejde, revisor adgang',
  },
}

/** Returnerer feature-slug hvis pathname matcher /funktioner/<slug>, ellers null. */
export function featureSlugFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/funktioner\/([a-z0-9-]+)\/?$/i)
  if (!m) return null
  const slug = m[1].toLowerCase()
  return slug in FEATURE_SEO ? slug : null
}
