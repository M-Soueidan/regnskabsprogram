import clsx from 'clsx'
import type { ColumnSortDir } from '@/lib/tableSort'

export function SortableTh({
  label,
  isActive,
  direction,
  onClick,
  align = 'left',
  className,
}: {
  label: string
  isActive: boolean
  direction: ColumnSortDir | null
  onClick: () => void
  align?: 'left' | 'right'
  className?: string
}) {
  return (
    <th
      scope="col"
      className={clsx(
        'px-4 py-3',
        align === 'right' && 'text-right',
        className,
      )}
      aria-sort={
        isActive
          ? direction === 'asc'
            ? 'ascending'
            : 'descending'
          : undefined
      }
    >
      <button
        type="button"
        onClick={onClick}
        className={clsx(
          'inline-flex max-w-full items-center gap-1 rounded-md py-0.5 font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
          align === 'right' ? 'ml-auto justify-end' : '',
        )}
      >
        <span className="min-w-0 truncate">{label}</span>
        <span
          className={clsx(
            'inline-flex h-4 w-4 shrink-0 items-center justify-center text-[10px] font-bold leading-none',
            isActive ? 'text-indigo-600' : 'text-slate-300',
          )}
          aria-hidden
        >
          {isActive ? (direction === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  )
}
