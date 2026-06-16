import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { applicationAPI } from '../utils/api';

export const useApplications = (options = {}) => {
  const { enabled = true } = options;
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    if (!isAuthenticated) {
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await applicationAPI.getAll(getAccessTokenSilently);
      setApplications(response.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // Optimistic update function for immediate UI updates
  const updateApplicationOptimistic = useCallback((jobId, updates) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === jobId ? { ...app, ...updates } : app
      )
    );
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    fetchApplications();
  }, [fetchApplications, enabled]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    updateApplicationOptimistic,
  };
};

