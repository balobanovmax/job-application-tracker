import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  // Header Section
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
    borderBottomStyle: 'solid',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  headerInfo: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
  },
  // Section Titles
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
  },
  // Executive Summary
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
  },
  summaryLabel: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  // Statistics Section
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  statCardApplied: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  statCardInterview: {
    backgroundColor: '#faf5ff',
    borderColor: '#a855f7',
  },
  statCardOffer: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  statCardRejected: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  statLabel: {
    fontSize: 9,
    marginBottom: 3,
  },
  statLabelApplied: { color: '#1e40af' },
  statLabelInterview: { color: '#7c3aed' },
  statLabelOffer: { color: '#16a34a' },
  statLabelRejected: { color: '#dc2626' },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Table
  table: {
    marginTop: 10,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderBottomStyle: 'solid',
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  colCompany: {
    width: '35%',
    fontSize: 10,
  },
  colRole: {
    width: '35%',
    fontSize: 10,
  },
  colStatus: {
    width: '18%',
    fontSize: 9,
    color: '#1a1a1a',
  },
  colDate: {
    width: '12%',
    fontSize: 9,
  },
  statusBadge: {
    padding: '3 6',
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 9,
    color: '#1a1a1a',
  },
  statusApplied: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  statusInterview: {
    backgroundColor: '#a855f7',
    color: '#ffffff',
  },
  statusOffer: {
    backgroundColor: '#22c55e',
    color: '#ffffff',
  },
  statusRejected: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  },
  // Company Breakdown
  companyList: {
    marginTop: 10,
  },
  companyItem: {
    fontSize: 10,
    marginBottom: 4,
    paddingLeft: 10,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
});

function JobApplicationPDF({ userName, applications, includeTimeline = false, timelineData = null }) {
  // Calculate statistics
  const totalApplications = applications.length;
  const appliedCount = applications.filter(app => app.status === 'applied').length;
  const interviewCount = applications.filter(app => app.status === 'interview').length;
  const offerCount = applications.filter(app => app.status === 'offer').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  const calculatePercentage = (count) => {
    if (totalApplications === 0) return '0.0';
    return ((count / totalApplications) * 100).toFixed(1);
  };

  const responseRate = totalApplications > 0 
    ? (((interviewCount + offerCount + rejectedCount) / totalApplications) * 100).toFixed(1)
    : '0.0';

  const successRate = totalApplications > 0
    ? ((offerCount / totalApplications) * 100).toFixed(1)
    : '0.0';

  // Date range
  const sortedApps = [...applications].sort((a, b) => 
    new Date(a.date_applied) - new Date(b.date_applied)
  );
  const firstDate = sortedApps.length > 0 
    ? new Date(sortedApps[0].date_applied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';
  const lastDate = sortedApps.length > 0
    ? new Date(sortedApps[sortedApps.length - 1].date_applied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  // Calculate average applications per day
  const daysDiff = sortedApps.length > 0
    ? Math.ceil((new Date(sortedApps[sortedApps.length - 1].date_applied) - new Date(sortedApps[0].date_applied)) / (1000 * 60 * 60 * 24)) + 1
    : 1;
  const avgPerDay = (totalApplications / daysDiff).toFixed(1);

  // Find day with most applications
  const appsByDate = {};
  applications.forEach(app => {
    const dateKey = new Date(app.date_applied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    appsByDate[dateKey] = (appsByDate[dateKey] || 0) + 1;
  });
  const maxDate = Object.keys(appsByDate).reduce((a, b) => 
    appsByDate[a] > appsByDate[b] ? a : b, 
    Object.keys(appsByDate)[0] || 'N/A'
  );
  const maxCount = appsByDate[maxDate] || 0;
  const maxDateFormatted = maxDate !== 'N/A' 
    ? `${maxDate} (${maxCount} application${maxCount !== 1 ? 's' : ''} sent)`
    : 'N/A';

  // Sort applications by date (newest first)
  const sortedApplications = [...applications].sort((a, b) => 
    new Date(b.date_applied) - new Date(a.date_applied)
  );

  // Company breakdown
  const companyCount = {};
  applications.forEach(app => {
    companyCount[app.company] = (companyCount[app.company] || 0) + 1;
  });
  const sortedCompanies = Object.keys(companyCount).sort();

  // Format status text
  const formatStatus = (status) => {
    if (status === 'applied') return 'Applied (no response)';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'applied': return styles.statusApplied;
      case 'interview': return styles.statusInterview;
      case 'offer': return styles.statusOffer;
      case 'rejected': return styles.statusRejected;
      default: return styles.statusApplied;
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Job Application Report</Text>
          <Text style={styles.headerInfo}>Generated for: {userName}</Text>
          <Text style={styles.headerInfo}>Date Generated: {currentDate}</Text>
          <Text style={styles.headerInfo}>
            Time Period: {firstDate} - {lastDate} ({totalApplications} total applications)
          </Text>
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Applications</Text>
            <Text style={styles.summaryValue}>{totalApplications}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Response Rate (offers + interviews + rejections)</Text>
            <Text style={styles.summaryValue}>{responseRate}%</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Success (Offers) Rate</Text>
            <Text style={styles.summaryValue}>{successRate}%</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg. Applications/Day</Text>
            <Text style={styles.summaryValue}>{avgPerDay}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Most Active Day</Text>
            <Text style={styles.summaryValue}>{maxDateFormatted}</Text>
          </View>
        </View>

        {/* Statistics Section */}
        <Text style={styles.sectionTitle}>Application Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardApplied]}>
            <Text style={[styles.statLabel, styles.statLabelApplied]}>Applied (no response)</Text>
            <Text style={styles.statValue}>{appliedCount} ({calculatePercentage(appliedCount)}%)</Text>
          </View>
          <View style={[styles.statCard, styles.statCardInterview]}>
            <Text style={[styles.statLabel, styles.statLabelInterview]}>Interviews</Text>
            <Text style={styles.statValue}>{interviewCount} ({calculatePercentage(interviewCount)}%)</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOffer]}>
            <Text style={[styles.statLabel, styles.statLabelOffer]}>Offers</Text>
            <Text style={styles.statValue}>{offerCount} ({calculatePercentage(offerCount)}%)</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRejected]}>
            <Text style={[styles.statLabel, styles.statLabelRejected]}>Rejected</Text>
            <Text style={styles.statValue}>{rejectedCount} ({calculatePercentage(rejectedCount)}%)</Text>
          </View>
        </View>

        {/* Detailed Applications Table */}
        <Text style={styles.sectionTitle}>Detailed Applications</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colCompany}>Company</Text>
            <Text style={styles.colRole}>Role</Text>
            <Text style={styles.colStatus}>Status</Text>
            <Text style={styles.colDate}>Date Applied</Text>
          </View>
          {sortedApplications.map((app, index) => (
            <View key={app.id} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
              <Text style={styles.colCompany}>{app.company}</Text>
              <Text style={styles.colRole}>{app.role}</Text>
              <Text style={[styles.colStatus, styles.statusText]}>
                {formatStatus(app.status)}
              </Text>
              <Text style={styles.colDate}>
                {new Date(app.date_applied).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          ))}
        </View>

        {/* Applications Over Time (if included) */}
        {includeTimeline && timelineData && timelineData.data && timelineData.data.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Applications Over Time ({timelineData.unit})</Text>
            <View style={{ marginBottom: 15 }}>
              {timelineData.data.map((item, index) => (
                <View key={index} style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  padding: '5 10',
                  backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                  borderBottomWidth: 1,
                  borderBottomColor: '#f3f4f6',
                  borderBottomStyle: 'solid'
                }}>
                  <Text style={{ fontSize: 10, color: '#333333', width: '50%' }}>{item.label}</Text>
                  <Text style={{ fontSize: 10, color: '#6366f1', fontWeight: 'bold', width: '50%', textAlign: 'right' }}>
                    {item.value} application{item.value !== 1 ? 's' : ''}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Company Breakdown */}
        <Text style={styles.sectionTitle}>Company Breakdown</Text>
        <View style={styles.companyList}>
          {sortedCompanies.map((company, index) => (
            <Text key={index} style={styles.companyItem}>
              • {company} {companyCount[company] > 1 && `(${companyCount[company]} applications)`}
            </Text>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by Job Application Tracker • {currentDate}
        </Text>
      </Page>
    </Document>
  );
}

export default JobApplicationPDF;

