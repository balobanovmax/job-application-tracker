import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { userAPI } from '../utils/api';

export const useUser = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user: auth0User } = useAuth0();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncUser = async () => {
      if (isLoading) {
        return;
      }

      if (!isAuthenticated) {
        setDbUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Call backend to find or create user using API utility
        const data = await userAPI.getCurrentUser(getAccessTokenSilently);
        setDbUser(data.user);
      } catch (err) {
        console.error('Error syncing user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  return {
    user: dbUser,
    auth0User,
    loading,
    error,
    isAuthenticated,
  };
};

