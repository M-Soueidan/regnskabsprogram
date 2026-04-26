/**
 * Sletter halvfærdige signup-brugere fra Bilagos SMTP-signup-flow.
 *
 * Kald funktionen planlagt, fx hvert 5. minut, med header:
 * x-bilago-signup-cleanup: SIGNUP_CLEANUP_SECRET
 */
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const HEADER_NAME = 'x-bilago-signup-cleanup'
const MAX_AGE_MS = 5 * 60 * 1000
const PAGE_SIZE = 1000

type AuthUser = {
  id: string
  email?: string
  created_at?: string
  user_metadata?: Record<string, unknown>
}

function isOldEnough(user: AuthUser, nowMs: number): boolean {
  const createdMs = user.created_at ? Date.parse(user.created_at) : Number.NaN
  return Number.isFinite(createdMs) && nowMs - createdMs >= MAX_AGE_MS
}

function isBilagoSignupFlow(user: AuthUser): boolean {
  return user.user_metadata?.signup_flow === 'bilago_smtp_signup'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const expected = Deno.env.get('SIGNUP_CLEANUP_SECRET')?.trim()
  const got = req.headers.get(HEADER_NAME)?.trim()
  if (!expected || got !== expected) {
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const admin = createClient(supabaseUrl, serviceKey)
  const nowMs = Date.now()

  let page = 1
  let scanned = 0
  let deleted = 0
  const errors: string[] = []

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: PAGE_SIZE,
    })
    if (error) {
      return jsonResponse({ error: `listUsers failed: ${error.message}` }, 500)
    }

    const users = ((data?.users ?? []) as AuthUser[]).filter(
      (user) => isBilagoSignupFlow(user) && isOldEnough(user, nowMs),
    )
    scanned += data?.users?.length ?? 0

    if (users.length > 0) {
      const ids = users.map((user) => user.id)
      const [{ data: memberships, error: memberErr }, { data: staffRows, error: staffErr }] =
        await Promise.all([
          admin.from('company_members').select('user_id').in('user_id', ids),
          admin.from('platform_staff').select('user_id').in('user_id', ids),
        ])

      if (memberErr) {
        return jsonResponse({ error: `company_members lookup failed: ${memberErr.message}` }, 500)
      }
      if (staffErr) {
        return jsonResponse({ error: `platform_staff lookup failed: ${staffErr.message}` }, 500)
      }

      const protectedIds = new Set<string>([
        ...((memberships ?? []) as { user_id: string }[]).map((row) => row.user_id),
        ...((staffRows ?? []) as { user_id: string }[]).map((row) => row.user_id),
      ])

      for (const user of users) {
        if (protectedIds.has(user.id)) continue
        const { error: deleteErr } = await admin.auth.admin.deleteUser(user.id)
        if (deleteErr) {
          errors.push(`${user.email ?? user.id}: ${deleteErr.message}`)
        } else {
          deleted += 1
        }
      }
    }

    if ((data?.users?.length ?? 0) < PAGE_SIZE) break
    page += 1
  }

  return jsonResponse({ ok: true, scanned, deleted, errors })
})
