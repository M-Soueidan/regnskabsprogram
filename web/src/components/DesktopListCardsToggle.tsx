import type { ListViewMode } from '@/hooks/useDesktopListViewPreference'

type Props = {
  mode: ListViewMode
  onChange: (mode: ListViewMode) => void
  listLabel?: string
  cardsLabel?: string
}

export function DesktopListCardsToggle({
  mode,
  onChange,
  listLabel = 'Liste',
  cardsLabel = 'Kort',
}: Props) {
  return (
    <div
      className="hidden md:inline-flex rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 text-sm font-medium shadow-sm"
      role="group"
      aria-label="Visning"
    >
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`rounded-md px-3 py-1.5 transition ${
          mode === 'list'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={mode === 'list'}
      >
        {listLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange('cards')}
        className={`rounded-md px-3 py-1.5 transition ${
          mode === 'cards'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={mode === 'cards'}
      >
        {cardsLabel}
      </button>
    </div>
  )
}
