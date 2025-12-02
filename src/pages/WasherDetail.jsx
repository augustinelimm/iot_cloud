import { useReadings } from '../hooks/useReadings';
import config from '../config/config';

const WasherDetail = ({ machineId, onBack, language }) => {
  const { data: readingsData, loading, error } = useReadings(config.pollingInterval);

  // Find the specific machine data
  const machineData = readingsData?.data?.find(
    reading => reading.data.MachineID === machineId
  );

  const state = machineData?.data?.state || 'IDLE';
  const currentPhase = machineData?.data?.ml_phase || null;
  const isAvailable = state === 'IDLE';
  const isOccupied = state === 'OCCUPIED';
  const isInUse = state === 'RUNNING';

  const phases = ['WASHING', 'RINSE', 'SPINNING'];
  
  const getPhaseStatus = (phase) => {
    if (!currentPhase) return 'pending';
    const currentIndex = phases.indexOf(currentPhase);
    const phaseIndex = phases.indexOf(phase);
    
    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'active';
    return 'pending';
  };

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
      <div className="min-h-screen bg-white flex items-center justify-center py-12">
        <div className="max-w-7xl w-full mx-auto px-8">
          <div className="p-12 text-center">
            <div className="inline-block mb-6">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="50" fill="#e8f0f5" stroke="#4a7c8c" strokeWidth="4"/>
                <g className="animate-spin" style={{ transformOrigin: '60px 60px' }}>
                  <circle cx="60" cy="60" r="38" fill="none" stroke="#4a7c8c" strokeWidth="3" opacity="0.6"/>
                  <path d="M 32 60 Q 40 55 48 60 T 64 60 T 80 60 Q 86 55 88 60" stroke="#4a7c8c" strokeWidth="3" fill="none" opacity="0.5"/>
                  <circle cx="60" cy="30" r="6" fill="#60a5fa" opacity="0.7"/>
                  <circle cx="75" cy="45" r="5" fill="#93c5fd" opacity="0.6"/>
                  <circle cx="45" cy="45" r="5" fill="#93c5fd" opacity="0.6"/>
                  <circle cx="60" cy="90" r="6" fill="#60a5fa" opacity="0.7"/>
                </g>
              </svg>
            </div>
            <p className="text-gray-700 text-lg">Loading washer details...</p>
          </div>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">{machineId}</h1>
          </div>

          {/* Large Washing Machine Visualization */}
          <div className="flex justify-center mb-8">
            <svg width="280" height="360" viewBox="18 18 104 144" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Washer body */}
              <rect x="20" y="20" width="100" height="140" rx="10" fill={getStatusColor()} stroke={getStatusColor()} strokeWidth="2"/>
              
              {/* Control panel - top section */}
              <rect x="32" y="35" width="25" height="5" rx="2.5" fill="white" opacity="0.5"/>
              <rect x="65" y="35" width="12" height="5" rx="2.5" fill="white" opacity="0.5"/>
              <rect x="82" y="35" width="12" height="5" rx="2.5" fill="white" opacity="0.5"/>
              <rect x="99" y="35" width="12" height="5" rx="2.5" fill="white" opacity="0.5"/>
              
              {/* Door outer circle - white background */}
              <circle cx="70" cy="100" r="42" fill="#e8f0f5" stroke={getStatusColor()} strokeWidth="3"/>
              
              {/* Clip path for circular boundary */}
              <defs>
                <clipPath id="drumClipDetail">
                  <circle cx="70" cy="100" r="32"/>
                </clipPath>
              </defs>
              
              {/* Door inner circle with spinning animation when in use */}
              <g className={isInUse ? 'animate-spin' : ''} style={{ transformOrigin: '70px 100px' }}>
                <circle cx="70" cy="100" r="32" fill="none" stroke={getStatusColor()} strokeWidth="2.5" opacity="0.6"/>
                {/* Water wave effect */}
                <path d="M 48 100 Q 54 96 60 100 T 72 100 T 84 100 Q 90 96 92 100" stroke={getStatusColor()} strokeWidth="2.5" fill="none" opacity="0.4"/>
              </g>
              
              {/* Open door overlay when available */}
              {isAvailable && (
                <g>
                  {/* Door opened to the side - semi-transparent ellipse */}
                  <ellipse cx="85" cy="100" rx="25" ry="42" fill="#e8f0f5" stroke={getStatusColor()} strokeWidth="2" opacity="0.85"/>
                  <ellipse cx="87" cy="100" rx="18" ry="32" fill="none" stroke={getStatusColor()} strokeWidth="1.5" opacity="0.5"/>
                  {/* Shadow effect to show depth */}
                  <ellipse cx="70" cy="100" rx="32" ry="32" fill="black" opacity="0.15"/>
                </g>
              )}
              
              {/* Static clothes when occupied (ready for collection) */}
              {isOccupied && (
                <g clipPath="url(#drumClipDetail)">
                  <image 
                    href="/images/sticker.webp" 
                    x="55" 
                    y="100" 
                    width="30" 
                    height="30"
                    opacity="0.9"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Phase Timeline - Only show when machine is running */}
          {isInUse && currentPhase && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {language === 'ZH' ? '洗衣阶段' : 'Wash Cycle Phase'}
              </h3>
              <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                {phases.map((phase, index) => {
                  const status = getPhaseStatus(phase);
                  const isActive = status === 'active';
                  const isCompleted = status === 'completed';
                  
                  return (
                    <div key={phase} className="flex-1 relative">
                      <div className="flex flex-col items-center">
                        {/* Circle */}
                        <div 
                          className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                            isActive 
                              ? 'bg-blue-600 border-blue-600 scale-110' 
                              : isCompleted
                                ? 'bg-green-500 border-green-500'
                                : 'bg-gray-200 border-gray-300'
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                              {index + 1}
                            </span>
                          )}
                        </div>
                        
                        {/* Phase label */}
                        <div className="mt-2 text-center">
                          <p className={`font-semibold text-sm ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                            {phase}
                          </p>
                          {isActive && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
                                {language === 'ZH' ? '进行中' : 'In Progress'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Connecting line */}
                      {index < phases.length - 1 && (
                        <div 
                          className={`absolute top-8 left-1/2 w-full h-1 -translate-y-1/2 ${
                            getPhaseStatus(phases[index + 1]) === 'active' || getPhaseStatus(phases[index + 1]) === 'completed'
                              ? 'bg-gradient-to-r from-green-500 to-blue-600'
                              : isCompleted
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                          }`}
                          style={{ zIndex: -1 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
