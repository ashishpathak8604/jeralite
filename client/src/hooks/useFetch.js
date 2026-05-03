import { useState, useEffect, useCallback } from 'react';
import useAuth from './useAuth';

/**
 * Auth-aware data fetching hook.
 * Will NOT fire any API call until:
 *   1. authLoading is false (Firebase has initialized)
 *   2. currentUser is present (user is logged in)
 *
 * This prevents 401 errors on fresh devices where Firebase takes
 * a moment to restore the session before making API calls.
 */
const useFetch = (fetchFunction, dependencies = []) => {
  const { authLoading, currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    // Guard: do not fire if auth is not ready or user is not logged in
    if (authLoading || !currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, authLoading, currentUser]);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, currentUser, ...dependencies]);

  return { data, loading, error, refetch: execute };
};

export default useFetch;
