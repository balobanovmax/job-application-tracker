import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import styles from './Navbar.module.css'

function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: '/dashboard' }
    })
    setIsMobileMenuOpen(false)
  }

  const handleSignup = () => {
    loginWithRedirect({ 
      authorizationParams: { 
        screen_hint: 'signup',
        connection: 'google-oauth2'
      },
      appState: { returnTo: '/dashboard' }
    })
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
    setIsMobileMenuOpen(false)
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Check if we're on the statistics page
  const isOnStatisticsPage = location.pathname === '/statistics'

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Job Application Tracker</h1>
        
        {/* Hamburger Icon for Mobile */}
        <button 
          className={styles.hamburger}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {/* Desktop Buttons */}
        <div className={styles.buttons}>
          <button onClick={toggleTheme} className={styles.themeBtn}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <button onClick={toggleTheme} className={styles.mobileMenuItem}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            {isAuthenticated ? (
              <>
                {isOnStatisticsPage && (
                  <button onClick={handleBackToDashboard} className={styles.mobileMenuItem}>
                    Back to Dashboard
                  </button>
                )}
                <button onClick={handleLogout} className={styles.mobileMenuItem}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLogin} className={styles.mobileMenuItem}>
                  Login
                </button>
                <button onClick={handleSignup} className={styles.mobileMenuItem}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

