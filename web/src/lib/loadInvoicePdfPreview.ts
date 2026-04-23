import { supabase } from '@/lib/supabase'
import { fetchCompanyLogoDataUrl } from '@/lib/invoiceBranding'
import { generateInvoicePdfBlob, type InvoicePdfOptions } from '@/lib/invoicePdf'
import type { Database } from '@/types/database'

type Company = Database['public']['Tables']['companies']['Row']
type Invoice = Database['public']['Tables']['invoices']['Row']
type LineRow = Database['public']['Tables']['invoice_line_items']['Row']

export type InvoicePdfPreviewLoad = {
  mainObjectUrl: string
  invoiceNumber: string
  isCreditNote: boolean
  customerEmail: string | null
  originalPdf: { url: string; invoiceNumber: string; invoiceId: string } | null
}

/**
 * Henter faktura/kreditnota og bygger PDF som object:-URL’er (samme output som download).
 * Bruges af forhåndsvisningssiden og af «Åbn i ny fane» fra fakturadetalje.
 */
export async function loadInvoicePdfPreview(
  company: Company,
  invoiceId: string,
): Promise<InvoicePdfPreviewLoad> {
  const { data: inv, error: e1 } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .eq('company_id', company.id)
    .single()
  if (e1 || !inv) throw new Error('Faktura ikke fundet')

  const { data: li, error: e2 } = await supabase
    .from('invoice_line_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('sort_order', { ascending: true })
  if (e2) throw new Error(e2.message)

  const logo = await fetchCompanyLogoDataUrl(company.invoice_logo_path)

  let originalPdf: InvoicePdfPreviewLoad['originalPdf'] = null
  if (inv.credited_invoice_id) {
    const { data: origInv, error: oe } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', inv.credited_invoice_id)
      .eq('company_id', company.id)
      .maybeSingle()
    if (!oe && origInv) {
      const { data: origLi } = await supabase
        .from('invoice_line_items')
        .select('*')
        .eq('invoice_id', origInv.id)
        .order('sort_order', { ascending: true })
      const origBlob = generateInvoicePdfBlob(
        company,
        origInv as Invoice,
        (origLi ?? []) as LineRow[],
        logo,
      )
      originalPdf = {
        url: URL.createObjectURL(origBlob),
        invoiceNumber: String(origInv.invoice_number ?? '').trim() || '—',
        invoiceId: origInv.id,
      }
    }
  }

  let pdfOptions: InvoicePdfOptions | undefined
  if (inv.credited_invoice_id) {
    const { data: refInv } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('id', inv.credited_invoice_id)
      .maybeSingle()
    pdfOptions = {
      heading: 'Kreditnota',
      creditReferenceLine: refInv?.invoice_number
        ? `Krediterer faktura ${refInv.invoice_number}`
        : 'Kreditnota',
    }
  }

  const blob = generateInvoicePdfBlob(
    company,
    inv as Invoice,
    (li ?? []) as LineRow[],
    logo,
    pdfOptions,
  )

  return {
    mainObjectUrl: URL.createObjectURL(blob),
    invoiceNumber: String(inv.invoice_number ?? '').trim() || '—',
    isCreditNote: Boolean(inv.credited_invoice_id),
    customerEmail: inv.customer_email?.trim() || null,
    originalPdf,
  }
}

/**
 * Åbn tom fane synkront under brugerklik (undgår popup-blokering).
 * Brug **ikke** `noopener` her: så returnerer flere browsere `null`, og ellers kan
 * `location`-navigering til en blob-URL fra åbneren fejle → hvid `about:blank`-fane.
 * Nulstil `opener` på den nye fane efter du har sat `location`.
 */
export function openBlankTabForPdfNavigation(): Window | null {
  try {
    return window.open('about:blank', '_blank')
  } catch {
    return null
  }
}
