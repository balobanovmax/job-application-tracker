import Navbar from '../components/Navbar'
import styles from './Landing.module.css'

function Landing() {
  return (
    <div className={styles.landing}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Job Application Tracker</h1>
          <p className={styles.subtitle}>
            Manage all of your jobs in one place.
          </p>
          <p className={styles.description}>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Landing

