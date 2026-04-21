import { Navigate } from 'react-router-dom'
import { useApp } from '@/context/AppProvider'

export function HomeRedirect() {
  const { loading, tenantCompanyCount, platformRole } = useApp()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Indlæser…
      </div>
    )
  }
  if (tenantCompanyCount === 0) {
    if (platformRole) {
      return <Navigate to="/platform/dashboard" replace />
    }
    return <Navigate to="/onboarding" replace />
  }
  return <Navigate to="/app/dashboard" replace />
}
