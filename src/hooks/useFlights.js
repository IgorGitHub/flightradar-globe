import { useEffect, useRef } from 'react';
import useFlightStore from '../store/useFlightStore';

const REFRESH_INTERVAL = 10000;

export function useFlights() {
const { setFlights, setError, setLoading, autoRefresh } = useFlightStore();
const intervalRef = useRef(null);

const fetchFlights = async () => {
  try {
    const res = await fetch('/api/flights');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setFlights(data.flights || []);
  } catch (err) {
    console.error('Fetch flights error:', err);
    setError(err.message);
  }
};

useEffect(() => {
  setLoading(true);
  fetchFlights();

  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, []);

useEffect(() => {
  if (intervalRef.current) clearInterval(intervalRef.current);

  if (autoRefresh) {
    intervalRef.current = setInterval(fetchFlights, REFRESH_INTERVAL);
  }

  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [autoRefresh]);

return { refetch: fetchFlights };
}
