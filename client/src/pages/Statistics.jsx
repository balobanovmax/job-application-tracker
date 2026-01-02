import { useMemo } from 'react'
import { pdf } from '@react-pdf/renderer'
import Navbar from '../components/Navbar'
import FunnelChart from '../components/FunnelChart'
import LineChart from '../components/LineChart'
import JobApplicationPDF from '../components/JobApplicationPDF'
import { useUser } from '../hooks/useUser'
import { useApplications } from '../hooks/useApplications'
import styles from './Statistics.module.css'

function Statistics() {
  const { auth0User, loading: userLoading, error: userError } = useUser()
  const { applications, loading: appsLoading, error: appsError } = useApplications()

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

  const timeSeriesData = useMemo(() => {
    if (applications.length === 0) return [];

    // Sort applications by date_applied
    const sortedApps = [...applications].sort((a, b) => 
      new Date(a.date_applied) - new Date(b.date_applied)
    );

    const firstDate = new Date(sortedApps[0].date_applied);
    const lastDate = new Date(sortedApps[sortedApps.length - 1].date_applied);
    
    // Set to start of day for proper comparison
    firstDate.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));

    // Determine granularity: daily if < 28 days, weekly if >= 28 days
    const useDaily = daysDiff < 28;

    if (useDaily) {
      // Group by day and fill in all days in range
      const grouped = {};
      sortedApps.forEach(app => {
        const date = new Date(app.date_applied);
        date.setHours(0, 0, 0, 0);
        const key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        grouped[key] = (grouped[key] || 0) + 1;
      });

      // Fill in all days in the range (including days with 0 applications)
      const result = [];
      const currentDate = new Date(firstDate);
      
      while (currentDate <= lastDate) {
        const key = currentDate.toISOString().split('T')[0];
        result.push({
          label: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: grouped[key] || 0,
          date: key
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return result;
    } else {
      // Group by week
      const getWeekKey = (dateStr) => {
        const d = new Date(dateStr);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        const monday = new Date(d);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString().split('T')[0];
      };

      const grouped = {};
      sortedApps.forEach(app => {
        const key = getWeekKey(app.date_applied);
        grouped[key] = (grouped[key] || 0) + 1;
      });

      // Fill in all weeks in the range
      const result = [];
      const firstWeekKey = getWeekKey(sortedApps[0].date_applied);
      const lastWeekKey = getWeekKey(sortedApps[sortedApps.length - 1].date_applied);
      
      const currentWeek = new Date(firstWeekKey);
      const lastWeek = new Date(lastWeekKey);
      
      while (currentWeek <= lastWeek) {
        const key = currentWeek.toISOString().split('T')[0];
        const weekStart = new Date(currentWeek);
        const weekEnd = new Date(currentWeek);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        // Format: "Jan 1-7"
        const startLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endDay = weekEnd.getDate();
        const label = `${startLabel}-${endDay}`;
        
        result.push({
          label: label,
          value: grouped[key] || 0,
          date: key
        });
        currentWeek.setDate(currentWeek.getDate() + 7);
      }

      return result;
    }
  }, [applications])

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      console.log('Starting PDF generation...');
      console.log('Applications:', applications);
      console.log('User:', auth0User);
      
      const userName = auth0User?.name || auth0User?.email || 'User';
      
      console.log('Creating PDF blob...');
      const blob = await pdf(
        <JobApplicationPDF userName={userName} applications={applications} />
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
              <button 
                className={styles.exportButton}
                onClick={handleExportPDF}
                disabled={applications.length === 0}
              >
                Export PDF Report
              </button>
            </div>
          </div>

          {appsLoading ? (
            <p className={styles.loadingText}>Loading statistics...</p>
          ) : appsError ? (
            <p className={styles.errorText}>Error loading statistics: {appsError}</p>
          ) : (
            <>
              {/* General Statistics Section */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. General Statistics</h2>
                
                {/* Total Applications Container Card */}
                <div className={styles.totalApplicationsCard}>
                  <div className={styles.totalHeader}>
                    <h3 className={styles.totalTitle}>Total Applications</h3>
                    <p className={styles.totalValue}>{totalApplications}</p>
                  </div>

                  {/* Nested Status Cards Grid */}
                  <div className={styles.nestedStatsGrid}>
                    {/* Applied Card */}
                    <div className={styles.nestedStatCard}>
                      <div className={styles.cardHeader}>
                        <span className={`${styles.statusBadge} ${styles.applied}`}>
                          Applied (no response)
                        </span>
                      </div>
                      <div className={styles.cardValueContainer}>
                        <p className={styles.cardValue}>{appliedCount}</p>
                        <p className={styles.cardPercentage}>({calculatePercentage(appliedCount)}%)</p>
                      </div>
                    </div>

                    {/* Interview Card */}
                    <div className={styles.nestedStatCard}>
                      <div className={styles.cardHeader}>
                        <span className={`${styles.statusBadge} ${styles.interview}`}>
                          Interview
                        </span>
                      </div>
                      <div className={styles.cardValueContainer}>
                        <p className={styles.cardValue}>{interviewCount}</p>
                        <p className={styles.cardPercentage}>({calculatePercentage(interviewCount)}%)</p>
                      </div>
                    </div>

                    {/* Offer Card */}
                    <div className={styles.nestedStatCard}>
                      <div className={styles.cardHeader}>
                        <span className={`${styles.statusBadge} ${styles.offer}`}>
                          Offer
                        </span>
                      </div>
                      <div className={styles.cardValueContainer}>
                        <p className={styles.cardValue}>{offerCount}</p>
                        <p className={styles.cardPercentage}>({calculatePercentage(offerCount)}%)</p>
                      </div>
                    </div>

                    {/* Rejected Card */}
                    <div className={styles.nestedStatCard}>
                      <div className={styles.cardHeader}>
                        <span className={`${styles.statusBadge} ${styles.rejected}`}>
                          Rejected
                        </span>
                      </div>
                      <div className={styles.cardValueContainer}>
                        <p className={styles.cardValue}>{rejectedCount}</p>
                        <p className={styles.cardPercentage}>({calculatePercentage(rejectedCount)}%)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Visualizations Section */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Visualizations</h2>
                
                <div className={styles.visualizationCard}>
                  <h3 className={styles.visualizationTitle}>Proportional Blocks</h3>
                  <FunnelChart data={funnelData} />
                </div>

                <div className={styles.visualizationCard}>
                  <h3 className={styles.visualizationTitle}>Applications Over Time</h3>
                  <LineChart data={timeSeriesData} />
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Statistics

