import styles from './JobList.module.css';

function JobList({ applications, onEdit, onDelete }) {
  // Helper function to format status display text
  const formatStatus = (status) => {
    if (status === 'applied') {
      return 'Applied (no response)';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (applications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyMessage}>
          No job applications found.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.jobList}>
      <div className={styles.jobGrid}>
        {applications.map((app) => (
          <div key={app.id} className={styles.jobCard}>
            <div className={styles.jobHeader}>
              <h3 className={styles.company}>{app.company}</h3>
              <span className={`${styles.status} ${styles[app.status]}`}>
                {formatStatus(app.status)}
              </span>
            </div>
            <p className={styles.role}>{app.role}</p>
            {app.notes && (
              <p className={styles.notes}>
                <span className={styles.notesLabel}>Note:</span> {app.notes}
              </p>
            )}
            {app.application_url && (
              <a 
                href={app.application_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.applicationLink}
              >
                View Application →
              </a>
            )}
            <div className={styles.jobFooter}>
              <p className={styles.date}>
                Applied: {new Date(app.date_applied).toLocaleDateString()}
              </p>
              <div className={styles.buttonGroup}>
                <button 
                  onClick={() => onDelete(app)} 
                  className={styles.deleteButton}
                  aria-label="Delete job"
                >
                  Delete
                </button>
                <button 
                  onClick={() => onEdit(app)} 
                  className={styles.editButton}
                  aria-label="Edit job"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobList;

