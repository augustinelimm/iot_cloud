import { useState } from 'react';
import { WasherCard } from '../components/WasherCard';
import { useReadings } from '../hooks/useReadings';
import config from '../config/config';

const Home = () => {
  const { data: readingsData, loading, error, refetch } = useReadings(config.pollingInterval);
  const [lastUpdated] = useState(new Date());

  const handleRefresh = () => {
    refetch();
  };

  if (loading && !readingsData) {
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

          <div className="p-6">
            {readingsData?.data && readingsData.data.length > 0 ? (
              <ul className="space-y-4">
                {readingsData.data.map((reading) => (
                  <li key={reading.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-2">
                      <span className="font-semibold">Status: </span>
                      <span className={reading.data.state === 'RUNNING' ? 'text-green-600' : 'text-gray-600'}>
                        {reading.data.state === 'RUNNING' ? 'Machine in use' : reading.data.state}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Machine ID: </span>
                      {reading.data.MachineID}
                    </div>
                    <div>
                      <span className="font-semibold">Cycle Number: </span>
                      {reading.data.cycle_number}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No machine data available</p>
            )}
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