import { useCallback, useEffect, useState } from 'react';

// Veri çeken her sayfada tekrarlanan data / loading / error kalıbını tek yerde toplar.
// Kullanım: const { data, loading, error, refetch } = useFetch(() => listProducts(params), [params]);
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetcher();
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
