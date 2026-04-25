import { useEffect, useRef, useState } from 'react'
import { ensurePdfjsWorker, pdfjsLib } from '@/lib/ensurePdfjsWorker'

type Props = {
  pdfUrl: string
  title: string
  className?: string
  /** Kreditnota: lavere max-højde så oprindelig + kredit kan ses oven på hinanden. */
  compactHeight?: boolean
}

/**
 * Faktura-PDF renderet som canvas, så mobil starter med hele siden i bredden.
 * Browserens pinch-zoom er stadig aktiv via touch-action.
 */
export function InvoicePdfCanvasViewer({
  pdfUrl,
  title,
  className = '',
  compactHeight = false,
}: Props) {
  const pagesRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const host = pagesRef.current
    if (!host) return
    const pagesHost = host

    async function renderPdf() {
      setLoading(true)
      setError(null)
      pagesHost.replaceChildren()

      try {
        ensurePdfjsWorker()
        const buffer = await fetch(pdfUrl).then((r) => {
          if (!r.ok) throw new Error('PDF kunne ikke hentes')
          return r.arrayBuffer()
        })
        if (cancelled) return

        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
        const outputScale = Math.min(window.devicePixelRatio || 1, 2.5)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) return
          const page = await pdf.getPage(pageNumber)
          const viewport = page.getViewport({ scale: 2 })
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Canvas ikke tilgængelig')

          canvas.width = Math.floor(viewport.width * outputScale)
          canvas.height = Math.floor(viewport.height * outputScale)
          canvas.style.width = 'min(100%, 920px)'
          canvas.style.height = 'auto'
          canvas.className = 'block bg-white shadow-sm ring-1 ring-slate-300/70'
          canvas.setAttribute('aria-label', `${title} side ${pageNumber}`)

          const pageWrap = document.createElement('div')
          pageWrap.className = 'flex w-full justify-center'
          pageWrap.appendChild(canvas)
          pagesHost.appendChild(pageWrap)

          const renderViewport = page.getViewport({ scale: 2 * outputScale })
          await page.render({ canvasContext: ctx, canvas, viewport: renderViewport }).promise
        }

        if (!cancelled) setLoading(false)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'PDF kunne ikke vises')
          setLoading(false)
        }
      }
    }

    void renderPdf()

    return () => {
      cancelled = true
      pagesHost.replaceChildren()
    }
  }, [pdfUrl, title])

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className}`}>
      <div
        className={
          'relative min-h-0 flex-1 overflow-auto bg-slate-200/50 [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y_pinch-zoom] ' +
          (compactHeight ? 'max-h-[42vh] sm:max-h-[48vh]' : '')
        }
      >
        <div
          ref={pagesRef}
          role="img"
          aria-label={title}
          className="flex min-h-[min(75dvh,52rem)] flex-col gap-3 p-3"
        />
        {loading ? (
          <div className="absolute inset-x-0 top-28 mx-auto w-fit rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            Indlæser PDF…
          </div>
        ) : null}
        {error ? (
          <div className="m-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  )
}
