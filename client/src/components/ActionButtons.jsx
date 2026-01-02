import styles from './ActionButtons.module.css';

function ActionButtons({ onAddJob, onAddFilters, onClearFilters, onViewStatistics, onDeleteAll, filterCount = 0 }) {
  return (
    <div className={styles.actionButtons}>
      <button onClick={onAddJob} className={styles.primaryButton}>
        Add Job
      </button>
      <button onClick={onAddFilters} className={styles.secondaryButton}>
        Add Filters
        {filterCount > 0 && (
          <span className={styles.filterBadge}>{filterCount}</span>
        )}
      </button>
      <button onClick={onClearFilters} className={styles.secondaryButton}>
        Clear Filters
      </button>
      <button onClick={onViewStatistics} className={styles.secondaryButton}>
        View Statistics
      </button>
      <button onClick={onDeleteAll} className={styles.deleteAllButton}>
        Delete All Jobs
      </button>
    </div>
  );
}

export default ActionButtons;

