import styles from './ActionButtons.module.css';

function ActionButtons({ onAddJob, onEditJob, onAddFilters, onClearFilters }) {
  return (
    <div className={styles.actionButtons}>
      <button onClick={onAddJob} className={styles.primaryButton}>
        Add Job
      </button>
      <button onClick={onEditJob} className={styles.secondaryButton}>
        Edit Job
      </button>
      <button onClick={onAddFilters} className={styles.secondaryButton}>
        Add Filters
      </button>
      <button onClick={onClearFilters} className={styles.secondaryButton}>
        Clear Filters
      </button>
    </div>
  );
}

export default ActionButtons;

