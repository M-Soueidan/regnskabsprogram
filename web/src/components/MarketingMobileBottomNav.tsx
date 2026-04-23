import { useState, type ReactElement } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

type IconProps = { className?: string }

/** Ekstra bund-padding på marketing-footer under `md`, så sidste links ikke skjules bag den faste menu. */
export const marketingMobileNavFooterPad =
  'max-md:pb-[calc(5.25rem+env(safe-area-inset-bottom))]'

function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}

function PriceIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function FaqIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function MoreIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="5" cy="12" r="0.5" />
      <circle cx="12" cy="12" r="0.5" />
      <circle cx="19" cy="12" r="0.5" />
    </svg>
  )
}

function PercentIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 19 14-14" />
      <circle cx="7" cy="7" r="2.2" />
      <circle cx="17" cy="17" r="2.2" />
    </svg>
  )
}

function HeadsetIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 14v1a4 4 0 0 0 4 4h1" />
      <path d="M20 14v1a4 4 0 0 1-4 4h-1" />
      <path d="M6 14h-.5A2.5 2.5 0 0 1 3 11.5V10a9 9 0 0 1 18 0v1.5A2.5 2.5 0 0 1 18.5 14H18" />
    </svg>
  )
}

function DocumentIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}

const mainTabs: readonly {
  to: string
  label: string
  icon: (p: IconProps) => ReactElement
  end?: boolean
}[] = [
  { to: '/', label: 'Forside', icon: HomeIcon, end: true },
  { to: '/priser', label: 'Priser', icon: PriceIcon },
  { to: '/faq', label: 'FAQ', icon: FaqIcon },
]

function TabLink({
  to,
  label,
  Icon,
  end,
}: {
  to: string
  label: string
  Icon: (p: IconProps) => ReactElement
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={Boolean(end)}
      className={({ isActive }) =>
        clsx(
          'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium',
          isActive ? 'text-indigo-700' : 'text-slate-500',
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  )
}

export function MarketingMobileBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const navigate = useNavigate()

  function go(path: string) {
    setSheetOpen(false)
    navigate(path)
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 md:hidden">
        <nav
          className="pointer-events-auto flex items-stretch border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
          aria-label="Hovedmenu"
        >
          {mainTabs.map((t) => (
            <TabLink key={t.to} to={t.to} label={t.label} Icon={t.icon} end={t.end} />
          ))}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={clsx(
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium',
              sheetOpen ? 'text-indigo-700' : 'text-slate-500',
            )}
            aria-expanded={sheetOpen}
            aria-controls="marketing-more-sheet"
          >
            <MoreIcon className="h-5 w-5" />
            <span>Mere</span>
          </button>
        </nav>
      </div>

      {sheetOpen ? (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Flere sider" id="marketing-more-sheet">
          <button type="button" aria-label="Luk" className="absolute inset-0 bg-slate-900/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[min(85vh,32rem)] overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-2xl">
            <div className="mx-auto h-1 w-10 rounded-full bg-slate-200" />
            <h2 className="mt-4 text-center text-sm font-semibold text-slate-900">Mere</h2>
            <ul className="mt-4 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => go('/funktioner')}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  <DocumentIcon className="h-5 w-5 shrink-0 text-indigo-600" />
                  Funktioner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('/support-tider')}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  <HeadsetIcon className="h-5 w-5 shrink-0 text-indigo-600" />
                  Support og åbningstider
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('/app/vat')}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  <PercentIcon className="h-5 w-5 shrink-0 text-indigo-600" />
                  Moms (i appen)
                </button>
              </li>
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Juridisk</p>
              <ul className="mt-2 space-y-0.5">
                {(
                  [
                    ['/handelsbetingelser', 'Handelsbetingelser'],
                    ['/privatlivspolitik', 'Privatlivspolitik'],
                    ['/cookiepolitik', 'Cookiepolitik'],
                    ['/databehandleraftale', 'Databehandleraftale'],
                  ] as const
                ).map(([href, label]) => (
                  <li key={href}>
                    <Link
                      to={href}
                      onClick={() => setSheetOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
