import { WasherCard } from '../components/WasherCard';
import { useReadings } from '../hooks/useReadings';
import config from '../config/config';

const Home = () => {
  const { data: readingsData, loading, error, refetch } = useReadings(config.pollingInterval);

  // ===== MOCK DATA - Comment out to use real API =====
  const mockData = {
    success: true,
    data: [
      {
        id: "1",
        data: {
          state: "RUNNING",
          current: 2.35,
          MachineID: "WM-01",
          timestamp: "2025-11-29T10:30:00.000Z",
          cycle_number: 12
        },
        created_at: "2025-11-29T10:30:00.000Z"
      },
      {
        id: "2",
        data: {
          state: "AVAILABLE",
          current: 0,
          MachineID: "WM-02",
          timestamp: "2025-11-29T10:30:00.000Z",
          cycle_number: 8
        },
        created_at: "2025-11-29T10:30:00.000Z"
      },
      {
        id: "3",
        data: {
          state: "RUNNING",
          current: 1.85,
          MachineID: "WM-03",
          timestamp: "2025-11-29T10:30:00.000Z",
          cycle_number: 5
        },
        created_at: "2025-11-29T10:30:00.000Z"
      }
    ],
    count: 3
  };
  // const displayData = mockData; // Use mock data
  const displayData = readingsData; // Uncomment to use real API
  // ===== END MOCK DATA =====

  const handleRefresh = () => {
    refetch();
  };

  if (loading && !displayData) {
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
            {displayData?.data && displayData.data.length > 0 ? (
              displayData.data.map((reading) => {
                // Map API data to WasherCard format
                const washer = {
                  id: reading.id,
                  name: reading.data.MachineID,
                  capacity: '7kg', // You can adjust this or get from API if available
                  status: reading.data.state === 'RUNNING' ? 'IN USE' : 'AVAILABLE',
                  timeLeft: reading.data.state === 'RUNNING' ? 'Unknown' : null,
                  progress: reading.data.state === 'RUNNING' ? 50 : 0 // You can calculate this based on cycle data
                };
                
                return (
                  <WasherCard
                    key={reading.id}
                    washer={washer}
                  />
                );
              })
            ) : (
              <div className="p-6">
                <p className="text-gray-500 text-center">No machine data available</p>
              </div>
            )}
          </div>

          {/* Refresh button */}
          <div className="text-center py-4 px-4 border-t">
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