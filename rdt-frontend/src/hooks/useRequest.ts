import { useCallback, useState } from 'react';

interface UseRequestOptions<T, R> {
  manual?: boolean;
  onSuccess?: (data: R, params: unknown[]) => void;
  onError?: (error: Error, params: unknown[]) => void;
  formatResult?: (data: T) => R;
}

/**
 * Custom hook to manage asynchronous requests.
 * @param service - The async function to execute.
 * @param options - Configuration options for the request.
 * @returns Object containing data, loading state, error, and run function.
 */
export function useRequest<T = unknown, R = T>(
  service: (params?: unknown) => Promise<T>,
  options: UseRequestOptions<T, R> = {}
) {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState<boolean>(!options.manual);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (params?: unknown) => {
      setLoading(true);
      setError(null);
      try {
        const response = await service(params);
        let formattedData = response as unknown as R;
        if (options.formatResult) {
          formattedData = options.formatResult(response);
        }
        setData(formattedData);
        if (options.onSuccess) {
          // Normalize params to array for consistency or pass as is if expected
          // Given the usage, params might be single value
          options.onSuccess(formattedData, Array.isArray(params) ? params : [params]);
        }
        return formattedData;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        if (options.onError) {
          options.onError(errorObj, Array.isArray(params) ? params : [params]);
        }
        throw errorObj;
      } finally {
        setLoading(false);
      }
    },
    [service, options]
  );

  return {
    data,
    loading,
    error,
    run,
  };
}
