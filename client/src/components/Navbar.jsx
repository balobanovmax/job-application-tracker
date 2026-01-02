import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: '/dashboard' }
    })
  }

  const handleSignup = () => {
    loginWithRedirect({ 
      authorizationParams: { 
        screen_hint: 'signup',
        connection: 'google-oauth2'
      },
      appState: { returnTo: '/dashboard' }
    })
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  // Check if we're on the statistics page
  const isOnStatisticsPage = location.pathname === '/statistics'

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Job Application Tracker</h1>
        
        <div className={styles.buttons}>
          {isAuthenticated ? (
            <>
              {isOnStatisticsPage && (
                <button onClick={handleBackToDashboard} className={styles.backBtn}>
                  Back to Dashboard
                </button>
              )}
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleLogin} className={styles.loginBtn}>
                Login
              </button>
              <button onClick={handleSignup} className={styles.signupBtn}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

