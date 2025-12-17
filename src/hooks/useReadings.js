import { useState, useEffect } from 'react';

// Mock data for machines 5-11
const getMockData = () => {
  const mockMachines = [
    { id: 'WM-05', state: 'RUNNING', ml_phase: 'WASHING', current: 195.5, cycle_number: 87 },
    { id: 'WM-06', state: 'IDLE', ml_phase: null, current: 0, cycle_number: 45 },
    { id: 'WM-07', state: 'OCCUPIED', ml_phase: null, current: 0, cycle_number: 37 },
    { id: 'WM-08', state: 'RUNNING', ml_phase: 'RINSE', current: 82.3, cycle_number: 42 },
    { id: 'WM-09', state: 'IDLE', ml_phase: null, current: 0, cycle_number: 98 },
    { id: 'WM-10', state: 'OCCUPIED', ml_phase: null, current: 0, cycle_number: 231 },
    { id: 'WM-11', state: 'RUNNING', ml_phase: 'SPINNING', current: 156.7, cycle_number: 178 },
  ];

  return mockMachines.map((machine, index) => ({
    id: `mock-${index + 5}`,
    data: {
      state: machine.state,
      current: machine.current,
      MachineID: machine.id,
      ml_phase: machine.ml_phase,
      timestamp: new Date().toISOString(),
      cycle_number: machine.cycle_number,
      door_opened: false,
      ml_confidence: machine.ml_phase ? 0.7 + Math.random() * 0.2 : undefined
    },
    created_at: new Date().toISOString()
  }));
};

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
      const apiUrl = 'http://13.214.142.44:3000/api/readings';
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const jsonData = await response.json();
      // Merge real data with mock data for machines 5-11
      const mockData = getMockData();
      const mergedData = {
        ...jsonData,
        data: [...(jsonData.data || []), ...mockData],
        count: (jsonData.count || 0) + mockData.length
      };
      
      setData(mergedData);
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
