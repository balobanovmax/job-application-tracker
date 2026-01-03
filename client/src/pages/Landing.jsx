import { useAuth0 } from '@auth0/auth0-react'
import Navbar from '../components/Navbar'
import styles from './Landing.module.css'

function Landing() {
  const { loginWithRedirect } = useAuth0()

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

  return (
    <div className={styles.landing}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Job Application Tracker</h1>
          <p className={styles.subtitle}>
            Manage all of your jobs in one place.
          </p>
          
          {/* Mobile-only buttons */}
          <div className={styles.mobileButtons}>
            <button onClick={handleLogin} className={styles.loginBtn}>
              Login
            </button>
            <button onClick={handleSignup} className={styles.signupBtn}>
              Sign Up
            </button>
          </div>

          <p className={styles.description}>
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Maxim Balobanov. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default Landing

