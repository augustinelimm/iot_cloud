// API helper function for fetching readings
export const fetchReadings = async () => {
  const apiUrl = import.meta.env.VITE_READINGS_API || '/api/readings';
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
