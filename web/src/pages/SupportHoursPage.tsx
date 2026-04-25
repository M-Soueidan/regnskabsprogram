import { useEffect, useState } from 'react'
import { MarketingProductVisual } from '@/components/MarketingProductVisual'
import { MarketingSplitSection } from '@/components/MarketingSplitSection'
import { MarketingFooter } from '@/components/MarketingFooter'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingMobileBottomNav } from '@/components/MarketingMobileBottomNav'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type PublicSettings = Database['public']['Tables']['platform_public_settings']['Row']

export function SupportHoursPage() {
  const [pub, setPub] = useState<PublicSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    void supabase
      .from('platform_public_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        setPub(data ?? null)
        setLoading(false)
      })
  }, [])

  const hours = pub?.support_hours?.trim()
  const hasContact = Boolean(pub?.contact_email || pub?.contact_phone)

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <MarketingHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-0 pb-16 sm:px-0">
        <MarketingSplitSection
          withHeroGradient
          withMarketingSurface={false}
          left={
            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Kundeservice
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Support og åbningstider
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                  Her finder du vores telefontider og direkte kontaktoplysninger. Svartid på e-mail
                  afhænger af henvendelsens omfang; vi bestræber os på at svare inden for
                  åbningstiderne.
                </p>
              </div>
              <div className="border-t border-slate-200/80 pt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  I produktet
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  Dansk support i tråd
                </h2>
                <p className="mt-2 max-w-xl text-base text-slate-600">
                  Sådan ser en typisk support-samtale ud for kunder, der allerede bruger Bilago.
                </p>
              </div>
            </div>
          }
          right={<MarketingProductVisual variant="support" />}
        />

        {loading ? (
          <div className="mt-12 flex items-center gap-3 px-5 text-sm text-slate-500 sm:px-6">
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"
              aria-hidden
            />
            Indlæser oplysninger…
          </div>
        ) : (
          <div className="mt-12 grid gap-6 px-5 sm:px-6 lg:grid-cols-2 lg:items-stretch">
            <article className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <ClockIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-slate-900">Åbningstider</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Telefon og hurtig henvendelse
                  </p>
                </div>
              </div>
              <div className="mt-6 flex-1 border-t border-slate-100 pt-6">
                {hours ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                    {hours}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-600">
                    Vi har ikke offentliggjort faste telefon-tider endnu. Skriv på e-mail eller
                    ring — vi vender tilbage så hurtigt som muligt.
                  </p>
                )}
              </div>
            </article>

            <article className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <HeadsetIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-slate-900">Kontakt</h2>
                  <p className="mt-1 text-sm text-slate-500">Skriv eller ring til os</p>
                </div>
              </div>
              <div className="mt-6 flex-1 border-t border-slate-100 pt-6">
                {hasContact ? (
                  <ul className="space-y-5">
                    {pub?.contact_email ? (
                      <li className="flex gap-4">
                        <span className="mt-0.5 text-slate-400" aria-hidden>
                          <MailIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            E-mail
                          </div>
                          <a
                            href={`mailto:${pub.contact_email}`}
                            className="mt-1 inline-block text-base font-medium text-indigo-700 underline-offset-2 hover:text-indigo-900 hover:underline"
                          >
                            {pub.contact_email}
                          </a>
                        </div>
                      </li>
                    ) : null}
                    {pub?.contact_phone ? (
                      <li className="flex gap-4">
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center text-slate-400" aria-hidden>
                          <PhoneIcon className="h-[18px] w-[18px]" />
                        </span>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Telefon
                          </div>
                          <a
                            href={`tel:${pub.contact_phone.replace(/\s/g, '')}`}
                            className="mt-1 inline-block text-base font-medium text-indigo-700 underline-offset-2 hover:text-indigo-900 hover:underline"
                          >
                            {pub.contact_phone}
                          </a>
                        </div>
                      </li>
                    ) : null}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-600">
                    Kontaktoplysninger opdateres snarest. Opret en konto og brug support i appen,
                    eller skriv til os via de kanaler, der fremgår af din velkomstmail.
                  </p>
                )}
              </div>
            </article>
          </div>
        )}

      </main>

      <MarketingFooter pub={pub} />
      <MarketingMobileBottomNav />
    </div>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeadsetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12a8 8 0 0 1 16 0" />
      <path d="M4 12v3a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2Z" />
      <path d="M20 12v3a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2Z" />
      <path d="M17 17v1a3 3 0 0 1-3 3h-2" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 6h16v12H4z" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"
      />
    </svg>
  )
}
