import { useState, useEffect } from 'react';
import { WasherCard } from '../components/WasherCard';

// Mock data structure - replace with your actual API response
const MOCK_WASHERS = [
  {
    id: 1,
    name: "Washer 1",
    capacity: "10kg",
    status: "MACHINE IN USE",
    timeLeft: "18 min",
    progress: 65
  },
  {
    id: 2,
    name: "Washer 2",
    capacity: "10kg",
    status: "MACHINE IN USE",
    timeLeft: "22 min",
    progress: 45
  },
  {
    id: 3,
    name: "Washer 3",
    capacity: "8kg",
    status: "AVAILABLE",
    timeLeft: null,
    progress: 0
  },
  {
    id: 4,
    name: "Washer 4",
    capacity: "12kg",
    status: "AVAILABLE",
    timeLeft: null,
    progress: 0
  }
];

const Home = () => {
  const [washers, setWashers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchWasherStatus = async () => {
    try {
      setError(null);
      
      // TODO: Replace with your actual AWS API endpoint
      // const apiResponse = await fetch('https://your-api-endpoint.com/washers');
      // if (!apiResponse.ok) {
      //   throw new Error(`Failed to fetch: ${apiResponse.status}`);
      // }
      // const washerData = await apiResponse.json();
      // setWashers(washerData);
      
      // For now, simulate API call with mock data and network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setWashers(MOCK_WASHERS);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch washer status:', error);
      setError('Unable to load washer status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch washer status on initial load
    fetchWasherStatus();
    
    // Set up automatic polling every 30 seconds for real-time updates
    const pollingInterval = setInterval(fetchWasherStatus, 30000);
    
    // Clean up interval when component unmounts
    return () => clearInterval(pollingInterval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchWasherStatus();
  };

  if (loading && washers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading washer status...</p>
        </div>
      </div>
    );
  }

  return (
    <main id="main" className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="pt-6 pb-4 px-6 text-center">

            <p className="text-gray-700 text-base">Real-time monitoring of your washing machines</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-center">
              <p>{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          <div>
            {washers.map((washer) => (
              <WasherCard
                key={washer.id}
                washer={washer}
              />
            ))}
          </div>

          {/* Last updated timestamp and refresh button */}
          <div className="text-center py-6 px-6 bg-white">
            <p className="text-sm text-gray-600 mb-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh now'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;