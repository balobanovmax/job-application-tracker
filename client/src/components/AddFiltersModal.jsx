import { useState } from 'react';
import styles from './AddFiltersModal.module.css';

function AddFiltersModal({ isOpen, onClose, onApplyFilters }) {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    statuses: [],
    companySearch: '',
  });

  const handleStatusToggle = (status) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      statuses: [],
      companySearch: '',
    });
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Filter Job Applications</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <div className={styles.form}>
          {/* Date Range Filter */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Filter by Date Applied</h3>
            <div className={styles.dateRange}>
              <div className={styles.formGroup}>
                <label htmlFor="dateFrom" className={styles.label}>
                  From
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="dateTo" className={styles.label}>
                  To
                </label>
                <input
                  type="date"
                  id="dateTo"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Filter by Status</h3>
            <div className={styles.statusGrid}>
              {['applied', 'interview', 'offer', 'rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusToggle(status)}
                  className={`${styles.statusButton} ${
                    filters.statuses.includes(status) ? styles.statusActive : ''
                  } ${styles[status]}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Company Search Filter */}
          <div className={styles.filterSection}>
            <h3 className={styles.sectionTitle}>Filter by Company</h3>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="companySearch"
                name="companySearch"
                value={filters.companySearch}
                onChange={handleChange}
                className={styles.input}
                placeholder="Search by company name..."
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleApply}
              className={styles.applyButton}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFiltersModal;

