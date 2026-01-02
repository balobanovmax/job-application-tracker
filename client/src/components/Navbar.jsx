import { useAuth0 } from '@auth0/auth0-react'
import styles from './Navbar.module.css'

function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  const handleLogin = () => {
    loginWithRedirect()
  }

  const handleSignup = () => {
    loginWithRedirect({ 
      authorizationParams: { 
        screen_hint: 'signup',
        connection: 'google-oauth2'
      } 
    })
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Job Application Tracker</h1>
        
        <div className={styles.buttons}>
          {isAuthenticated ? (
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
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

