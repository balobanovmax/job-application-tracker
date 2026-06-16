import styles from './ActionButtons.module.css';

function ActionButtons({ 
  onAddJob, 
  onFilters, 
  onSort, 
  onViewStatistics, 
  onDeleteAll, 
  onSelectMultiple,
  onChangeViewMode,
  filterCount = 0, 
  sortCount = 0,
  isSelectionMode = false,
  selectedCount = 0,
  onCancelSelection,
  onBulkOperation
}) {
  if (isSelectionMode) {
    return (
      <div className={styles.actionButtons}>
        <div className={styles.selectionInfo}>
          <span className={styles.selectionText}>{selectedCount} job{selectedCount !== 1 ? 's' : ''} selected</span>
        </div>
        <button onClick={onCancelSelection} className={styles.cancelButton}>
          Cancel
        </button>
        <button 
          onClick={onBulkOperation} 
          className={styles.bulkOperationButton}
          disabled={selectedCount === 0}
        >
          Select Operation
        </button>
      </div>
    );
  }

  return (
    <div className={styles.actionButtons}>
      <button onClick={onAddJob} className={styles.primaryButton}>
        Add Job
      </button>
      <button onClick={onFilters} className={styles.secondaryButton}>
        Filters
        {filterCount > 0 && (
          <span className={styles.filterBadge}>{filterCount}</span>
        )}
      </button>
      <button onClick={onSort} className={styles.secondaryButton}>
        Sort
        {sortCount > 0 && (
          <span className={styles.filterBadge}>{sortCount}</span>
        )}
      </button>
      <button onClick={onChangeViewMode} className={styles.secondaryButton}>
        Change View Mode
      </button>
      <button onClick={onSelectMultiple} className={styles.secondaryButton}>
        Select Multiple
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

