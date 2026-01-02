import { useState, useEffect } from 'react';
import styles from './AddJobModal.module.css'; // Reusing modal base styles
import sortStyles from './SortModal.module.css'; // Specific sort styles

function SortModal({ isOpen, onClose, onApplySort, onClearSort, initialSort }) {
  const [selectedSort, setSelectedSort] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedSort(initialSort || '');
    }
  }, [isOpen, initialSort]);

  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption);
  };

  const handleApply = () => {
    onApplySort(selectedSort);
  };

  const handleClear = () => {
    setSelectedSort('');
    onClearSort();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const sortOptions = [
    { value: 'date_asc', label: 'Date Added (Oldest First)' },
    { value: 'date_desc', label: 'Date Added (Newest First)' },
    { value: 'company_asc', label: 'Company Name (A-Z)' },
    { value: 'company_desc', label: 'Company Name (Z-A)' },
  ];

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Sort Job Applications</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <div className={styles.form}>
          <div className={sortStyles.sortSection}>
            <h3 className={sortStyles.sectionTitle}>Sort By</h3>
            <div className={sortStyles.sortOptionsGrid}>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSortSelect(option.value)}
                  className={`${sortStyles.sortButton} ${
                    selectedSort === option.value ? sortStyles.sortActive : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleClear}
              className={styles.cancelButton}
            >
              Remove Sorting
            </button>
            <button
              type="button"
              onClick={handleApply}
              className={styles.submitButton}
            >
              Apply Sort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortModal;

