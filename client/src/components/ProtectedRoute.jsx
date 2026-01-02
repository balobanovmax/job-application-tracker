import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#ffffff',
        fontSize: '1.125rem'
      }}>
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute

