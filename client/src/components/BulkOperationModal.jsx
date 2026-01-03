import { useState } from 'react';
import modalBaseStyles from './AddJobModal.module.css';
import styles from './BulkOperationModal.module.css';

const BulkOperationModal = ({ isOpen, onClose, onConfirm, selectedCount }) => {
  const [operation, setOperation] = useState('');
  const [newStatus, setNewStatus] = useState('applied');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!operation) return;

    setLoading(true);
    try {
      await onConfirm(operation, newStatus);
      setOperation('');
      setNewStatus('applied');
      onClose();
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOperation('');
    setNewStatus('applied');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={modalBaseStyles.modalOverlay} onClick={handleClose}>
      <div className={modalBaseStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={modalBaseStyles.modalHeader}>
          <h2 className={modalBaseStyles.modalTitle}>Bulk Operation</h2>
          <button onClick={handleClose} className={modalBaseStyles.closeButton} disabled={loading}>
            &times;
          </button>
        </div>
        
        <div className={modalBaseStyles.form}>
          <p className={styles.selectionInfo}>
            {selectedCount} job{selectedCount !== 1 ? 's' : ''} selected
          </p>

          <div className={styles.operationSection}>
            <label className={styles.sectionTitle}>Select Operation:</label>
            
            <button
              type="button"
              className={`${styles.operationButton} ${operation === 'changeStatus' ? styles.active : ''}`}
              onClick={() => setOperation('changeStatus')}
              disabled={loading}
            >
              Change Status
            </button>

            <button
              type="button"
              className={`${styles.operationButton} ${styles.deleteButton} ${operation === 'delete' ? styles.active : ''}`}
              onClick={() => setOperation('delete')}
              disabled={loading}
            >
              Delete Jobs
            </button>
          </div>

          {operation === 'changeStatus' && (
            <div className={styles.statusSection}>
              <label htmlFor="newStatus" className={styles.label}>
                New Status:
              </label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className={styles.select}
                disabled={loading}
              >
                <option value="applied">Applied (no response)</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}

          {operation === 'delete' && (
            <div className={styles.warningBox}>
              <p className={styles.warningText}>
                This action cannot be undone. All selected jobs will be permanently deleted.
              </p>
            </div>
          )}

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
              className={operation === 'delete' ? styles.confirmDeleteButton : modalBaseStyles.submitButton}
              disabled={!operation || loading}
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationModal;

