import { useState, useEffect } from 'react';
import { WasherCard } from '../components/WasherCard';

// Mock data structure - replace with actual API response
const MOCK_WASHERS = [
  {
    id: 1,
    name: "Washer 1",
    capacity: "10kg",
    status: "MACHINE IN USE",
    timeLeft: "10 min",
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
      
      // ============================================================
      // AWS API INTEGRATION - Uncomment and configure when ready
      // ============================================================
      // const response = await fetch(config.apiEndpoint + '/washers', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Uncomment if your API Gateway requires an API key
      //     // 'x-api-key': config.apiKey,
      //   },
      //   signal: AbortSignal.timeout(config.requestTimeout),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      // }
      // 
      // const washerData = await response.json();
      // setWashers(washerData);
      // ============================================================
      
      // MOCK DATA - Remove this section when using real API
      await new Promise(resolve => setTimeout(resolve, 500));
      setWashers(MOCK_WASHERS);
      // END MOCK DATA
      
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
      <div>
        <div>
          <div></div>
          <p>Loading washer status...</p>
        </div>
      </div>
    );
  }

  return (
    <main id="main" className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="py-6 px-4 text-center border-b">
            <p className="text-gray-700">Real-time monitoring of your washing machines</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-center">
              <p>{error}</p>
              <button onClick={handleRefresh} className="mt-2 underline">Try again</button>
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
          <div className="text-center py-4 px-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <button onClick={handleRefresh} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Refreshing...' : 'Refresh now'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;