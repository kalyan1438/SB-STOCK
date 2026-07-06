import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useAsync<T>(loader: () => Promise<T>, dependencies: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const run = useCallback(async () => {
    try {
      setLoading(true);
      const result = await loader();
      setData(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, refetch: run, setData };
}

