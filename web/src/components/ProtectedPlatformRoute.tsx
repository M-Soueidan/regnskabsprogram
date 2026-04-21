import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '@/context/AppProvider'

export function ProtectedPlatformRoute() {
  const { loading, platformRole } = useApp()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Indlæser…
      </div>
    )
  }
  if (!platformRole) {
    return <Navigate to="/home" replace />
  }
  return <Outlet />
}
