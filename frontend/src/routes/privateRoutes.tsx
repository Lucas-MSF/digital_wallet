import { Layout } from '@/components/Layout/index'
import Dashboard from '@/pages/Dashboard'
import { PrivateRoute } from '@/components/PrivateRoute'

export const privateRoutes = [
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
]
