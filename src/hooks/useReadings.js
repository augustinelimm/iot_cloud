import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch IoT readings data from the API
 * @param {number} interval - Optional polling interval in milliseconds (default: no polling)
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useReadings = (interval = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReadings = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_READINGS_API || '/api/readings';
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const jsonData = await response.json();
      console.log('Fetched readings:', jsonData);
      
      setData(jsonData);
      setError(null);
    } catch (err) {
      console.error('Error fetching readings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();

    // Set up polling if interval is provided
    if (interval) {
      const intervalId = setInterval(fetchReadings, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval]);

  return { data, loading, error, refetch: fetchReadings };
};
