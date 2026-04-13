# regnskabsprogram

Dansk SMB MVP: fakturaer, bilag, Stripe-abonnement, dashboard. Frontend i `web/` (Vite + React), backend i `supabase/` (PostgreSQL, RLS, Edge Functions).

## Kom i gang

```bash
cd web && npm install && npm run dev
```

Kopiér `web/.env.example` til `web/.env.local` og sæt Supabase URL + anon key. Kør SQL-migrationen i Supabase Dashboard (fil: `supabase/migrations/20260406000000_initial_schema.sql`).

## Edge Functions

Stripe: `stripe-checkout`, `stripe-webhook`. Sæt secrets i Supabase (se projektets dokumentation). Bank (Aiia) er udskudt i UI.

## Hosting via GitHub

Repo: [github.com/M-Soueidan/regnskabsprogram](https://github.com/M-Soueidan/regnskabsprogram). Ved push til `main` kører **GitHub Actions** (`.github/workflows/ci.yml`) og bygger `web/`.

### Vercel (anbefalet til Vite)

1. [vercel.com](https://vercel.com) → **Add New Project** → import `regnskabsprogram`.
2. **Root Directory:** `web` (vigtigt — ikke repo-roden).
3. Framework: Vite (autodetekteres ofte).
4. **Environment Variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (anon JWT fra Supabase → API).
5. Deploy. `web/vercel.json` sørger for SPA-routing (React Router).

### Netlify

1. **New site from Git** → vælg repo.
2. **Base directory:** `web`
3. Build: `npm run build`, publish: `dist` (eller brug `web/netlify.toml`).
4. Samme to `VITE_*` env vars som ovenfor.

### Hostinger

Afhænger af produkt (fx **hPanel → Git** eller statisk hosting):

- **Build:** kør `npm ci && npm run build` inde i **`web`** (Node skal være tilgængelig, fx 20+).
- **Publicér mappen:** `web/dist` (indholdet — ikke hele monorepoet).
- For React Router skal alle stier serve `index.html` (SPA fallback); hvis Hostinger kun er statiske filer, upload `dist` efter build eller brug en host der understøtter SPA-rewrite.

### Efter deploy (ikke automatisk i repo)

- **Supabase → Authentication → URL Configuration:** tilføj produktions-URL (fx `https://bilago.dk/**`).
- **Supabase Edge secret `APP_URL`:** samme base-URL som frontend.
- **Stripe** success/cancel bygger på `APP_URL` i Edge Functions.
