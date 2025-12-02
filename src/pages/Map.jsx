import { useReadings } from '../hooks/useReadings';
import config from '../config/config';

const Map = ({ onMachineClick }) => {
  const { data: readingsData, loading } = useReadings(config.pollingInterval);

  // Create a map of machine statuses by MachineID
  const machineStatuses = {};
  if (readingsData?.data) {
    // Filter and deduplicate - only track WM-01 through WM-04
    const uniqueMachines = readingsData.data
      .filter(reading => {
        const machineNum = parseInt(reading.data.MachineID.replace('WM-', ''));
        return machineNum >= 1 && machineNum <= 4;
      })
      .filter((reading, index, self) => 
        index === self.findIndex((r) => r.data.MachineID === reading.data.MachineID)
      );
    
    uniqueMachines.forEach(reading => {
      const machineId = reading.data.MachineID;
      machineStatuses[machineId] = reading.data.state;
    });
  }

  // Mini washer icon component
  const MiniWasher = ({ machineId, position }) => {
    const status = machineStatuses[machineId] || 'IDLE';
    const isRunning = status === 'RUNNING';
    const isOccupied = status === 'OCCUPIED';
    const color = isRunning ? '#4a7c8c' : isOccupied ? '#d4a017' : '#9bc14b';
    const bgColor = isRunning ? 'bg-[#4a7c8c]' : isOccupied ? 'bg-[#d4a017]' : 'bg-[#9bc14b]';

    return (
      <div 
        className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" 
        style={position}
        onClick={() => onMachineClick && onMachineClick(machineId)}
      >
        <svg width="60" height="75" viewBox="18 18 104 144" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="100" height="140" rx="10" fill={color} stroke={color} strokeWidth="2"/>
          <rect x="32" y="35" width="25" height="5" rx="2.5" fill="white" opacity="0.5"/>
          <circle cx="70" cy="100" r="42" fill="#e8f0f5" stroke={color} strokeWidth="3"/>
          <g className={isRunning ? 'animate-spin' : ''} style={{ transformOrigin: '70px 100px' }}>
            <circle cx="70" cy="100" r="32" fill="none" stroke={color} strokeWidth="2.5" opacity="0.6"/>
            <path d="M 48 100 Q 54 96 60 100 T 72 100 T 84 100 Q 90 96 92 100" stroke={color} strokeWidth="2.5" fill="none" opacity="0.4"/>
          </g>
        </svg>
        <div className={`${bgColor} text-white px-2 py-1 rounded text-xs font-medium mt-1`}>
          Washer {machineId.replace('WM-', '')}
        </div>
      </div>
    );
  };

  // Dryer icon component
  const Dryer = ({ position }) => {
    return (
      <div className="flex flex-col items-center" style={position}>
        <svg width="60" height="75" viewBox="18 18 104 144" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="100" height="140" rx="10" fill="#6B7280" stroke="#6B7280" strokeWidth="2"/>
          <rect x="32" y="35" width="25" height="5" rx="2.5" fill="white" opacity="0.5"/>
          <circle cx="70" cy="100" r="42" fill="#e8f0f5" stroke="#6B7280" strokeWidth="3"/>
          <circle cx="70" cy="100" r="32" fill="none" stroke="#6B7280" strokeWidth="2.5" opacity="0.6"/>
        </svg>
        <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium mt-1">
          Dryer
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Laundromat Layout</h1>
          <p className="text-gray-600 text-lg">Real-time view of machine locations and status</p>
          {loading && <p className="text-sm text-gray-500 mt-2">Updating status...</p>}
        </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#9bc14b] rounded"></div>
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#4a7c8c] rounded"></div>
              <span className="text-sm text-gray-700">In Use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#d4a017] rounded"></div>
              <span className="text-sm text-gray-700">Occupied</span>
            </div>
          </div>

          {/* Layout Map */}
          <div className="relative mx-auto max-w-full overflow-auto px-4 flex justify-center">
            <div className="relative" style={{ width: '800px', height: '650px', background: 'white' }}>
            {/* Outer border - black */}
            <div style={{ position: 'absolute', left: '0', top: '0', width: '800px', height: '650px', border: '2px solid black' }}></div>
            
            {/* Vertical wall after column 1 */}
            <div style={{ position: 'absolute', left: '198px', top: '5px', width: '20px', height: '485px', background: '#9CA3AF' }}></div>

            {/* Vertical wall before right section (shorter) */}
            <div style={{ position: 'absolute', left: '518px', top: '5px', width: '20px', height: '375px', background: '#9CA3AF' }}></div>
            
            {/* Horizontal wall forming T with vertical wall */}
            <div style={{ position: 'absolute', left: '428px', top: '360px', width: '200px', height: '20px', background: '#9CA3AF' }}></div>

            {/* Horizontal wall bottom left */}
            <div style={{ position: 'absolute', left: '198px', bottom: '160px', width: '140px', height: '20px', background: '#9CA3AF' }}></div>

            {/* Horizontal wall middle (below counter) */}
            <div style={{ position: 'absolute', left: '710px', top: '360px', width: '85px', height: '20px', background: '#9CA3AF' }}></div>

            {/* Door bottom */}
            <div style={{ position: 'absolute', left: '420px', bottom: '10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }}>Door</div>

            {/* Left Column (Machines 1-4) */}
            <div style={{ position: 'absolute', left: '95px', top: '30px' }}>
              <MiniWasher machineId="WM-01" />
            </div>
            <div style={{ position: 'absolute', left: '95px', top: '140px' }}>
              <MiniWasher machineId="WM-02" />
            </div>
            <div style={{ position: 'absolute', left: '95px', top: '250px' }}>
              <MiniWasher machineId="WM-03" />
            </div>
            <div style={{ position: 'absolute', left: '95px', top: '360px' }}>
              <MiniWasher machineId="WM-04" />
            </div>

            {/* Middle-Left Column (Machines 5-8) */}
            <div style={{ position: 'absolute', left: '239px', top: '30px' }}>
              <MiniWasher machineId="WM-05" />
            </div>
            <div style={{ position: 'absolute', left: '239px', top: '140px' }}>
              <MiniWasher machineId="WM-06" />
            </div>
            <div style={{ position: 'absolute', left: '239px', top: '250px' }}>
              <MiniWasher machineId="WM-07" />
            </div>
            <div style={{ position: 'absolute', left: '239px', top: '360px' }}>
              <MiniWasher machineId="WM-08" />
            </div>

            {/* Counter (gray background behind sinks) */}
            <div style={{ position: 'absolute', left: '428px', top: '5px', width: '90px', height: '355px', background: '#4B5563' }}></div>

            {/* Sinks */}
            <div style={{ position: 'absolute', left: '448px', top: '50px', width: '60px', height: '70px', background: '#60A5FA', borderRadius: '4px', border: '2px solid #2563EB' }}></div>
            <div style={{ position: 'absolute', left: '448px', top: '160px', width: '60px', height: '70px', background: '#60A5FA', borderRadius: '4px', border: '2px solid #2563EB' }}></div>

            {/* Right top machines (9, 10) */}
            <div style={{ position: 'absolute', left: '559px', top: '30px' }}>
              <MiniWasher machineId="WM-09" />
            </div>
            <div style={{ position: 'absolute', left: '559px', top: '250px' }}>
              <MiniWasher machineId="WM-10" />
            </div>

            {/* Far right machines (11) and dryers */}
            <div style={{ position: 'absolute', left: '715px', top: '30px' }}>
              <MiniWasher machineId="WM-11" />
            </div>
            <div style={{ position: 'absolute', left: '721px', top: '250px' }}>
              <Dryer />
            </div>
            <div style={{ position: 'absolute', left: '721px', top: '385px' }}>
              <Dryer />
            </div>

            {/* Bottom dryers - L shape */}
            <div style={{ position: 'absolute', left: '570px', bottom: '30px' }}>
              <Dryer />
            </div>
            <div style={{ position: 'absolute', left: '645px', bottom: '30px' }}>
              <Dryer />
            </div>
            <div style={{ position: 'absolute', left: '721px', bottom: '30px' }}>
              <Dryer />
            </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Map;
