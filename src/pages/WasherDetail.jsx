import { useReadings } from '../hooks/useReadings';
import config from '../config/config';

const WasherDetail = ({ machineId, onBack, language }) => {
  const { data: readingsData, loading, error } = useReadings(config.pollingInterval);

  // Find the specific machine data
  const machineData = readingsData?.data?.find(
    reading => reading.data.MachineID === machineId
  );

  const state = machineData?.data?.state || 'IDLE';
  const isAvailable = state === 'IDLE';
  const isOccupied = state === 'OCCUPIED';
  const isInUse = state === 'RUNNING';

  const getStatusText = () => {
    if (language === 'ZH') {
      if (isInUse) return '使用中';
      if (isOccupied) return '已完成';
      return '可用';
    }
    if (isInUse) return 'IN USE';
    if (isOccupied) return 'OCCUPIED';
    return 'AVAILABLE';
  };

  const getStatusColor = () => {
    if (isInUse) return '#4a7c8c';
    if (isOccupied) return '#d4a017';
    return '#9bc14b';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error loading machine data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
          </svg>
          <span className="font-medium">Back</span>
        </button>

        {/* Machine Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{machineId}</h1>
            <div className="inline-block">
              <span 
                className="px-4 py-2 rounded-full text-white font-semibold text-lg"
                style={{ backgroundColor: getStatusColor() }}
              >
                {getStatusText()}
              </span>
            </div>
          </div>

          {/* Large Washing Machine Visualization */}
          <div className="flex justify-center mb-8">
            <svg width="300" height="400" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="120" height="160" rx="12" fill={getStatusColor()} stroke={getStatusColor()} strokeWidth="2"/>
              <rect x="20" y="20" width="40" height="8" rx="4" fill="white" opacity="0.5"/>
              <circle cx="70" cy="105" r="45" fill="#e8f0f5" stroke={getStatusColor()} strokeWidth="3"/>
              
              {isInUse && (
                <g className="animate-spin" style={{ transformOrigin: '70px 105px' }}>
                  <circle cx="70" cy="105" r="35" fill="none" stroke={getStatusColor()} strokeWidth="3" opacity="0.6"/>
                  <line x1="70" y1="70" x2="70" y2="80" stroke={getStatusColor()} strokeWidth="2"/>
                  <line x1="70" y1="130" x2="70" y2="140" stroke={getStatusColor()} strokeWidth="2"/>
                  <line x1="35" y1="105" x2="45" y2="105" stroke={getStatusColor()} strokeWidth="2"/>
                  <line x1="95" y1="105" x2="105" y2="105" stroke={getStatusColor()} strokeWidth="2"/>
                </g>
              )}
              
              {isAvailable && (
                <ellipse cx="95" cy="105" rx="28" ry="45" fill="white" opacity="0.7" stroke={getStatusColor()} strokeWidth="2"/>
              )}
              
              {isOccupied && (
                <image href="/images/sticker.webp" x="55" y="120" width="30" height="30"/>
              )}
            </svg>
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Machine ID</h3>
              <p className="text-2xl font-bold text-gray-900">{machineId}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Current Status</h3>
              <p className="text-2xl font-bold" style={{ color: getStatusColor() }}>
                {getStatusText()}
              </p>
            </div>
          </div>

          {/* Additional Info based on state */}
          {isInUse && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {language === 'ZH' ? '洗衣中' : 'Washing in Progress'}
              </h3>
              <p className="text-blue-700">
                {language === 'ZH' 
                  ? '此洗衣机正在运行中，请勿打开。' 
                  : 'This machine is currently in use. Please do not open.'}
              </p>
            </div>
          )}

          {isOccupied && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                {language === 'ZH' ? '洗衣完成' : 'Cycle Complete'}
              </h3>
              <p className="text-yellow-700">
                {language === 'ZH' 
                  ? '洗衣已完成。请取出衣物。' 
                  : 'Washing cycle is complete. Please remove your laundry.'}
              </p>
            </div>
          )}

          {isAvailable && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                {language === 'ZH' ? '可用' : 'Available'}
              </h3>
              <p className="text-green-700">
                {language === 'ZH' 
                  ? '此洗衣机可供使用。' 
                  : 'This machine is available for use.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasherDetail;
