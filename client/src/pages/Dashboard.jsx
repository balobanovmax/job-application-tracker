import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Navbar from '../components/Navbar'
import JobList from '../components/JobList'
import ActionButtons from '../components/ActionButtons'
import AddJobModal from '../components/AddJobModal'
import { useUser } from '../hooks/useUser'
import { useApplications } from '../hooks/useApplications'
import { applicationAPI } from '../utils/api'
import styles from './Dashboard.module.css'

function Dashboard() {
  const { auth0User, loading: userLoading, error: userError } = useUser()
  const { applications, loading: appsLoading, error: appsError, refetch } = useApplications()
  const { getAccessTokenSilently } = useAuth0()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddJob = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleSubmitAddJob = async (formData) => {
    await applicationAPI.create(getAccessTokenSilently, formData)
    await refetch() // Refetch applications to show the new job
  }

  const handleEditJob = () => {
    console.log('Edit Job clicked')
  }

  const handleAddFilters = () => {
    console.log('Add Filters clicked')
  }

  const handleClearFilters = () => {
    console.log('Clear Filters clicked')
  }

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

          <ActionButtons
            onAddJob={handleAddJob}
            onEditJob={handleEditJob}
            onAddFilters={handleAddFilters}
            onClearFilters={handleClearFilters}
          />

          {appsLoading ? (
            <p className={styles.loadingText}>Loading your applications...</p>
          ) : appsError ? (
            <p className={styles.errorText}>Error loading applications: {appsError}</p>
          ) : (
            <JobList applications={applications} />
          )}
        </div>
      </main>

      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmitAddJob}
      />
    </div>
  )
}

export default Dashboard

