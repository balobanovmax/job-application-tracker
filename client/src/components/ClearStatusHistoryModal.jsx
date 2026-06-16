import { useState } from 'react';
import styles from './DeleteJobModal.module.css';
import modalStyles from './NestedModal.module.css';

function ClearStatusHistoryModal({ isOpen, onClose, onConfirm, job }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error clearing status history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${modalStyles.overlay}`} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Clear Status History</h2>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.message}>
            Are you sure you want to clear all status history for this job?
          </p>
          {job && (
            <div className={styles.jobInfo}>
              <p className={styles.jobDetail}>
                {job.company} - {job.role}
              </p>
            </div>
          )}
          <p className={styles.warning}>
            New history entries will be recorded when the status changes again.
          </p>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={handleClose}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={styles.deleteButton}
            disabled={loading}
          >
            {loading ? 'Clearing...' : 'Clear History'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClearStatusHistoryModal;
