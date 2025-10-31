import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './components/auth/AuthContext'
import DashboardPage from './pages/dashboard/DashboardPage'
import ProjectsPage from './pages/dashboard/ProjectsPage'
import TemplatesPage from './pages/dashboard/TemplatesPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import UsagePage from './pages/dashboard/UsagePage'
import ProjectEditorPage from './pages/dashboard/projects/ProjectEditorPage'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Index />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/templates"
        element={
          <ProtectedRoute>
            <TemplatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/usage"
        element={
          <ProtectedRoute>
            <UsagePage />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
)

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
