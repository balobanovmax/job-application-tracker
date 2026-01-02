import Navbar from '../components/Navbar'
import JobList from '../components/JobList'
import { useUser } from '../hooks/useUser'
import { useApplications } from '../hooks/useApplications'
import styles from './Dashboard.module.css'

function Dashboard() {
  const { auth0User, loading: userLoading, error: userError } = useUser()
  const { applications, loading: appsLoading, error: appsError } = useApplications()

  if (userLoading) {
    return (
      <div className={styles.dashboard}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <p className={styles.loadingText}>Loading your profile...</p>
          </div>
        </main>
      </div>
    )
  }

  if (userError) {
    return (
      <div className={styles.dashboard}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <p className={styles.errorText}>
              Error: {userError}
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.welcome}>
              Welcome back, {auth0User?.name || auth0User?.email}!
            </h1>
            <p className={styles.subtitle}>
              Manage your job applications and track your progress.
            </p>
          </div>

          {appsLoading ? (
            <p className={styles.loadingText}>Loading your applications...</p>
          ) : appsError ? (
            <p className={styles.errorText}>Error loading applications: {appsError}</p>
          ) : (
            <JobList applications={applications} />
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

