import { useMemo, useState, useEffect } from 'react'
import { pdf } from '@react-pdf/renderer'
import Navbar from '../components/Navbar'
import FunnelChart from '../components/FunnelChart'
import LineChart from '../components/LineChart'
import JobApplicationPDF from '../components/JobApplicationPDF'
import PDFExportOptionsModal from '../components/PDFExportOptionsModal'
import { useUser } from '../hooks/useUser'
import { useApplications } from '../hooks/useApplications'
import { exportJobApplicationsCSV } from '../utils/csvExport'
import { buildApplicationTimeline, parseApplicationDate } from '../utils/applicationTimeline'
import styles from './Statistics.module.css'

function Statistics() {
  const { auth0User, loading: userLoading, error: userError } = useUser()
  const { applications, loading: appsLoading, error: appsError, refetch } = useApplications({
    enabled: !userLoading && !userError,
  })
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false)
  const [isPDFOptionsModalOpen, setIsPDFOptionsModalOpen] = useState(false)

  useEffect(() => {
    const handleFocus = () => {
      if (!userLoading && !userError) {
        refetch()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetch, userLoading, userError])

  // Calculate statistics
  const totalApplications = applications.length
  const appliedCount = applications.filter(app => app.status === 'applied').length
  const interviewCount = applications.filter(app => app.status === 'interview').length
  const offerCount = applications.filter(app => app.status === 'offer').length
  const rejectedCount = applications.filter(app => app.status === 'rejected').length

  // Calculate percentages
  const calculatePercentage = (count) => {
    if (totalApplications === 0) return '0.0';
    return ((count / totalApplications) * 100).toFixed(1);
  }

  // Prepare funnel chart data - using exact status badge colors
  const funnelData = [
    { label: 'Applied (no response)', value: appliedCount, color: '#3b82f6' },
    { label: 'Interviews', value: interviewCount, color: '#a855f7' },
    { label: 'Offers', value: offerCount, color: '#22c55e' },
    { label: 'Rejected', value: rejectedCount, color: '#ef4444' },
  ]

  const timeSeriesData = useMemo(
    () => buildApplicationTimeline(applications),
    [applications]
  )

  // Handle PDF export - open options modal
  const handleExportPDF = () => {
    setIsExportDropdownOpen(false) // Close dropdown
    setIsPDFOptionsModalOpen(true) // Open options modal
  }

  const handleClosePDFOptionsModal = () => {
    setIsPDFOptionsModalOpen(false)
  }

  const handleConfirmPDFExport = async (options) => {
    try {
      console.log('Starting PDF generation with options:', options);
      
      const userName = auth0User?.name || auth0User?.email || 'User';
      
      // Filter applications based on date range
      let filteredApps = [...applications];
      
      // Apply date range filter
      if (options.dateFrom) {
        const fromDate = parseApplicationDate(options.dateFrom)
        filteredApps = filteredApps.filter(app => {
          const appDate = parseApplicationDate(app.date_applied)
          return appDate && appDate >= fromDate
        })
      }

      if (options.dateTo) {
        const toDate = parseApplicationDate(options.dateTo)
        filteredApps = filteredApps.filter(app => {
          const appDate = parseApplicationDate(app.date_applied)
          return appDate && appDate <= toDate
        })
      }
      
      console.log('Filtered applications:', filteredApps.length, 'of', applications.length);
      
      const filteredTimelineData = options.includeTimeline && filteredApps.length > 0
        ? buildApplicationTimeline(filteredApps)
        : null
      
      console.log('Creating PDF blob...');
      const blob = await pdf(
        <JobApplicationPDF 
          userName={userName} 
          applications={filteredApps}
          includeTimeline={options.includeTimeline}
          timelineData={filteredTimelineData?.data}
          timelineUnit={filteredTimelineData?.unit}
        />
      ).toBlob();
      
      console.log('PDF blob created successfully');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Job_Application_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('PDF download initiated');
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error stack:', error.stack);
      alert(`Failed to generate PDF. Error: ${error.message}`);
    }
  }

  // Handle CSV export
  const handleExportCSV = () => {
    setIsExportDropdownOpen(false) // Close dropdown
    try {
      console.log('Starting CSV export...');
      console.log('Applications:', applications);
      
      exportJobApplicationsCSV(applications);
      console.log('CSV export completed successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert(`Failed to export CSV. Error: ${error.message}`);
    }
  }

  // Toggle dropdown
  const toggleExportDropdown = () => {
    setIsExportDropdownOpen(!isExportDropdownOpen)
  }

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(`.${styles.exportDropdownContainer}`)) {
      setIsExportDropdownOpen(false)
    }
  }

  // Add event listener for clicking outside
  useMemo(() => {
    if (isExportDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isExportDropdownOpen])

  if (userLoading) {
    return (
      <div className={styles.statistics}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <p className={styles.loadingText}>Loading your statistics...</p>
          </div>
        </main>
      </div>
    )
  }

  if (userError) {
    return (
      <div className={styles.statistics}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <p className={styles.errorText}>Error: {userError}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.statistics}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerText}>
                <h1 className={styles.title}>Application Statistics</h1>
                <p className={styles.subtitle}>
                  Track your job search progress and insights
                </p>
              </div>
              <div className={styles.exportDropdownContainer}>
                <button 
                  className={styles.exportButton}
                  onClick={toggleExportDropdown}
                  disabled={applications.length === 0}
                >
                  Export Report ▼
                </button>
                {isExportDropdownOpen && (
                  <div className={styles.exportDropdownMenu}>
                    <button 
                      className={styles.dropdownItem}
                      onClick={handleExportPDF}
                    >
                      Export PDF Report
                    </button>
                    <button 
                      className={styles.dropdownItem}
                      onClick={handleExportCSV}
                    >
                      Export CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {appsLoading ? (
            <p className={styles.loadingText}>Loading statistics...</p>
          ) : appsError ? (
            <p className={styles.errorText}>Error loading statistics: {appsError}</p>
          ) : (
            <>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>General Statistics</h2>

                <div className={styles.totalApplicationsCard}>
                  <div className={styles.totalHeader}>
                    <h3 className={styles.totalTitle}>Total Applications</h3>
                    <p className={styles.totalValue}>{totalApplications}</p>
                  </div>

                  <div className={styles.nestedStatsGrid}>
                    <div className={styles.nestedStatCard}>
                      <div className={styles.cardHeader}>
                        <span className={`${styles.statusBadge} ${styles.applied}`}>
                          Applied (no response)
                        </span>
                      </div>
                      <div className={styles.cardValueContainer}>
                        <p className={styles.cardValue}>{appliedCount}</p>
                        <p className={styles.cardPercentage}>
                          {calculatePercentage(appliedCount)}%
                        </p>
                      </div>
                    </div>

                    <div className={styles.nestedStatCard}>
                      <div className={styles.cardHeader}>
                        <span className={`${styles.statusBadge} ${styles.interview}`}>
                          Interview
                        </span>
                      </div>
                      <div className={styles.cardValueContainer}>
                        <p className={styles.cardValue}>{interviewCount}</p>
                        <p className={styles.cardPercentage}>
                          {calculatePercentage(interviewCount)}%
                        </p>
                      </div>
                    </div>

                    <div className={styles.nestedStatCard}>
                      <div className={styles.cardHeader}>
                        <span className={`${styles.statusBadge} ${styles.offer}`}>
                          Offer
                        </span>
                      </div>
                      <div className={styles.cardValueContainer}>
                        <p className={styles.cardValue}>{offerCount}</p>
                        <p className={styles.cardPercentage}>
                          {calculatePercentage(offerCount)}%
                        </p>
                      </div>
                    </div>

                    <div className={styles.nestedStatCard}>
                      <div className={styles.cardHeader}>
                        <span className={`${styles.statusBadge} ${styles.rejected}`}>
                          Rejected
                        </span>
                      </div>
                      <div className={styles.cardValueContainer}>
                        <p className={styles.cardValue}>{rejectedCount}</p>
                        <p className={styles.cardPercentage}>
                          {calculatePercentage(rejectedCount)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Visualizations</h2>

                <div className={styles.visualizationCard}>
                  <div className={styles.visualizationHeader}>
                    <h3 className={styles.visualizationTitle}>Proportional Blocks</h3>
                    <p className={styles.visualizationSubtitle}>
                      Width reflects relative count at each stage
                    </p>
                  </div>
                  <FunnelChart data={funnelData} />
                </div>

                <div className={styles.visualizationCard}>
                  <div className={styles.visualizationHeader}>
                    <h3 className={styles.visualizationTitle}>Applications Over Time</h3>
                    <p className={styles.visualizationSubtitle}>
                      How many applications you submitted over your search period
                    </p>
                  </div>
                  <LineChart data={timeSeriesData.data} unit={timeSeriesData.unit} />
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Maxim Balobanov. All rights reserved.
        </p>
      </footer>

      <PDFExportOptionsModal
        isOpen={isPDFOptionsModalOpen}
        onClose={handleClosePDFOptionsModal}
        onConfirm={handleConfirmPDFExport}
      />
    </div>
  )
}

export default Statistics

