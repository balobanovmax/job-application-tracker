import styles from './StatusHistory.module.css';

const formatStatus = (status) => {
  if (status === 'applied') {
    return 'Applied (no response)';
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

function StatusHistoryHeader({ onClear, showClear }) {
  return (
    <div className={styles.header}>
      <h3 className={styles.title}>Status History</h3>
      {showClear && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClear}
        >
          Clear History
        </button>
      )}
    </div>
  );
}

function StatusHistory({ history, loading, error, onClear, onEditEntry }) {
  if (loading) {
    return (
      <div className={styles.container}>
        <StatusHistoryHeader showClear={false} />
        <p className={styles.message}>Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <StatusHistoryHeader showClear={false} />
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className={styles.container}>
        <StatusHistoryHeader showClear={false} />
        <p className={styles.message}>
          No status changes yet. Move this job on the kanban board or update its status to start tracking.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StatusHistoryHeader onClear={onClear} showClear />
      <ol className={styles.timeline}>
        {history.map((entry, index) => (
          <li key={entry.id} className={styles.timelineItem}>
            <div className={styles.timelineMarker}>
              <span className={`${styles.dot} ${styles[entry.status]}`} />
              {index < history.length - 1 && <span className={styles.line} />}
            </div>
            <div className={styles.timelineContent}>
              <div className={styles.entryMain}>
                <span className={`${styles.statusBadge} ${styles[entry.status]}`}>
                  {formatStatus(entry.status)}
                </span>
                <span className={styles.timestamp}>{formatDate(entry.changed_at)}</span>
              </div>
              <button
                type="button"
                className={styles.editButton}
                onClick={() => onEditEntry(entry)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default StatusHistory;
