import { Link } from 'react-router-dom'

const items = [
  {
    to: '/app/settings/general',
    label: 'Generelt',
    body: 'Virksomhedens stamdata, adresse og grundlæggende oplysninger.',
  },
  {
    to: '/app/settings/invoice',
    label: 'Faktura',
    body: 'Fakturaoplysninger, logo, kontonumre og automatiske påmindelser.',
  },
  {
    to: '/app/settings/notifications',
    label: 'Notifikationer',
    body: 'Push-beskeder og valg af hvilke hændelser du vil have besked om.',
  },
  {
    to: '/app/settings/subscription',
    label: 'Abonnement',
    body: 'Status på abonnement, prøveperiode og betaling.',
  },
]

export function SettingsMenuPage() {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40"
        >
          <div>
            <h2 className="text-base font-semibold text-slate-900">{item.label}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.body}</p>
          </div>
          <span className="shrink-0 text-slate-400" aria-hidden>
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m7 4 6 6-6 6" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  )
}
