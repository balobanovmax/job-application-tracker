import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './AddJobModal.module.css';
import StatusHistory from './StatusHistory';
import ClearStatusHistoryModal from './ClearStatusHistoryModal';
import EditStatusHistoryModal from './EditStatusHistoryModal';
import { applicationAPI } from '../utils/api';

function EditJobModal({ isOpen, onClose, onSubmit, job, onHistoryChange }) {
  const { getAccessTokenSilently } = useAuth0();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'applied',
    date_applied: '',
    notes: '',
    application_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState(null);

  const fetchStatusHistory = useCallback(async () => {
    if (!job?.id) {
      return;
    }

    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const response = await applicationAPI.getStatusHistory(getAccessTokenSilently, job.id);
      setStatusHistory(response.data || []);
    } catch (err) {
      console.error('Failed to load status history:', err);
      setHistoryError('Could not load status history.');
      setStatusHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [job?.id, getAccessTokenSilently]);

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company || '',
        role: job.role || '',
        status: job.status || 'applied',
        date_applied: job.date_applied ? new Date(job.date_applied).toISOString().split('T')[0] : '',
        notes: job.notes || '',
        application_url: job.application_url || '',
      });
    }
  }, [job]);

  useEffect(() => {
    if (isOpen && job?.id) {
      fetchStatusHistory();
    }
  }, [isOpen, job?.id, fetchStatusHistory]);

  const handleClearStatusHistory = async () => {
    if (!job?.id) {
      return;
    }

    try {
      setHistoryError(null);
      await applicationAPI.clearStatusHistory(getAccessTokenSilently, job.id);
      setStatusHistory([]);
      onHistoryChange?.();
    } catch (err) {
      console.error('Failed to clear status history:', err);
      setHistoryError('Could not clear status history.');
      throw err;
    }
  };

  const handleUpdateHistoryEntry = async (historyId, data) => {
    if (!job?.id) {
      return;
    }

    await applicationAPI.updateStatusHistoryEntry(
      getAccessTokenSilently,
      job.id,
      historyId,
      data
    );

    const response = await applicationAPI.getStatusHistory(getAccessTokenSilently, job.id);
    const history = response.data || [];
    setStatusHistory(history);

    if (history.length > 0) {
      const latestEntry = history[history.length - 1];
      setFormData((prev) => ({ ...prev, status: latestEntry.status }));
    }

    onHistoryChange?.();
  };

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

    if (formData.notes && formData.notes.length > 50) {
      setError('Notes must be 50 characters or less');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        notes: formData.notes.trim() || null,
        application_url: formData.application_url.trim() || null
      };
      await onSubmit(job.id, dataToSubmit);
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
      setIsClearHistoryModalOpen(false);
      setEditingHistoryEntry(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
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

            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.label}>
                Notes <span className={styles.optional}>(Optional, max 50 chars)</span>
              </label>
              <input
                type="text"
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., Referral from John"
                maxLength={50}
                disabled={loading}
              />
              <div className={styles.charCounter}>
                {formData.notes.length}/50
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="application_url" className={styles.label}>
                Application URL <span className={styles.optional}>(Optional)</span>
              </label>
              <input
                type="url"
                id="application_url"
                name="application_url"
                value={formData.application_url}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., https://jobs.company.com/apply/123"
                disabled={loading}
              />
            </div>

            <StatusHistory
              history={statusHistory}
              loading={historyLoading}
              error={historyError}
              onClear={() => setIsClearHistoryModalOpen(true)}
              onEditEntry={setEditingHistoryEntry}
            />

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

      <ClearStatusHistoryModal
        isOpen={isClearHistoryModalOpen}
        onClose={() => setIsClearHistoryModalOpen(false)}
        onConfirm={handleClearStatusHistory}
        job={job}
      />

      <EditStatusHistoryModal
        isOpen={Boolean(editingHistoryEntry)}
        onClose={() => setEditingHistoryEntry(null)}
        onSubmit={handleUpdateHistoryEntry}
        entry={editingHistoryEntry}
      />
    </>
  );
}

export default EditJobModal;
