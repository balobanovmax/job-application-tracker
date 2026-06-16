import { useState, useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import JobList from '../components/JobList'
import ActionButtons from '../components/ActionButtons'
import AddJobModal from '../components/AddJobModal'
import EditJobModal from '../components/EditJobModal'
import AddFiltersModal from '../components/AddFiltersModal'
import SortModal from '../components/SortModal'
import ViewModeModal from '../components/ViewModeModal'
import DeleteJobModal from '../components/DeleteJobModal'
import DeleteAllJobsModal from '../components/DeleteAllJobsModal'
import DuplicateWarningModal from '../components/DuplicateWarningModal'
import BulkOperationModal from '../components/BulkOperationModal'
import { useUser } from '../hooks/useUser'
import { useApplications } from '../hooks/useApplications'
import { applicationAPI } from '../utils/api'
import styles from './Dashboard.module.css'

function Dashboard() {
  const { auth0User, user: dbUser, loading: userLoading, error: userError } = useUser()
  const { applications, loading: appsLoading, error: appsError, refetch, updateApplicationOptimistic } = useApplications({
    enabled: !userLoading && !userError,
  })
  const { getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false)
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false)
  const [isSortModalOpen, setIsSortModalOpen] = useState(false)
  const [isViewModeModalOpen, setIsViewModeModalOpen] = useState(false)
  const [isDuplicateWarningOpen, setIsDuplicateWarningOpen] = useState(false)
  const [isBulkOperationModalOpen, setIsBulkOperationModalOpen] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [pendingJobData, setPendingJobData] = useState(null)
  const [duplicateInfo, setDuplicateInfo] = useState(null)
  const [activeFilters, setActiveFilters] = useState({
    dateFrom: '',
    dateTo: '',
    statuses: [],
    companySearch: '',
    starred: 'all',
  })
  const [activeSort, setActiveSort] = useState('')
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('jobViewMode') === 'list' ? 'list' : 'tiles'
  })

  const handleChangeViewMode = () => {
    setIsViewModeModalOpen(true)
  }

  const handleCloseViewModeModal = () => {
    setIsViewModeModalOpen(false)
  }

  const handleApplyViewMode = (mode) => {
    setViewMode(mode)
    localStorage.setItem('jobViewMode', mode)
    setIsViewModeModalOpen(false)
  }

  const handleAddJob = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleSubmitAddJob = async (formData) => {
    // Check for duplicates (exact match on company and role, case-insensitive)
    const duplicates = applications.filter(app => 
      app.company.toLowerCase().trim() === formData.company.toLowerCase().trim() &&
      app.role.toLowerCase().trim() === formData.role.toLowerCase().trim()
    );

    if (duplicates.length > 0) {
      // Store the form data and show duplicate warning
      setPendingJobData(formData);
      setDuplicateInfo({
        company: formData.company,
        role: formData.role,
        existingCount: duplicates.length
      });
      setIsDuplicateWarningOpen(true);
      // Return false to indicate duplicate found (modal should stay open)
      return false;
    } else {
      // No duplicates, proceed with adding the job
      await applicationAPI.create(getAccessTokenSilently, formData);
      await refetch();
      // Return true/undefined to indicate success (modal should close)
      return true;
    }
  }

  const handleCloseDuplicateWarning = () => {
    setIsDuplicateWarningOpen(false);
    setPendingJobData(null);
    setDuplicateInfo(null);
    // Keep Add Job modal open so user can edit
  }

  const handleConfirmDuplicate = async () => {
    // User confirmed they want to add the duplicate
    await applicationAPI.create(getAccessTokenSilently, pendingJobData);
    await refetch();
    setIsDuplicateWarningOpen(false);
    setIsAddModalOpen(false); // Close both modals
    setPendingJobData(null);
    setDuplicateInfo(null);
  }

  const handleFilters = () => {
    setIsFiltersModalOpen(true)
  }

  const handleCloseFiltersModal = () => {
    setIsFiltersModalOpen(false)
  }

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters)
    setIsFiltersModalOpen(false) // Close modal after applying
  }

  const handleClearFilters = () => {
    setActiveFilters({
      dateFrom: '',
      dateTo: '',
      statuses: [],
      companySearch: '',
      starred: 'all',
    })
    setIsFiltersModalOpen(false) // Close modal after clearing
  }

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.dateFrom) count++;
    if (activeFilters.dateTo) count++;
    count += activeFilters.statuses.length;
    if (activeFilters.companySearch.trim()) count++;
    if (activeFilters.starred !== 'all') count++;
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

  const handleToggleStar = async (jobId, starred) => {
    // Optimistic update - update UI immediately
    updateApplicationOptimistic(jobId, { starred })
    
    // Then update the backend
    try {
      await applicationAPI.update(getAccessTokenSilently, jobId, { starred })
    } catch (error) {
      console.error('Failed to update star status:', error)
      // Revert optimistic update on error
      updateApplicationOptimistic(jobId, { starred: !starred })
      alert('Failed to update star status. Please try again.')
    }
  }

  const handleDeleteJob = (job) => {
    setSelectedJob(job)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedJob(null)
  }

  const handleConfirmDelete = async (jobId) => {
    await applicationAPI.delete(getAccessTokenSilently, jobId)
    await refetch()
  }

  const handleDeleteAllJobs = () => {
    setIsDeleteAllModalOpen(true)
  }

  const handleCloseDeleteAllModal = () => {
    setIsDeleteAllModalOpen(false)
  }

  const handleConfirmDeleteAll = async () => {
    await applicationAPI.deleteAll(getAccessTokenSilently)
    await refetch()
  }

  const handleSort = () => {
    setIsSortModalOpen(true)
  }

  const handleCloseSortModal = () => {
    setIsSortModalOpen(false)
  }

  const handleApplySort = (sortOption) => {
    setActiveSort(sortOption)
    setIsSortModalOpen(false)
  }

  const handleClearSort = () => {
    setActiveSort('')
    setIsSortModalOpen(false)
  }

  // Bulk selection handlers
  const handleSelectMultiple = () => {
    setIsSelectionMode(true)
    setSelectedJobs([])
  }

  const handleCancelSelection = () => {
    setIsSelectionMode(false)
    setSelectedJobs([])
  }

  const handleToggleSelection = (jobId) => {
    setSelectedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId)
      } else {
        return [...prev, jobId]
      }
    })
  }

  const handleBulkOperation = () => {
    setIsBulkOperationModalOpen(true)
  }

  const handleCloseBulkOperationModal = () => {
    setIsBulkOperationModalOpen(false)
  }

  const handleConfirmBulkOperation = async (operation, newStatus) => {
    if (operation === 'delete') {
      // Delete all selected jobs
      await Promise.all(
        selectedJobs.map(jobId => applicationAPI.delete(getAccessTokenSilently, jobId))
      )
    } else if (operation === 'changeStatus') {
      // Update status for all selected jobs
      await Promise.all(
        selectedJobs.map(jobId => 
          applicationAPI.update(getAccessTokenSilently, jobId, { status: newStatus })
        )
      )
    }
    
    await refetch()
    setIsSelectionMode(false)
    setSelectedJobs([])
    setIsBulkOperationModalOpen(false)
  }

  // Calculate sort count (0 or 1)
  const sortCount = activeSort ? 1 : 0

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = [...applications];

    // Apply filters first
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

    if (activeFilters.statuses.length > 0) {
      filtered = filtered.filter(app => 
        activeFilters.statuses.includes(app.status)
      );
    }

    if (activeFilters.companySearch.trim()) {
      const searchTerm = activeFilters.companySearch.toLowerCase().trim();
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(searchTerm)
      );
    }

    // Apply starred filter
    if (activeFilters.starred === 'starred') {
      filtered = filtered.filter(app => app.starred === true);
    } else if (activeFilters.starred === 'unstarred') {
      filtered = filtered.filter(app => app.starred === false);
    }
    // 'all' shows everything, no filter needed

    // Apply sorting
    if (activeSort) {
      switch (activeSort) {
        case 'date_asc':
          filtered.sort((a, b) => new Date(a.date_applied) - new Date(b.date_applied));
          break;
        case 'date_desc':
          filtered.sort((a, b) => new Date(b.date_applied) - new Date(a.date_applied));
          break;
        case 'company_asc':
          filtered.sort((a, b) => a.company.toLowerCase().localeCompare(b.company.toLowerCase()));
          break;
        case 'company_desc':
          filtered.sort((a, b) => b.company.toLowerCase().localeCompare(a.company.toLowerCase()));
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [applications, activeFilters, activeSort])

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

  const displayName = auth0User?.name
    || auth0User?.email
    || (dbUser?.email?.endsWith('@auth0.user') ? null : dbUser?.email)

  return (
    <div className={styles.dashboard}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.welcome}>Welcome</h1>
            {displayName && (
              <p className={styles.username}>{displayName}</p>
            )}
            <p className={styles.subtitle}>
              Manage your job applications and track your progress.
            </p>
          </div>

          <ActionButtons
            onAddJob={handleAddJob}
            onFilters={handleFilters}
            onSort={handleSort}
            onSelectMultiple={handleSelectMultiple}
            onViewStatistics={() => navigate('/statistics')}
            onDeleteAll={handleDeleteAllJobs}
            filterCount={activeFilterCount}
            sortCount={sortCount}
            isSelectionMode={isSelectionMode}
            selectedCount={selectedJobs.length}
            onCancelSelection={handleCancelSelection}
            onBulkOperation={handleBulkOperation}
            onChangeViewMode={handleChangeViewMode}
          />

          {appsLoading ? (
            <p className={styles.loadingText}>Loading your applications...</p>
          ) : appsError ? (
            <p className={styles.errorText}>Error loading applications: {appsError}</p>
          ) : (
            <JobList 
              applications={filteredAndSortedApplications} 
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              onToggleStar={handleToggleStar}
              isSelectionMode={isSelectionMode}
              selectedJobs={selectedJobs}
              onToggleSelection={handleToggleSelection}
              viewMode={viewMode}
            />
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Maxim Balobanov. All rights reserved.
        </p>
      </footer>

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
        onClearFilters={handleClearFilters}
        initialFilters={activeFilters}
      />

      <SortModal
        isOpen={isSortModalOpen}
        onClose={handleCloseSortModal}
        onApplySort={handleApplySort}
        onClearSort={handleClearSort}
        initialSort={activeSort}
      />

      <ViewModeModal
        isOpen={isViewModeModalOpen}
        onClose={handleCloseViewModeModal}
        onApplyViewMode={handleApplyViewMode}
        initialViewMode={viewMode}
      />

      <DeleteJobModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        job={selectedJob}
      />

      <DeleteAllJobsModal
        isOpen={isDeleteAllModalOpen}
        onClose={handleCloseDeleteAllModal}
        onConfirm={handleConfirmDeleteAll}
        jobCount={applications.length}
      />

      <DuplicateWarningModal
        isOpen={isDuplicateWarningOpen}
        onClose={handleCloseDuplicateWarning}
        onConfirm={handleConfirmDuplicate}
        duplicateInfo={duplicateInfo}
      />

      <BulkOperationModal
        isOpen={isBulkOperationModalOpen}
        onClose={handleCloseBulkOperationModal}
        onConfirm={handleConfirmBulkOperation}
        selectedCount={selectedJobs.length}
      />
    </div>
  )
}

export default Dashboard

