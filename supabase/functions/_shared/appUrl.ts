/**
 * Base-URL til frontend (redirects efter Stripe, bank-oauth, links i mails).
 * Sæt mindst én af disse i Supabase → Edge Functions → Secrets (produktion):
 *   APP_URL, APP_PUBLIC_URL eller SITE_URL = https://bilago.dk
 * Rækkefølge matcher typisk naming på tværs af funktioner.
 */
export function resolveAppPublicUrl(): string {
  return (
    Deno.env.get('APP_URL')?.trim() ||
    Deno.env.get('APP_PUBLIC_URL')?.trim() ||
    Deno.env.get('SITE_URL')?.trim() ||
    'https://bilago.dk'
  ).replace(/\/$/, '')
}
