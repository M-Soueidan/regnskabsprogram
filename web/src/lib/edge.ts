import { supabase } from '@/lib/supabase'

const fnUrl = (name: string) => {
  const base = import.meta.env.VITE_SUPABASE_URL as string
  return `${base}/functions/v1/${name}`
}

export async function startStripeCheckout(companyId: string) {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  if (!token) throw new Error('Ikke logget ind')

  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
  const res = await fetch(fnUrl('stripe-checkout'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anon,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ company_id: companyId }),
  })
  const json = (await res.json()) as { url?: string; error?: string }
  if (!res.ok) throw new Error(json.error ?? 'Checkout fejlede')
  if (!json.url) throw new Error('Manglede Stripe URL')
  return json.url
}

export async function startAiiaOAuth(companyId: string) {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  if (!token) throw new Error('Ikke logget ind')

  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
  const res = await fetch(fnUrl('aiia-oauth-start'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anon,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ company_id: companyId }),
  })
  const json = (await res.json()) as { url?: string; error?: string }
  if (!res.ok) throw new Error(json.error ?? 'Kunne ikke starte bank')
  if (!json.url) throw new Error('Manglede Aiia URL')
  return json.url
}

function smtpTestHelpMessage(cause: string): string {
  const lower = cause.toLowerCase()
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('load failed') ||
    lower.includes('network request failed')
  ) {
    return (
      'Kunne ikke nå SMTP-test på serveren. Ofte fordi Edge Function ikke er deployet endnu — ' +
      'kør: supabase functions deploy smtp-test (fra projektmappen). Tjek også netværk og VITE_SUPABASE_URL.'
    )
  }
  return cause
}

export async function invokeSmtpTest(
  profileId: 'transactional' | 'platform' | 'marketing',
  options?: { testCompanyName?: string },
) {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session?.access_token) {
    throw new Error('Ikke logget ind')
  }

  let data: unknown
  let fnError: { message: string } | null
  try {
    const out = await supabase.functions.invoke('smtp-test', {
      body: {
        profile_id: profileId,
        test_company_name: options?.testCompanyName,
      },
    })
    data = out.data
    fnError = out.error
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    throw new Error(smtpTestHelpMessage(msg))
  }

  if (fnError) {
    throw new Error(smtpTestHelpMessage(fnError.message))
  }

  const body = data as { ok?: boolean; error?: string } | null
  if (body?.error) {
    throw new Error(body.error)
  }
  if (!body?.ok) {
    throw new Error('SMTP-test fejlede')
  }
}
