import { AuthProvider } from '@/contexts/AuthContext'
import { AppRoutes } from '@/routes'
import './App.css'

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
