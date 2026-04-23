import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BrandLogo } from '@/components/BrandLogo'
import { marketingFeatureCards } from '@/marketing/featureCards'

function navClass(active: boolean) {
  return active ? 'font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900'
}

function ProductDropdown({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-1 ${navClass(active)}`}
      >
        Produkt
        <svg
          className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 8 4 4 4-4" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-3 w-[28rem] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          <ul className="grid grid-cols-2 gap-1">
            {marketingFeatureCards.map((f) => (
              <li key={f.slug}>
                <Link
                  to={`/funktioner/${f.slug}`}
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-indigo-50/60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-900">{f.title}</span>
                      {f.comingSoon ? (
                        <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                          Snart
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                      {f.desc.length > 70 ? `${f.desc.slice(0, 68)}…` : f.desc}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-1 border-t border-slate-100 px-3 py-3">
            <Link
              to="/funktioner"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Se alle funktioner <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function MarketingHeader() {
  const { pathname } = useLocation()
  const productActive = pathname.startsWith('/funktioner')

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-0">
          <BrandLogo variant="header" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <ProductDropdown active={productActive} />
          <Link to="/priser" className={navClass(pathname === '/priser')}>
            Priser
          </Link>
          <Link to="/faq" className={navClass(pathname === '/faq')}>
            FAQ
          </Link>
          <Link
            to="/support-tider"
            className={navClass(pathname === '/support-tider')}
          >
            Support
          </Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/login" className="hidden text-slate-600 hover:text-slate-900 sm:inline">
            Log ind
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Kom i gang
          </Link>
        </div>
      </div>
    </header>
  )
}
