// Netlify Edge (Deno). Erstatter <head> SEO/OG så link-forhåndsvisning (Facebook, WhatsApp, m.fl.)
// ser uploadet billede og tekster uden at køre JavaScript.
import { mergeLandingSeo } from './mergeLandingSeo.ts'
import { FEATURE_SEO, featureSlugFromPath } from './featureSeo.ts'
import type { Config, Context } from '@netlify/edge-functions'

function escapeText(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escAttr(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

/** Dækker både én-linje og mønster med linjeskift (som i index.html) */
function replaceMetaBlock(
  html: string,
  attr: 'name' | 'property',
  key: string,
  newContent: string,
): string {
  const ekey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(
    `<meta[\\s\\S]*?${attr}="${ekey}"[\\s\\S]*?content="[^"]*"[\\s\\S]*?\\/?>`,
    'i',
  )
  const compact = `<meta ${attr}="${key}" content="${escAttr(newContent)}" />`
  return html.replace(re, compact)
}

type Seo = ReturnType<typeof mergeLandingSeo>

/**
 * Påvirker både `/` og andre marketing-routes der serveres med samme index.html.
 * Titel, beskrivelse, OG- og Twitter-felter samt JSON-LD kommer fra `landing_seo` i Supabase.
 * `og:url` + canonical sættes til den besøgtes faktiske URL, så /priser osv. deler rigtig adresse.
 */
function injectSeoInHeadHtml(html: string, seo: Seo, publicPageUrl: string) {
  const docTitle = seo.document_title.trim() || 'Bilago'
  const metaDesc = seo.meta_description.trim() || 'Bilago'
  const ogImage = (seo.og_image_url || '').trim() || 'https://bilago.dk/og-image.png'
  const can = (publicPageUrl || seo.canonical_url || '').trim() || 'https://bilago.dk/'

  let h = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeText(docTitle)}</title>`)
  h = replaceMetaBlock(h, 'name', 'description', metaDesc)
  h = h.replace(
    /<link[\s\S]*?rel="canonical"[\s\S]*?href="[^"]*"[\s\S]*?>/i,
    `<link rel="canonical" href="${escAttr(can)}" />`,
  )

  if (seo.meta_keywords.trim()) {
    h = replaceMetaBlock(h, 'name', 'keywords', seo.meta_keywords.trim())
  } else {
    h = h.replace(
      /<meta[\s\S]*?name="keywords"[\s\S]*?content="[^"]*"[\s\S]*?\/?>/i,
      '',
    )
  }

  h = replaceMetaBlock(h, 'property', 'og:title', (seo.og_title || docTitle).trim() || docTitle)
  h = replaceMetaBlock(h, 'property', 'og:description', (seo.og_description || metaDesc).trim() || metaDesc)
  h = replaceMetaBlock(h, 'property', 'og:image', ogImage)
  h = replaceMetaBlock(h, 'property', 'og:type', (seo.og_type || 'website').trim() || 'website')
  h = replaceMetaBlock(h, 'property', 'og:site_name', (seo.og_site_name || 'Bilago').trim())
  h = replaceMetaBlock(h, 'property', 'og:url', can)
  h = replaceMetaBlock(
    h,
    'name',
    'twitter:card',
    (seo.twitter_card || 'summary_large_image').trim() || 'summary_large_image',
  )
  h = replaceMetaBlock(h, 'name', 'twitter:title', (seo.og_title || docTitle).trim() || docTitle)
  h = replaceMetaBlock(
    h,
    'name',
    'twitter:description',
    (seo.og_description || metaDesc).trim() || metaDesc,
  )
  h = replaceMetaBlock(h, 'name', 'twitter:image', ogImage)
  h = replaceMetaBlock(h, 'name', 'robots', (seo.robots || 'index, follow').trim())
  if (seo.theme_color.trim()) {
    h = replaceMetaBlock(h, 'name', 'theme-color', seo.theme_color.trim())
  }

  h = h.replace(
    /<script type="application\/ld\+json" data-bilago-landing-seo-ld="1"[\s\S]*?<\/script>\s*/gi,
    '',
  )
  const rawLd = typeof seo.json_ld === 'string' ? seo.json_ld.trim() : ''
  if (rawLd) {
    try {
      JSON.parse(rawLd)
      h = h.replace(
        '</head>',
        `    <script type="application/ld+json" data-bilago-landing-seo-ld="1">
${rawLd}
    </script>
</head>`,
      )
    } catch {
      /* ugyldig JSON-LD — ignorer, meta/OG er allerede opdateret */
    }
  }
  return h
}

async function fetchLandingSeo(
  supabaseUrl: string,
  anon: string,
): Promise<unknown | null> {
  const base = supabaseUrl.replace(/\/$/, '')
  const u = `${base}/rest/v1/platform_public_settings?select=landing_seo&id=eq.1`
  const r = await fetch(u, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
  })
  if (!r.ok) return null
  const rows = (await r.json()) as { landing_seo?: unknown }[] | null
  const first = Array.isArray(rows) && rows[0] ? rows[0] : null
  return first?.landing_seo ?? null
}

function isLikelyAppShellHtml(
  requestPath: string,
  contentType: string | null,
  resStatus: number,
): boolean {
  if (resStatus !== 200) return false
  if (!contentType?.toLowerCase().includes('text/html')) return false
  const isAsset = /\.(js|mjs|ts|css|map|ico|png|jpe?g|gif|svg|webp|json|xml|txt|woff2?|wasm)$/i.test(
    requestPath,
  )
  if (isAsset) return false
  return true
}

export const config: Config = {
  path: '/*',
  excludedPath: [
    '/assets/*',
  ],
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url)
  const method = request.method
  if (url.pathname.startsWith('/.netlify') || (method !== 'GET' && method !== 'HEAD')) {
    return context.next()
  }

  const res = await context.next()
  const supabaseUrl =
    Deno.env.get('VITE_SUPABASE_URL')?.trim() ?? Deno.env.get('SUPABASE_URL')?.trim() ?? ''
  const anon =
    Deno.env.get('VITE_SUPABASE_ANON_KEY')?.trim() ?? Deno.env.get('SUPABASE_ANON_KEY')?.trim() ?? ''
  if (!supabaseUrl || !anon) {
    return res
  }
  if (!isLikelyAppShellHtml(url.pathname, res.headers.get('content-type'), res.status)) {
    return res
  }

  let body: string
  try {
    body = await res.text()
  } catch {
    return res
  }

  if (!body.toLowerCase().includes('<!doctype') && !body.includes('</head>')) {
    return buildHtmlResponse(res, body)
  }

  const publicUrl = new URL(request.url)
  publicUrl.hash = ''
  const publicPageUrl = publicUrl.toString()

  let raw: unknown
  try {
    raw = await fetchLandingSeo(supabaseUrl, anon)
  } catch {
    return buildHtmlResponse(res, body)
  }
  const baseSeo = mergeLandingSeo(raw)
  const seo = overlayFeatureSeo(baseSeo, url.pathname)
  const newHtml = injectSeoInHeadHtml(body, seo, publicPageUrl)
  if (newHtml === body) {
    return buildHtmlResponse(res, body)
  }
  return buildHtmlResponse(res, newHtml)
}

/**
 * Hvis URL'en er /funktioner/:slug, overskriver vi titel/beskrivelse/keywords
 * fra base-SEO med feature-specifikke tekster. OG-billedet og andre globale
 * felter beholdes fra landing-SEO.
 */
function overlayFeatureSeo(base: Seo, pathname: string): Seo {
  const slug = featureSlugFromPath(pathname)
  if (!slug) return base
  const f = FEATURE_SEO[slug]
  if (!f) return base
  return {
    ...base,
    document_title: `${f.title} · Bilago`,
    meta_description: f.description,
    meta_keywords: f.keywords ?? base.meta_keywords,
    og_title: f.title,
    og_description: f.description,
  }
}

function buildHtmlResponse(original: Response, body: string) {
  const h = new Headers(original.headers)
  h.delete('content-length')
  h.delete('content-encoding')
  h.delete('etag')
  h.set('content-type', 'text/html; charset=utf-8')
  return new Response(body, { status: original.status, headers: h })
}
