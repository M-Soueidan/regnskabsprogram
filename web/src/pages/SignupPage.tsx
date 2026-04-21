import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { invokePlatformEmail } from '@/lib/edge'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/context/AppProvider'
import { validateSignupPassword } from '@/lib/passwordPolicy'

export function SignupPage() {
  const { session, loading, refresh } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && session) {
    return <Navigate to="/" replace />
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setInfo(null)
    const pwErr = validateSignupPassword(password)
    if (pwErr) {
      setError(pwErr)
      setBusy(false)
      return
    }
    const origin = window.location.origin
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${origin}/onboarding`,
      },
    })
    if (err) {
      setError(err.message)
      setBusy(false)
      return
    }
    if (!data.session) {
      setInfo(
        'Vi har sendt et bekræftelseslink til din e-mail. Når du har bekræftet, kommer du til «Kom i gang» (CVR og virksomhed).',
      )
      setBusy(false)
      return
    }
    if (data.session) {
      try {
        await invokePlatformEmail('welcome_new_user')
      } catch {
        /* valgfri velkomst — fortsæt onboarding */
      }
    }
    await refresh()
    setBusy(false)
    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Opret konto</h1>
        <p className="mt-1 text-sm text-slate-500">Start med virksomhed og abonnement</p>
        <form className="mt-6 space-y-4" onSubmit={(e) => void submit(e)}>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              Navn
            </label>
            <input
              id="name"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Adgangskode
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              Mindst 8 tegn: små og store bogstaver, tal og mindst ét symbol (fx ! # -).
            </p>
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          {info ? (
            <p className="text-sm text-emerald-800" role="status">
              {info}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {busy ? 'Opretter…' : 'Opret konto'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Har du allerede en konto?{' '}
          <Link className="font-medium text-indigo-600" to="/login">
            Log ind
          </Link>
        </p>
      </div>
    </div>
  )
}
