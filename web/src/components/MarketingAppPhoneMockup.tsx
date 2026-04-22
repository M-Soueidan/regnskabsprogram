import type { ReactNode } from 'react'
import { SearchIcon } from '@/marketing/MarketingIcons'

export type AppPhoneVariant = 'home' | 'invoices' | 'pricing' | 'faq' | 'support'

/** Fælles mock — matcher mobilappen (lilla top, prøvebanner, bund-navigation). */
function StatusBar() {
  return (
    <div className="flex items-center justify-between bg-indigo-600 px-3 py-1.5 text-[10px] font-medium text-white">
      <span>9.41</span>
      <div className="flex items-center gap-1.5 opacity-90" aria-hidden>
        <span className="inline-flex h-2.5 items-end gap-0.5">
          <span className="h-1 w-0.5 rounded-sm bg-white/50" />
          <span className="h-1.5 w-0.5 rounded-sm bg-white/60" />
          <span className="h-2 w-0.5 rounded-sm bg-white/80" />
        </span>
        <span>68%</span>
      </div>
    </div>
  )
}

function AppHeader({ company }: { company: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-white px-2.5 py-2">
      <div className="flex min-w-0 flex-1 items-center justify-between gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-900">
        <span className="truncate">{company}</span>
        <span className="shrink-0 text-slate-400" aria-hidden>
          ▾
        </span>
      </div>
      <span className="shrink-0 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-700">
        Log ud
      </span>
    </div>
  )
}

function TrialBanner({ daysLeft, cta = 'Tilføj betaling' }: { daysLeft: number; cta?: string }) {
  return (
    <div className="border-b border-indigo-100/50 bg-indigo-50/95 px-2.5 py-2.5">
      <p className="text-[10px] leading-relaxed text-slate-700">
        Gratis prøveperiode — <span className="font-semibold">{daysLeft} dage</span> tilbage. Tilføj
        betaling for at fortsætte efter perioden slutter.
      </p>
      <div className="mt-2 w-full rounded-lg bg-indigo-600 py-1.5 text-center text-[11px] font-semibold text-white">
        {cta}
      </div>
    </div>
  )
}

function NavDot({
  label,
  active,
  narrow,
}: {
  label: string
  active?: boolean
  narrow?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center gap-0.5 ${narrow ? 'w-[52px]' : 'w-14'}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-indigo-600' : 'bg-slate-300'}`}
        aria-hidden
      />
      <span
        className={`text-[9px] font-medium ${active ? 'text-indigo-600' : 'text-slate-500'}`}
      >
        {label}
      </span>
    </div>
  )
}

function BottomNav({ activeTab }: { activeTab: 'overblik' | 'fakturaer' | 'bilag' | 'mere' }) {
  return (
    <div className="border-t border-slate-100 bg-white pb-1.5 pt-0.5">
      <div className="flex items-end justify-between px-1">
        <NavDot label="Overblik" active={activeTab === 'overblik'} />
        <NavDot label="Fakturaer" active={activeTab === 'fakturaer'} />
        <div className="relative -top-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-light leading-none text-white shadow-md">
          +
        </div>
        <NavDot label="Bilag" active={activeTab === 'bilag'} narrow />
        <NavDot label="Mere" active={activeTab === 'mere'} />
      </div>
      <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-slate-200" aria-hidden />
    </div>
  )
}

function PhoneChrome({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[min(100%,300px)]">
      <div className="rounded-[2.25rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl shadow-slate-900/25">
        <div className="overflow-hidden rounded-[1.6rem] bg-white">{children}</div>
      </div>
    </div>
  )
}

/* ——— Indhold: forskellige sider, andre tal end reference-screenshots ——— */

function ScreenInvoices() {
  return (
    <div className="bg-slate-50/80">
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 px-3 py-2.5">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Fakturaer</h1>
          <p className="text-[9px] text-slate-500">Opret, send og følg betaling</p>
        </div>
        <span className="shrink-0 rounded-lg bg-indigo-600 px-2 py-1 text-[9px] font-semibold text-white">
          Ny faktura
        </span>
      </div>
      <div className="p-3">
        <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-indigo-600">000042</span>
            <span className="text-sm font-semibold text-slate-900">9.200,00 kr.</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-800">Jensen IT ApS</p>
          <div className="mt-2 flex items-center justify-between text-[9px] text-slate-500">
            <span>18. apr. 2026</span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
              Sendt
            </span>
          </div>
        </div>
        <p className="mt-2 text-center text-[9px] text-slate-400">+ flere fakturaer i appen</p>
      </div>
    </div>
  )
}

function ScreenHome() {
  const cards = [
    {
      t: 'Udestående (sendt)',
      v: '8.420,00 kr.',
      s: 'Ikke betalt',
    },
    { t: 'Moms (denne måned)', v: '2.105,00 kr.', s: 'Fra fakturalinjer' },
    { t: 'Fakturaer (30 d)', v: '7' },
    { t: 'Bilag i alt', v: '12' },
  ] as const
  return (
    <div className="bg-slate-50/80">
      <div className="px-3 pt-3 pb-2">
        <h1 className="text-lg font-semibold text-slate-900">Oversigt</h1>
        <p className="mt-0.5 text-[10px] text-slate-500">Fakturaer, bilag og moms — sidste 30 dage</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {cards.map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm"
            >
              <p className="text-[8px] font-medium uppercase leading-tight tracking-wide text-slate-500">
                {c.t}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{c.v}</p>
              {'s' in c && c.s ? (
                <p className="mt-0.5 text-[9px] text-slate-500">{c.s}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScreenPricing() {
  return (
    <div className="space-y-3 bg-slate-50/80 px-3 py-3">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Abonnement</h1>
        <p className="mt-0.5 text-[10px] text-slate-500">Ét produkt — ingen skjulte moduler</p>
      </div>
      <div className="rounded-2xl border border-indigo-100 bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-medium uppercase text-slate-500">Nuværende</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-800">
            Aktiv
          </span>
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-900">79 kr.</p>
        <p className="text-[10px] text-slate-500">pr. måned · kampagnepris (herefter 99 kr.)</p>
        <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-[10px] text-slate-600">
          <p>
            Næste korttræk: <span className="font-medium text-slate-800">3. maj 2026</span>
          </p>
          <p>Alle funktioner inkluderet — faktura, bilag, bank, moms.</p>
        </div>
        <div className="mt-3 rounded-lg bg-indigo-50 px-2 py-2 text-[9px] text-slate-600">
          Sammenligning: listepris 99 kr./md — du spar 20 kr. i prøveperioden.
        </div>
      </div>
    </div>
  )
}

function ScreenFaq() {
  return (
    <div className="space-y-3 bg-slate-50/80 px-3 py-3">
      <h1 className="text-lg font-semibold text-slate-900">Hjælp</h1>
      <p className="text-[10px] text-slate-500">Svar på binding, moms og EAN</p>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[10px] text-slate-500">
        <SearchIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        Søg i emner…
      </div>
      <div className="space-y-2">
        {['Opsigelse & faktura', 'Bogføringsloven kort', 'CVR & kunder', 'Byt fra andet system'].map(
          (t) => (
            <div
              key={t}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-2.5 py-2 text-[10px] font-medium text-slate-800"
            >
              {t}
              <span className="text-slate-300" aria-hidden>
                ›
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  )
}

function ScreenSupport() {
  return (
    <div className="min-h-[220px] space-y-2.5 bg-slate-50/80 px-2.5 py-3">
      <h1 className="px-0.5 text-lg font-semibold text-slate-900">Support</h1>
      <p className="px-0.5 text-[9px] text-slate-500">Sag #2841 · fortsat i appen</p>
      <div className="flex gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-700">
          B
        </span>
        <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-2.5 py-1.5 text-[10px] leading-snug text-slate-800 shadow-sm">
          Hej! Vi kigger på EAN-feltet på din seneste faktura — 5 min.
        </div>
      </div>
      <div className="flex justify-end">
        <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-indigo-600 px-2.5 py-1.5 text-[10px] text-white">
          Super — så venter jeg. /Mikkel
        </div>
      </div>
      <p className="pt-1 text-center text-[9px] text-slate-400">Dansk support · svar i åbningstid</p>
    </div>
  )
}

const companyByVariant: Record<AppPhoneVariant, string> = {
  home: 'Havn & Co. ApS',
  invoices: 'Havn & Co. ApS',
  pricing: 'Café Hygge I/S',
  faq: 'Nordlys Studio ApS',
  support: 'Byg Mester ApS',
}

const trialDaysByVariant: Record<AppPhoneVariant, number> = {
  home: 30,
  invoices: 30,
  pricing: 12,
  faq: 21,
  support: 18,
}

const navByVariant: Record<AppPhoneVariant, 'overblik' | 'fakturaer' | 'bilag' | 'mere'> = {
  home: 'overblik',
  invoices: 'fakturaer',
  pricing: 'mere',
  faq: 'mere',
  support: 'mere',
}

/**
 * Mobil-app i samme stil som den rigtige PWA (lilla top, prøvebanner, bundmenu).
 * Bruges på forside + marketing med unikke tal og virksomhedsnavne pr. `variant`.
 */
export function MarketingAppPhoneFrame({ variant }: { variant: AppPhoneVariant }) {
  const company = companyByVariant[variant]
  return (
    <PhoneChrome>
      <div className="flex min-h-0 flex-col">
        <StatusBar />
        <AppHeader company={company} />
        <TrialBanner daysLeft={trialDaysByVariant[variant]} />
        <div className="min-h-0 flex-1 overflow-hidden">
          {variant === 'home' ? <ScreenHome /> : null}
          {variant === 'invoices' ? <ScreenInvoices /> : null}
          {variant === 'pricing' ? <ScreenPricing /> : null}
          {variant === 'faq' ? <ScreenFaq /> : null}
          {variant === 'support' ? <ScreenSupport /> : null}
        </div>
        <BottomNav activeTab={navByVariant[variant]} />
      </div>
    </PhoneChrome>
  )
}
