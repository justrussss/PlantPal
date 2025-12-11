import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './styles/features.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import PlantDetails from './pages/PlantDetails.jsx'
import { PlantProvider } from './state/PlantContext.jsx'
import { AuthProvider } from './state/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  {
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/plants/:id', element: <PlantDetails /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PlantProvider>
        <RouterProvider router={router} />
      </PlantProvider>
    </AuthProvider>
  </StrictMode>,
)
