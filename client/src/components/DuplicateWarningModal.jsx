import modalBaseStyles from './AddJobModal.module.css';
import styles from './DuplicateWarningModal.module.css';

const DuplicateWarningModal = ({ isOpen, onClose, onConfirm, duplicateInfo }) => {
  if (!isOpen) return null;

  return (
    <div className={modalBaseStyles.modalOverlay} onClick={onClose}>
      <div className={modalBaseStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={modalBaseStyles.modalHeader}>
          <h2 className={modalBaseStyles.modalTitle}>Possible Duplicate Job</h2>
          <button onClick={onClose} className={modalBaseStyles.closeButton}>
            &times;
          </button>
        </div>
        <div className={modalBaseStyles.form}>
          <div className={styles.warningIcon}>⚠️</div>
          <p className={styles.warningText}>
            Is this a different job?
          </p>
          <p className={styles.duplicateDetails}>
            There already exists a job with this exact company name and role:
          </p>
          <div className={styles.duplicateCard}>
            <div className={styles.duplicateField}>
              <span className={styles.fieldLabel}>Company:</span>
              <span className={styles.fieldValue}>{duplicateInfo?.company}</span>
            </div>
            <div className={styles.duplicateField}>
              <span className={styles.fieldLabel}>Role:</span>
              <span className={styles.fieldValue}>{duplicateInfo?.role}</span>
            </div>
            {duplicateInfo?.existingCount > 1 && (
              <div className={styles.duplicateCount}>
                You have {duplicateInfo.existingCount} existing application{duplicateInfo.existingCount !== 1 ? 's' : ''} with these details.
              </div>
            )}
          </div>

          <div className={modalBaseStyles.formActions}>
            <button 
              type="button" 
              onClick={onClose} 
              className={modalBaseStyles.cancelButton}
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={onConfirm} 
              className={styles.confirmButton}
            >
              Yes, Add Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateWarningModal;

