import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from '@/pages/NotFound'
import { Layout } from '@/components/Layout/index'
import { publicRoutes } from './publicRoutes'
import { privateRoutes } from './privateRoutes'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {privateRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route
          path='*'
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
