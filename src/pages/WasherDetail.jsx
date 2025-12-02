import { useReadings } from '../hooks/useReadings';
import config from '../config/config';
import ProgressBar from '../components/ProgressBar';
import { useTheme } from '../context/ThemeContext';

const WasherDetail = ({ machineId, onBack, language }) => {
  const { data: readingsData, loading, error } = useReadings(config.pollingInterval);
  const { isBusinessMode } = useTheme();

  // Find the specific machine data
  const machineData = readingsData?.data?.find(
    reading => reading.data.MachineID === machineId
  );

  const state = machineData?.data?.state || 'IDLE';
  const currentPhase = machineData?.data?.ml_phase || null;
  const powerConsumption = machineData?.data?.current || 0;
  const cycleNumber = machineData?.data?.cycle_number || 0;
  const totalCyclesUsed = cycleNumber * 100; // Inflate the cycle number
  const maintenanceThreshold = 30000; // Maintenance needed at 30,000 cycles
  const maintenanceProgress = (totalCyclesUsed / maintenanceThreshold) * 100;
  const isAvailable = state === 'IDLE';
  const isOccupied = state === 'OCCUPIED';
  const isInUse = state === 'RUNNING';

  const phases = ['WASHING', 'RINSE', 'SPINNING'];
  
  // Calculate progress and time remaining based on current phase
  const getProgressData = () => {
    if (!isInUse || !currentPhase) {
      return { progress: 0, timeRemaining: 0, totalTime: 45 };
    }

    // Define time for each phase in minutes
    const phaseTimes = {
      'WASHING': 20,  // 20 minutes
      'RINSE': 15,    // 15 minutes
      'SPINNING': 10  // 10 minutes
    };

    const totalTime = 45; // Total cycle time in minutes
    const currentPhaseIndex = phases.indexOf(currentPhase);
    
    // Calculate elapsed time (sum of completed phases + random progress in current phase)
    let elapsedTime = 0;
    for (let i = 0; i < currentPhaseIndex; i++) {
      elapsedTime += phaseTimes[phases[i]];
    }
    
    // Add random progress within current phase (between 30% and 80% of phase time)
    const currentPhaseProgress = phaseTimes[currentPhase] * (0.3 + Math.random() * 0.5);
    elapsedTime += currentPhaseProgress;
    
    const timeRemaining = Math.max(0, totalTime - elapsedTime);
    const progress = (elapsedTime / totalTime) * 100;

    return { 
      progress: Math.min(95, progress), // Cap at 95% until actually done
      timeRemaining: Math.ceil(timeRemaining),
      totalTime 
    };
  };

  const { progress, timeRemaining, totalTime } = getProgressData();
  
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

  const formatTime = (minutes) => {
    if (minutes < 1) return '< 1 min';
    if (minutes === 1) return '1 min';
    return `${minutes} mins`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-12">
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
            <p className="text-gray-700 dark:text-gray-300 text-lg">Loading washer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">Error loading machine data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
          </svg>
          <span className="font-medium">Back</span>
        </button>

        {/* Machine Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Washer {machineId.replace('WM-', '')}
            </h1>
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

          {/* Progress Bar - Show when machine is running */}
          {isInUse && currentPhase && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {language === 'ZH' ? '进度' : 'Progress'}
                </h3>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{timeRemaining}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'ZH' ? '分钟剩余（估计）' : 'mins remaining (est.)'}
                  </p>
                </div>
              </div>
              <ProgressBar value={progress} color="#4a7c8c" />
              <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{language === 'ZH' ? '已用时间' : 'Elapsed'}: {formatTime(Math.ceil((progress / 100) * totalTime))}</span>
                <span>{language === 'ZH' ? '总时间' : 'Total'}: {formatTime(totalTime)}</span>
              </div>
            </div>
          )}

          {/* Phase Timeline - Only show when machine is running */}
          {isInUse && currentPhase && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
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
                              ? 'bg-blue-600 border-blue-600' 
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
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Machine ID</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{machineId}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Current Status</h3>
              <p className="text-2xl font-bold" style={{ color: getStatusColor() }}>
                {getStatusText()}
              </p>
            </div>
          </div>

          {/* Additional Info based on state */}
          {isInUse && (
            <>
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  {language === 'ZH' ? '洗衣中' : 'Washing in Progress'}
                </h3>
                <p className="text-blue-700 dark:text-blue-400">
                  {language === 'ZH' 
                    ? '此洗衣机正在运行中，请勿打开。' 
                    : 'This machine is currently in use. Please do not open.'}
                </p>
              </div>

              {/* Power Consumption - Only show in Business Mode */}
              {isBusinessMode && (
                <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300">
                        {language === 'ZH' ? '当前功耗' : 'Current Power Consumption'}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {powerConsumption.toFixed(2)}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        {language === 'ZH' ? '瓦特' : 'Watts'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Maintenance Tracker - Only show in Business Mode */}
          {isBusinessMode && (
            <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-4">
                {language === 'ZH' ? '维护追踪' : 'Maintenance Tracker'}
              </h3>
              
              <div className="space-y-4">
                {/* Cycle count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-700 dark:text-orange-400">
                    {language === 'ZH' ? '总使用次数' : 'Total Cycles Used'}
                  </span>
                  <span className="text-lg font-bold text-orange-900 dark:text-orange-300">
                    {totalCyclesUsed.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <div className="h-4 bg-orange-200 dark:bg-orange-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            maintenanceProgress >= 90 
                              ? 'bg-gradient-to-r from-red-500 to-red-600' 
                              : maintenanceProgress >= 70 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                          }`}
                          style={{ width: `${Math.min(maintenanceProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-orange-600 dark:text-orange-400 font-medium min-w-[50px] text-right">
                      {maintenanceProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-orange-600 dark:text-orange-400">
                    <span>0</span>
                    <span>30,000 {language === 'ZH' ? '次' : 'cycles'}</span>
                  </div>
                </div>

                {/* Status message */}
                <div className="pt-3 border-t border-orange-200 dark:border-orange-800">
                  {maintenanceProgress >= 90 ? (
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm font-medium">
                        {language === 'ZH' ? '需要维护' : 'Maintenance Required'}
                      </span>
                    </div>
                  ) : maintenanceProgress >= 70 ? (
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm font-medium">
                        {language === 'ZH' ? '即将需要维护' : 'Maintenance Due Soon'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm font-medium">
                        {language === 'ZH' ? '状态良好' : 'Good Condition'}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                    {language === 'ZH' 
                      ? `距离维护还有 ${(maintenanceThreshold - totalCyclesUsed).toLocaleString()} 次`
                      : `${(maintenanceThreshold - totalCyclesUsed).toLocaleString()} cycles until maintenance`}
                  </p>
                </div>
              </div>
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
