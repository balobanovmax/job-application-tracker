import { useAuth0 } from '@auth0/auth0-react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'

function App() {
  const { isLoading, isAuthenticated } = useAuth0()

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#242424',
        color: '#ffffff',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    )
  }

  return isAuthenticated ? <Dashboard /> : <Landing />
}

export default App
