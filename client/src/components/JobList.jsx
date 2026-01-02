import styles from './JobList.module.css';

function JobList({ applications }) {
  if (applications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyMessage}>
          You haven't added any jobs yet. Add one to get started!
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
            <p className={styles.date}>
              Applied: {new Date(app.date_applied).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobList;

