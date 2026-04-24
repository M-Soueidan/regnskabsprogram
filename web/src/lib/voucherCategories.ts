export const VOUCHER_CATEGORY_OPTIONS = [
  'Mad og drikke',
  'Transport',
  'Materialer',
  'Lokaleleje',
  'Administration',
  'Gebyrer',
  'Marketing',
  'IT og software',
  'Telefon og internet',
  'Forsikring',
  'Rejse og ophold',
  'Andet',
] as const

const CATEGORY_KEYWORDS: Array<{ category: string; keywords: string[] }> = [
  {
    category: 'Mad og drikke',
    keywords: ['rema', 'netto', 'foetex', 'føtex', 'bilka', 'lidl', 'aldi', 'meny', 'spar', '365discount', 'dagli', 'coop', 'restaurant', 'cafe', 'kaffe', 'mad', 'pizza', 'bager'],
  },
  {
    category: 'Transport',
    keywords: ['dsb', 'rejsekort', 'taxa', 'taxi', 'bus', 'tog', 'metro', 'parkering', 'benzin', 'diesel', 'ok ', 'circle k', 'q8', 'uno-x', 'shell'],
  },
  {
    category: 'Materialer',
    keywords: ['bauhaus', 'jem og fix', 'silvan', 'xl-byg', 'byggemarked', 'materialer', 'værktøj', 'vaerktoej', 'papir', 'print', 'kontor'],
  },
  {
    category: 'Lokaleleje',
    keywords: ['lokale', 'hytte', 'leje', 'hal', 'hotel', 'booking', 'airbnb', 'møde', 'moede'],
  },
  {
    category: 'Administration',
    keywords: ['postnord', 'porto', 'gebyr', 'administration', 'kontingent', 'abonnement'],
  },
  {
    category: 'Gebyrer',
    keywords: ['bankgebyr', 'rykker', 'rente', 'kortgebyr', 'betalingsgebyr', 'gebyr'],
  },
  {
    category: 'Marketing',
    keywords: ['facebook', 'meta', 'google ads', 'annonce', 'marketing', 'reklame', 'print reklame'],
  },
  {
    category: 'IT og software',
    keywords: ['github', 'openai', 'figma', 'adobe', 'microsoft', 'google workspace', 'software', 'hosting', 'webhotel', 'domæne', 'domaene'],
  },
  {
    category: 'Telefon og internet',
    keywords: ['telenor', 'telia', 'yousee', 'tdc', '3 mobil', 'internet', 'mobil', 'telefon'],
  },
  {
    category: 'Forsikring',
    keywords: ['forsikring', 'tryg', 'topdanmark', 'if forsikring', 'alm brand'],
  },
  {
    category: 'Rejse og ophold',
    keywords: ['hotel', 'hostel', 'fly', 'sas', 'norwegian', 'ryanair', 'rejse', 'ophold'],
  },
]

export function inferVoucherCategory(input: string): string | null {
  const haystack = input.toLowerCase()
  for (const item of CATEGORY_KEYWORDS) {
    if (item.keywords.some((keyword) => haystack.includes(keyword))) {
      return item.category
    }
  }
  return null
}
