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
  icon: ComponentType<{ className?: string }>
  title: string
  desc: string
}

/** Kernefunktioner — vist på forsiden (første fire) og udvidet på /funktioner. */
export const marketingFeatureCards: FeatureCard[] = [
  {
    icon: InvoiceIcon,
    title: 'Fakturering',
    desc: 'Opret og send professionelle fakturaer med moms, EAN og fortløbende numre på få sekunder.',
  },
  {
    icon: ReceiptIcon,
    title: 'Bilag',
    desc: 'Upload kvitteringer og bilag, og hold styr på dine udgifter pr. konto uden bøvl.',
  },
  {
    icon: BankIcon,
    title: 'Bank-afstemning',
    desc: 'Importér kontoudtog og match automatisk mod fakturaer og bilag — uden fejl.',
  },
  {
    icon: SearchIcon,
    title: 'CVR-opslag',
    desc: 'Slå kunder op via CVR-nummer og få navn, adresse og data automatisk udfyldt.',
  },
  {
    icon: PercentIcon,
    title: 'Moms & rapporter',
    desc: 'Automatisk momsberegning og oversigt over salgsmoms og fradrag — klar til dit momsafregning.',
  },
  {
    icon: UsersIcon,
    title: 'Medlemmer & roller',
    desc: 'Invitér bogholder eller partner og styr hvem der må se hvad i virksomheden.',
  },
]
