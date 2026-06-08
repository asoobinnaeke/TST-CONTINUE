import { useEffect, useRef, useState } from "react";

/** Tiny data-fetching hook with optional polling.
 * Usage: const { data, error, loading, refetch } = useFetch(api.getDashboard, { pollMs: 3000 });
 */
export function useFetch(fn, { pollMs, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = async () => {
    try {
      const d = await fnRef.current();
      if (!mounted.current) return;
      setData(d);
      setError(null);
    } catch (e) {
      if (!mounted.current) return;
      setError(e);
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    run();
    let t;
    if (pollMs) t = setInterval(run, pollMs);
    return () => {
      mounted.current = false;
      if (t) clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, refetch: run };
}
