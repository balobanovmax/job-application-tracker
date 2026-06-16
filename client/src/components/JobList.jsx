import styles from './JobList.module.css';

function JobList({
  applications,
  onEdit,
  onDelete,
  onToggleStar,
  isSelectionMode = false,
  selectedJobs = [],
  onToggleSelection,
  viewMode = 'tiles',
  emptyMessage = 'No jobs added yet. Add your first job!',
}) {
  const formatStatus = (status) => {
    if (status === 'applied') {
      return 'Applied (no response)';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleCardClick = (app) => {
    if (isSelectionMode) {
      onToggleSelection(app.id);
    }
  };

  const renderActionButtons = (app) => (
    <div className={styles.buttonGroup}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar(app.id, !app.starred);
        }}
        className={app.starred ? styles.unstarButton : styles.starButton}
        aria-label={app.starred ? 'Unstar job' : 'Star job'}
      >
        {app.starred ? 'Unstar' : 'Star'}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(app);
        }}
        className={styles.deleteButton}
        aria-label="Delete job"
      >
        Delete
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(app);
        }}
        className={styles.editButton}
        aria-label="Edit job"
      >
        Edit
      </button>
    </div>
  );

  if (applications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyMessage}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className={styles.jobList}>
        <div className={styles.listRows}>
          {applications.map((app) => {
            const isSelected = selectedJobs.includes(app.id);

            return (
              <div
                key={app.id}
                className={`${styles.listRow} ${isSelectionMode ? styles.selectable : ''} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleCardClick(app)}
              >
                {isSelectionMode && (
                  <div className={styles.listCheckbox}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelection(app.id)}
                      className={styles.checkboxInput}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                <div className={styles.listMain}>
                  <div className={styles.listPrimary}>
                    {app.starred && <span className={styles.listStar}>★</span>}
                    <span className={styles.listCompany}>{app.company}</span>
                    <span className={styles.listDivider}>·</span>
                    <span className={styles.listRole}>{app.role}</span>
                  </div>
                  {(app.notes || app.application_url) && (
                    <div className={styles.listMeta}>
                      {app.notes && (
                        <span className={styles.listNotes}>{app.notes}</span>
                      )}
                      {app.application_url && (
                        <a
                          href={app.application_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.listLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Application →
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <span className={`${styles.status} ${styles.listStatus} ${styles[app.status]}`}>
                  {formatStatus(app.status)}
                </span>

                <span className={styles.listDate}>
                  {new Date(app.date_applied).toLocaleDateString()}
                </span>

                {!isSelectionMode && (
                  <div className={styles.listActions}>
                    {renderActionButtons(app)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.jobList}>
      <div className={styles.jobGrid}>
        {applications.map((app) => {
          const isSelected = selectedJobs.includes(app.id);

          return (
            <div
              key={app.id}
              className={`${styles.jobCard} ${isSelectionMode ? styles.selectable : ''} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleCardClick(app)}
            >
              {isSelectionMode && (
                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelection(app.id)}
                    className={styles.checkboxInput}
                  />
                </div>
              )}

              {app.starred && (
                <div className={styles.starIcon}>
                  ★
                </div>
              )}

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
                  onClick={(e) => e.stopPropagation()}
                >
                  View Application →
                </a>
              )}
              <div className={styles.jobFooter}>
                <p className={styles.date}>
                  Applied: {new Date(app.date_applied).toLocaleDateString()}
                </p>
                {!isSelectionMode && renderActionButtons(app)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default JobList;
