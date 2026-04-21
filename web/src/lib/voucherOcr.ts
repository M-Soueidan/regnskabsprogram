import { createWorker } from 'tesseract.js'
import { cropCenterRegion, downscaleToCanvas } from '@/lib/documentDetect'
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
    const runRecognize = async (source: HTMLCanvasElement) => {
      const { data } = await worker.recognize(source)
      return data.text
    }

    if (isPdf) {
      const scaled = downscaleToCanvas(canvas, 2400, 2400)
      return await runRecognize(scaled)
    }

    /* Billede: start med midterudsnit (kvittering i ramme); hvis næsten ingen tekst, prøv hele billedet. */
    const cropped = cropCenterRegion(canvas, 0.06)
    let text = await runRecognize(cropped)
    if (text.trim().length < 40) {
      const full = downscaleToCanvas(canvas, 2400, 2400)
      const fallback = await runRecognize(full)
      if (fallback.trim().length > text.trim().length) {
        text = fallback
      }
    }
    return text
  } finally {
    await worker.terminate()
  }
}
