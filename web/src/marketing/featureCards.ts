import type { ComponentType } from 'react'
import {
  BankIcon,
  InvoiceIcon,
  PercentIcon,
  ReceiptIcon,
  SearchIcon,
  UsersIcon,
} from '@/marketing/MarketingIcons'

export type FeatureCard = {
  slug: string
  icon: ComponentType<{ className?: string }>
  title: string
  desc: string
  /** Vises som badge — bruges når funktionen endnu ikke er klar (fx bank-match, SKAT-indberetning). */
  comingSoon?: boolean
}

/** Kernefunktioner — vist på forsiden (første fire) og udvidet på /funktioner. */
export const marketingFeatureCards: FeatureCard[] = [
  {
    slug: 'fakturering',
    icon: InvoiceIcon,
    title: 'Fakturering',
    desc: 'Opret og send professionelle fakturaer med moms, EAN og fortløbende numre på få sekunder.',
  },
  {
    slug: 'bilag',
    icon: ReceiptIcon,
    title: 'Bilag',
    desc: 'Upload kvitteringer og bilag, og hold styr på dine udgifter pr. konto uden bøvl.',
  },
  {
    slug: 'bank-afstemning',
    icon: BankIcon,
    title: 'Bank-afstemning',
    desc: 'Importér kontoudtog og match automatisk mod fakturaer og bilag — uden fejl.',
    comingSoon: true,
  },
  {
    slug: 'cvr-opslag',
    icon: SearchIcon,
    title: 'CVR-opslag',
    desc: 'Slå kunder op via CVR-nummer og få navn, adresse og data automatisk udfyldt.',
  },
  {
    slug: 'moms-rapporter',
    icon: PercentIcon,
    title: 'Moms & rapporter',
    desc: 'Overblik over salgsmoms og købsmoms pr. periode i appen. Indberetning til SKAT med ét klik direkte fra Bilago kommer snart.',
    comingSoon: true,
  },
  {
    slug: 'medlemmer-roller',
    icon: UsersIcon,
    title: 'Medlemmer & roller',
    desc: 'Invitér bogholder eller partner og styr hvem der må se hvad i virksomheden.',
  },
]

export function getFeatureCard(slug: string): FeatureCard | null {
  return marketingFeatureCards.find((c) => c.slug === slug) ?? null
}
