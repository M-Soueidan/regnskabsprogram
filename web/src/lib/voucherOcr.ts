import { createWorker } from 'tesseract.js'
import { cropCenterRegion } from '@/lib/documentDetect'
import { renderPdfFirstPageToCanvas } from '@/lib/pdfToCanvas'

/**
 * OCR af PDF (første side) eller billede til tekst.
 * PDF: hele siden (fakturaer har ofte total i bunden).
 * Billede: let beskæring som ved kvitteringsfoto.
 */
export async function ocrImageOrPdfFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const isPdf =
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

  let canvas: HTMLCanvasElement
  if (isPdf) {
    canvas = await renderPdfFirstPageToCanvas(file, 2.5)
  } else if (file.type.startsWith('image/')) {
    const img = new Image()
    const url = URL.createObjectURL(file)
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Billede kunne ikke læses'))
        img.src = url
      })
      canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas')
      ctx.drawImage(img, 0, 0)
    } finally {
      URL.revokeObjectURL(url)
    }
  } else {
    throw new Error('OCR understøtter PDF og billeder (jpeg, png, …).')
  }

  const worker = await createWorker('dan+eng', undefined, {
    logger: (m) => {
      if (m.status === 'recognizing text' && m.progress != null) {
        onProgress?.(Math.round(m.progress * 100))
      }
    },
  })
  try {
    const source = isPdf ? canvas : cropCenterRegion(canvas, 0.06)
    const { data } = await worker.recognize(source)
    return data.text
  } finally {
    await worker.terminate()
  }
}
