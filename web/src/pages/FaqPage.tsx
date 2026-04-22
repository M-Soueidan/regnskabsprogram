import { Link } from 'react-router-dom'
import { MarketingProductVisual } from '@/components/MarketingProductVisual'
import { MarketingShell } from '@/components/MarketingShell'
import { MarketingSplitSection } from '@/components/MarketingSplitSection'
import { marketingFaqs } from '@/marketing/marketingData'

export function FaqPage() {
  return (
    <MarketingShell pageTitle="FAQ">
      <MarketingSplitSection
        withHeroGradient
        withMarketingSurface={false}
        left={
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Hjælp & svar
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Ofte stillede spørgsmål
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                Find hurtigt svar om pris, binding, bogføringsloven og skift fra andre systemer.
                Finder du ikke det du leder efter, er du velkommen til at skrive via support.
              </p>
            </div>
            <div className="border-t border-slate-200/80 pt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                I produktet
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Sådan ser hjælpen ud
              </h2>
              <p className="mt-2 max-w-xl text-base text-slate-600">
                Søg og emner i samme mønster som forsiden — nedenfor er de fulde svar.
              </p>
            </div>
          </div>
        }
        right={<MarketingProductVisual variant="faq" />}
      />

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {marketingFaqs.map((f) => (
            <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-900">
                {f.q}
                <span className="ml-4 shrink-0 text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-8 text-center sm:p-10">
          <p className="text-sm font-medium text-slate-900">Klar til at prøve Bilago?</p>
          <p className="mt-2 text-sm text-slate-600">30 dage gratis — ingen kort påkrævet.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Opret konto
            </Link>
            <Link
              to="/priser"
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Se priser
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
