import { useState } from 'react';
import styles from './DeleteJobModal.module.css';

function DeleteJobModal({ isOpen, onClose, onConfirm, job }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(job.id);
      onClose();
    } catch (error) {
      console.error('Error deleting job:', error);
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
          <h2 className={styles.modalTitle}>Delete Job Application</h2>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.message}>
            Are you sure you want to delete this job application?
          </p>
          {job && (
            <div className={styles.jobInfo}>
              <p className={styles.jobDetail}>
                {job.company} - {job.role}
              </p>
            </div>
          )}
          <p className={styles.warning}>
            This action cannot be undone.
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
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteJobModal;

