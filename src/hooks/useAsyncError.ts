import { useCallback, useState } from 'react';
import {
  type ErrorInfo,
  parseError,
  showErrorNotification,
} from '../utils/errorHandler';

interface UseAsyncErrorReturn {
  error: string | null;
  setError: (error: string | null) => void;
  handleAsyncError: (error: unknown, context?: string) => ErrorInfo;
  clearError: () => void;
  retry: (asyncFunction: () => Promise<void>) => Promise<void>;
}

export const useAsyncError = (): UseAsyncErrorReturn => {
  const [error, setError] = useState<string | null>(null);

  const handleAsyncError = useCallback(
    (error: unknown, context?: string): ErrorInfo => {
      const errorInfo = showErrorNotification(error, context);
      setError(errorInfo.message);
      return errorInfo;
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(
    async (asyncFunction: () => Promise<void>) => {
      clearError();
      try {
        await asyncFunction();
      } catch (err) {
        handleAsyncError(err, 'retrying operation');
      }
    },
    [clearError, handleAsyncError],
  );

  return {
    error,
    setError,
    handleAsyncError,
    clearError,
    retry,
  };
};
