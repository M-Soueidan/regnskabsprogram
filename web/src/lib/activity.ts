import { supabase } from '@/lib/supabase'

export async function logActivity(
  companyId: string,
  eventType: string,
  title: string,
  meta?: Record<string, unknown>,
) {
  const { data: sessionData } = await supabase.auth.getSession()
  await supabase.from('activity_events').insert({
    company_id: companyId,
    actor_id: sessionData.session?.user?.id ?? null,
    event_type: eventType,
    title,
    meta: meta ?? null,
  })
}
