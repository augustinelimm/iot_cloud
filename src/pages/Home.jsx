import { useState, useEffect } from 'react';
import { WasherCard } from '../components/WasherCard';
import { fetchWashers } from '../utils/api';
import config from '../config/config';

const Home = () => {
  const [washers, setWashers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchWasherStatus = async () => {
    try {
      setError(null);
      const washerData = await fetchWashers();
      setWashers(washerData);
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
    
    // Set up automatic polling using config.pollingInterval (30 seconds)
    const pollingInterval = setInterval(fetchWasherStatus, config.pollingInterval);
    
    // Clean up interval when component unmounts
    return () => clearInterval(pollingInterval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchWasherStatus();
  };

  if (loading && washers.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-700">Loading washer status...</p>
          </div>
        </div>
      </main>
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