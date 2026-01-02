import { useAuth0 } from '@auth0/auth0-react'
import Navbar from '../components/Navbar'
import styles from './Dashboard.module.css'

function Dashboard() {
  const { user } = useAuth0()

  return (
    <div className={styles.dashboard}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.welcome}>Welcome back, {user?.name || user?.email}!</h1>
          <p className={styles.subtitle}>Manage your job applications and track your progress.</p>
          
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>User Profile</h2>
            <div className={styles.userProfile}>
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

