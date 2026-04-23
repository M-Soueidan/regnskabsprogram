import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { MarketingShell } from '@/components/MarketingShell'
import { CheckIcon } from '@/marketing/MarketingIcons'
import { getFeatureCard, marketingFeatureCards } from '@/marketing/featureCards'
import { getFeatureDetail } from '@/marketing/featureDetails'

const MARK = 'data-bilago-feature-seo'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(
    `meta[${attr}="${key}"][${MARK}]`,
  ) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(MARK, '1')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector(
    `link[rel="canonical"][${MARK}]`,
  ) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    el.setAttribute(MARK, '1')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function useFeatureSeo(params: {
  title: string
  description: string
  keywords?: string
  pathname: string
}) {
  const { title, description, keywords, pathname } = params
  useEffect(() => {
    const canonical = `https://bilago.dk${pathname}`
    setMeta('name', 'description', description)
    if (keywords) setMeta('name', 'keywords', keywords)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:type', 'website')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setCanonical(canonical)

    return () => {
      document.head.querySelectorAll(`[${MARK}]`).forEach((n) => n.remove())
    }
  }, [title, description, keywords, pathname])
}

export function FeatureDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const detail = slug ? getFeatureDetail(slug) : null
  const card = slug ? getFeatureCard(slug) : null

  useFeatureSeo({
    title: detail?.seo.title ?? 'Funktion',
    description: detail?.seo.description ?? '',
    keywords: detail?.seo.keywords,
    pathname: `/funktioner/${slug ?? ''}`,
  })

  if (!detail || !card) {
    return <Navigate to="/funktioner" replace />
  }

  const Icon = card.icon
  const related = marketingFeatureCards.filter((c) => c.slug !== card.slug).slice(0, 3)

  return (
    <MarketingShell pageTitle={card.title}>
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-indigo-50/60 via-white to-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <nav aria-label="Brødkrumme" className="text-sm text-slate-500">
            <Link to="/funktioner" className="hover:text-slate-900">
              Funktioner
            </Link>{' '}
            <span className="mx-1 text-slate-400">/</span>{' '}
            <span className="text-slate-700">{card.title}</span>
          </nav>
          <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                {detail.eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                {detail.headline}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">{detail.intro}</p>
              {card.comingSoon ? (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                  Kommer snart · Skriv dig op til vi åbner
                </div>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Prøv gratis i 30 dage
                </Link>
                <Link
                  to="/priser"
                  className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Se priser
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-slate-200/80">
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-14 w-14" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Sådan hjælper {card.title.toLowerCase()}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Fire grunde til at danske virksomheder vælger Bilago.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {detail.benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CheckIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Split section: bullets + mockup */}
      <section className="border-y border-slate-100 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              {detail.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              I Bilago får du
            </h2>
            <p className="mt-4 text-slate-600">{detail.body}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {detail.bullets.map((l) => (
                <li key={l} className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {detail.mockupLabel}
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {detail.bullets.slice(0, 3).map((l, i) => (
                <li
                  key={l}
                  className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-slate-700">{l}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      i === 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : i === 1
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {i === 0 ? 'Klar' : i === 1 ? 'Aktiv' : 'Tilgængelig'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Ofte stillede spørgsmål
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Kan du ikke finde svaret? Skriv til os via support.
          </p>
        </div>
        <div className="mt-10 space-y-3">
          {detail.faq.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-left text-base font-semibold text-slate-900">
                {f.q}
                <span className="mt-1 text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related features */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Andre funktioner
            </h2>
            <p className="mt-3 text-slate-600">Se hvad mere Bilago kan.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c.slug}
                to={`/funktioner/${c.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
                  {c.comingSoon ? (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                      Snart
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{c.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/funktioner"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Se alle funktioner <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Klar til at komme i gang?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Opret en gratis konto og prøv Bilago i 30 dage — uden kort.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Opret konto
            </Link>
            <Link
              to="/priser"
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Se priser
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
