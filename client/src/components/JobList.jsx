import styles from './JobList.module.css';

function JobList({ applications, onEdit, onDelete }) {
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
                {app.status}
              </span>
            </div>
            <p className={styles.role}>{app.role}</p>
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

