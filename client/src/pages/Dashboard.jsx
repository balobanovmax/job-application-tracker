import { useState, useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Navbar from '../components/Navbar'
import JobList from '../components/JobList'
import ActionButtons from '../components/ActionButtons'
import AddJobModal from '../components/AddJobModal'
import EditJobModal from '../components/EditJobModal'
import AddFiltersModal from '../components/AddFiltersModal'
import { useUser } from '../hooks/useUser'
import { useApplications } from '../hooks/useApplications'
import { applicationAPI } from '../utils/api'
import styles from './Dashboard.module.css'

function Dashboard() {
  const { auth0User, loading: userLoading, error: userError } = useUser()
  const { applications, loading: appsLoading, error: appsError, refetch } = useApplications()
  const { getAccessTokenSilently } = useAuth0()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [activeFilters, setActiveFilters] = useState({
    dateFrom: '',
    dateTo: '',
    statuses: [],
    companySearch: '',
  })

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

  const handleAddFilters = () => {
    setIsFiltersModalOpen(true)
  }

  const handleCloseFiltersModal = () => {
    setIsFiltersModalOpen(false)
  }

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters)
  }

  const handleClearFilters = () => {
    setActiveFilters({
      dateFrom: '',
      dateTo: '',
      statuses: [],
      companySearch: '',
    })
  }

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.dateFrom) count++;
    if (activeFilters.dateTo) count++;
    count += activeFilters.statuses.length;
    if (activeFilters.companySearch.trim()) count++;
    return count;
  }, [activeFilters])

  const handleEditJob = (job) => {
    setSelectedJob(job)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedJob(null)
  }

  const handleSubmitEditJob = async (jobId, formData) => {
    await applicationAPI.update(getAccessTokenSilently, jobId, formData)
    await refetch()
  }

  // Filter applications based on active filters
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Filter by date range (inclusive on both ends)
    if (activeFilters.dateFrom) {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date_applied).toISOString().split('T')[0];
        return appDate >= activeFilters.dateFrom;
      });
    }

    if (activeFilters.dateTo) {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date_applied).toISOString().split('T')[0];
        return appDate <= activeFilters.dateTo;
      });
    }

    // Filter by status (if any statuses selected)
    if (activeFilters.statuses.length > 0) {
      filtered = filtered.filter(app => 
        activeFilters.statuses.includes(app.status)
      );
    }

    // Filter by company name (smart search)
    if (activeFilters.companySearch.trim()) {
      const searchTerm = activeFilters.companySearch.toLowerCase().trim();
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }, [applications, activeFilters])

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
            onAddFilters={handleAddFilters}
            onClearFilters={handleClearFilters}
            filterCount={activeFilterCount}
          />

          {appsLoading ? (
            <p className={styles.loadingText}>Loading your applications...</p>
          ) : appsError ? (
            <p className={styles.errorText}>Error loading applications: {appsError}</p>
          ) : (
            <JobList applications={filteredApplications} onEdit={handleEditJob} />
          )}
        </div>
      </main>

      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmitAddJob}
      />

      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleSubmitEditJob}
        job={selectedJob}
      />

      <AddFiltersModal
        isOpen={isFiltersModalOpen}
        onClose={handleCloseFiltersModal}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  )
}

export default Dashboard

