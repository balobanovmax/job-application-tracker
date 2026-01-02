import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { applicationAPI } from '../utils/api';

export const useApplications = () => {
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

      const data = await applicationAPI.getAll(getAccessTokenSilently);
      setApplications(data.applications || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
};

