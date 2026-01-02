/**
 * Utility function to generate and download CSV file from job applications
 */

/**
 * Format status to human-readable text
 */
const formatStatus = (status) => {
  const statusMap = {
    'applied': 'Applied (no response)',
    'interview': 'Interview',
    'offer': 'Offer',
    'rejected': 'Rejected'
  };
  return statusMap[status] || status;
};

/**
 * Format date to YYYY-MM-DD
 */
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Escape CSV field - handle commas, quotes, and line breaks
 */
const escapeCSVField = (field) => {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  // If field contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
};

/**
 * Generate CSV content from applications
 */
const generateCSVContent = (applications) => {
  // Define headers
  const headers = [
    'Company',
    'Role',
    'Status',
    'Date Applied'
  ];
  
  // Sort applications by date (newest first)
  const sortedApps = [...applications].sort((a, b) => {
    return new Date(b.date_applied) - new Date(a.date_applied);
  });
  
  // Convert applications to rows
  const rows = sortedApps.map(app => {
    return [
      escapeCSVField(app.company),
      escapeCSVField(app.role),
      escapeCSVField(formatStatus(app.status)),
      escapeCSVField(formatDate(app.date_applied))
    ];
  });
  
  // Combine headers and rows
  const csvLines = [headers, ...rows];
  
  // Join into CSV string
  const csvContent = csvLines.map(row => row.join(',')).join('\n');
  
  return csvContent;
};

/**
 * Download CSV file
 */
export const exportJobApplicationsCSV = (applications) => {
  try {
    // Generate CSV content
    const csvContent = generateCSVContent(applications);
    
    // Add BOM (Byte Order Mark) for Excel compatibility with UTF-8
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    
    // Create blob with UTF-8 encoding
    const blob = new Blob([csvWithBOM], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    link.download = `Job_Applications_Export_${today}.csv`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('CSV export successful');
    return true;
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
};

