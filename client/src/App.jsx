import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Statistics from './pages/Statistics'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth0()

  useEffect(() => {
    if (!isLoading && isAuthenticated && location.pathname === '/') {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/statistics" 
        element={
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default App
