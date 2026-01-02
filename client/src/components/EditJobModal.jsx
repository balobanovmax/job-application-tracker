import { useState, useEffect } from 'react';
import styles from './AddJobModal.module.css';

function EditJobModal({ isOpen, onClose, onSubmit, job }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'applied',
    date_applied: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company || '',
        role: job.role || '',
        status: job.status || 'applied',
        date_applied: job.date_applied ? new Date(job.date_applied).toISOString().split('T')[0] : '',
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company.trim() || !formData.role.trim()) {
      setError('Company and role are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(job.id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update job');
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

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Job Application</h2>
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
            <label htmlFor="company" className={styles.label}>
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., Google"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>
              Role *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., Software Engineer"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
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
            <label htmlFor="date_applied" className={styles.label}>
              Date Applied
            </label>
            <input
              type="date"
              id="date_applied"
              name="date_applied"
              value={formData.date_applied}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
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
              {loading ? 'Updating...' : 'Done'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJobModal;

