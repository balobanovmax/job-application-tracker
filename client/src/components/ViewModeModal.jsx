import { useState, useEffect } from 'react';
import styles from './AddJobModal.module.css';
import viewModeStyles from './ViewModeModal.module.css';

const VIEW_OPTIONS = [
  { value: 'tiles', label: 'Tile View' },
  { value: 'list', label: 'List View' },
];

function ViewModeModal({ isOpen, onClose, onApplyViewMode, initialViewMode }) {
  const [selectedViewMode, setSelectedViewMode] = useState('tiles');

  useEffect(() => {
    if (isOpen) {
      setSelectedViewMode(initialViewMode || 'tiles');
    }
  }, [isOpen, initialViewMode]);

  const handleApply = () => {
    onApplyViewMode(selectedViewMode);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Change View Mode</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.form}>
          <div className={viewModeStyles.viewSection}>
            <fieldset className={viewModeStyles.fieldset}>
              <legend className={viewModeStyles.legend}>Display Mode</legend>
              <div className={viewModeStyles.radioGroup}>
                {VIEW_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`${viewModeStyles.radioOption} ${
                      selectedViewMode === option.value ? viewModeStyles.radioActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="viewMode"
                      value={option.value}
                      checked={selectedViewMode === option.value}
                      onChange={() => setSelectedViewMode(option.value)}
                      className={viewModeStyles.radioInput}
                    />
                    <span className={viewModeStyles.radioLabel}>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="button" onClick={handleApply} className={styles.submitButton}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewModeModal;
