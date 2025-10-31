import { Outlet } from 'react-router-dom'
import { FloatingElements } from '@/components/common/FloatingElements'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { useAuth } from './auth/AuthContext'
import { DashboardLayout } from './layout/DashboardLayout'

export default function Layout() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <FloatingElements />
      <Sonner
        toastOptions={{
          classNames: {
            toast: 'bg-glass border-glass text-foreground',
          },
        }}
      />
      {isAuthenticated ? <DashboardLayout /> : <Outlet />}
    </>
  )
}
