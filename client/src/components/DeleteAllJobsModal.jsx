import { useState } from 'react';
import styles from './DeleteJobModal.module.css'; // Reusing same styles

function DeleteAllJobsModal({ isOpen, onClose, onConfirm, jobCount }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting all jobs:', error);
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
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete All Job Applications</h2>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.message}>
            Are you sure you want to delete all ({jobCount}) job application{jobCount !== 1 ? 's' : ''}?
          </p>
          <p className={styles.warning}>
            This action cannot be undone. All your application data will be permanently deleted.
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
            {loading ? 'Deleting...' : 'Delete All'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAllJobsModal;

