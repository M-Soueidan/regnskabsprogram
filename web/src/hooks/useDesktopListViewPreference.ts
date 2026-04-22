import { useCallback, useEffect, useState } from 'react'

export type ListViewMode = 'list' | 'cards'

/**
 * Liste vs. kort på desktop; mobil bruger altid kort (styres i layout med Tailwind).
 */
export function useDesktopListViewPreference(
  storageKey: string,
  defaultMode: ListViewMode = 'list',
): [ListViewMode, (mode: ListViewMode) => void] {
  const [mode, setModeState] = useState<ListViewMode>(defaultMode)

  useEffect(() => {
    try {
      const v = localStorage.getItem(storageKey)
      if (v === 'list' || v === 'cards') setModeState(v)
    } catch {
      /* ignore */
    }
  }, [storageKey])

  const setMode = useCallback(
    (m: ListViewMode) => {
      setModeState(m)
      try {
        localStorage.setItem(storageKey, m)
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  )

  return [mode, setMode]
}
