import { useState } from 'react';
import modalBaseStyles from './AddJobModal.module.css';
import styles from './PDFExportOptionsModal.module.css';

const PDFExportOptionsModal = ({ isOpen, onClose, onConfirm }) => {
  const [includeTimeline, setIncludeTimeline] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const options = {
        includeTimeline,
        dateFrom,
        dateTo
      };
      await onConfirm(options);
      // Reset state
      setIncludeTimeline(false);
      setDateFrom('');
      setDateTo('');
      onClose();
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIncludeTimeline(false);
    setDateFrom('');
    setDateTo('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={modalBaseStyles.modalOverlay} onClick={handleClose}>
      <div className={modalBaseStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={modalBaseStyles.modalHeader}>
          <h2 className={modalBaseStyles.modalTitle}>PDF Export Options</h2>
          <button onClick={handleClose} className={modalBaseStyles.closeButton} disabled={loading}>
            &times;
          </button>
        </div>
        
        <div className={modalBaseStyles.form}>
          <p className={styles.description}>
            Customize your PDF report:
          </p>

          {/* Timeline Option */}
          <div className={styles.optionGroup}>
            <h3 className={styles.groupTitle}>Content</h3>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={includeTimeline}
                onChange={(e) => setIncludeTimeline(e.target.checked)}
                className={styles.checkbox}
                disabled={loading}
              />
              <span className={styles.checkboxText}>Include Applications Over Time chart</span>
            </label>
          </div>

          {/* Date Range Filter */}
          <div className={styles.optionGroup}>
            <h3 className={styles.groupTitle}>Date Range (Optional)</h3>
            <div className={styles.dateRangeContainer}>
              <div className={styles.dateField}>
                <label className={styles.dateLabel}>From:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={styles.dateInput}
                  disabled={loading}
                />
              </div>
              <div className={styles.dateField}>
                <label className={styles.dateLabel}>To:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={styles.dateInput}
                  disabled={loading}
                />
              </div>
            </div>
            <p className={styles.optionHint}>
              Leave blank to include all applications
            </p>
          </div>

          <div className={modalBaseStyles.formActions}>
            <button
              type="button"
              onClick={handleClose}
              className={modalBaseStyles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={modalBaseStyles.submitButton}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExportOptionsModal;

