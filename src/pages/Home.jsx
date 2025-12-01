import { WasherCard } from '../components/WasherCard';
import { useReadings } from '../hooks/useReadings';
import config from '../config/config';

const Home = ({ language = 'EN', onMachineClick }) => {
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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-7xl w-full mx-auto px-8">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-700 text-lg">Loading washer status...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl w-full mx-auto px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="py-8 px-8 text-center border-b">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Washing Machine Monitor</h1>
            <p className="text-gray-600 text-lg">Real-time monitoring of your washing machines</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 mx-8 mt-6 rounded-lg">
              <p className="text-lg">{error}</p>
              <button onClick={handleRefresh} className="mt-2 underline text-base">Try again</button>
            </div>
          )}

          <div className="p-8">
            {displayData?.data && displayData.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayData.data
                  .filter(reading => {
                    const machineNum = parseInt(reading.data.MachineID.replace('WM-', ''));
                    return machineNum >= 1 && machineNum <= 4;
                  })
                  .filter((reading, index, self) => 
                    index === self.findIndex((r) => r.data.MachineID === reading.data.MachineID)
                  )
                  .sort((a, b) => {
                    const numA = parseInt(a.data.MachineID.replace('WM-', ''));
                    const numB = parseInt(b.data.MachineID.replace('WM-', ''));
                    return numA - numB;
                  })
                  .slice(0, 4)
                  .map((reading) => {
                    // Map API data to WasherCard format
                    const state = reading.data.state;
                    let status = 'AVAILABLE';
                    if (state === 'RUNNING') {
                      status = 'IN USE';
                    } else if (state === 'OCCUPIED') {
                      status = 'OCCUPIED';
                    } else if (state === 'IDLE') {
                      status = 'AVAILABLE';
                    }
                    
                    const machineNum = parseInt(reading.data.MachineID.replace('WM-', ''));
                    const washer = {
                      id: reading.machine_id,
                      name: `Washer ${machineNum}`,
                      capacity: '7kg',
                      status: status,
                      timeLeft: state === 'RUNNING' ? 'Unknown' : null,
                      progress: state === 'RUNNING' ? 50 : 0
                    };
                    
                    return (
                      <WasherCard
                        key={reading.id}
                        washer={washer}
                        language={language}
                        onClick={() => onMachineClick && onMachineClick(reading.data.MachineID)}
                      />
                    );
                  })}
              </div>
            ) : (
              <div className="py-12">
                <p className="text-gray-500 text-center text-lg">No machine data available</p>
              </div>
            )}
          </div>

          {/* Refresh button */}
          <div className="text-center py-6 px-8 border-t">
            <button onClick={handleRefresh} disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-base font-medium transition-colors">
              {loading ? 'Refreshing...' : 'Refresh now'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;