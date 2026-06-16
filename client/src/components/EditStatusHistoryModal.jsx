import { useState, useEffect } from 'react';
import styles from './AddJobModal.module.css';
import modalStyles from './NestedModal.module.css';

const toDatetimeLocalValue = (dateString) => {
  const date = new Date(dateString);
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

function EditStatusHistoryModal({ isOpen, onClose, onSubmit, entry }) {
  const [formData, setFormData] = useState({
    status: 'applied',
    changed_at: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (entry) {
      setFormData({
        status: entry.status || 'applied',
        changed_at: entry.changed_at ? toDatetimeLocalValue(entry.changed_at) : '',
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.changed_at) {
      setError('Date and time are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(entry.id, {
        status: formData.status,
        changed_at: new Date(formData.changed_at).toISOString(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update history entry');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen || !entry) return null;

  return (
    <div className={`${styles.modalOverlay} ${modalStyles.overlay}`} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit History Entry</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="history_status" className={styles.label}>
              Status
            </label>
            <select
              id="history_status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
              disabled={loading}
            >
              <option value="applied">Applied (no response)</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="changed_at" className={styles.label}>
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="changed_at"
              name="changed_at"
              value={formData.changed_at}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStatusHistoryModal;
