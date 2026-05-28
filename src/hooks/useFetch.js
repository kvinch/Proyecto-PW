import { useState, useEffect } from "react";

/* ══════════════════════════════════════════
   HOOK: useFetch genérico
   ══════════════════════════════════════════ */
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url)
        if (!res.ok) {
          setError(`HTTP ${res.status}`)
          setLoading(false)
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json()
        setData(json)
        setLoading(false)
      } catch (e) {
        setError(`Error: ${e}`)
        setLoading(false)
        //throw new Error(`Error: ${e}`);
      }
    }
    fetchData()
  }, [url]);

  return { data, loading, error };
}

export default useFetch