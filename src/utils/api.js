// Single source of truth for API configuration
export const API_BASE =
  import.meta.env.VITE_API_ENDPOINT || 'https://api.iotwasher.com';

// API helper functions
export const fetchWashers = async () => {
  const response = await fetch(`${API_BASE}/washers`, {
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
