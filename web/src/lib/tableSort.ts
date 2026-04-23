export type ColumnSortDir = 'asc' | 'desc'

/** Første klik: synkende. Andet: stigende. Tredje (triState): tilbage til standard (nøgler null). */
export function nextColumnSortState<K extends string>(
  column: K,
  currentKey: K | null,
  currentDir: ColumnSortDir,
  triState: boolean,
): { key: K | null; dir: ColumnSortDir } {
  if (currentKey !== column) return { key: column, dir: 'desc' }
  if (currentDir === 'desc') return { key: column, dir: 'asc' }
  if (triState) return { key: null, dir: 'desc' }
  return { key: column, dir: 'desc' }
}
