import ProgressBar from "./ProgressBar";

export const WasherCard = ({ washer }) => {
  const {
    name,
    capacity,
    status,
    timeLeft,
    progress
  } = washer;

  const isAvailable = status === "AVAILABLE";
  const washerColor = isAvailable ? "#9bc14b" : "#4a7c8c";
  const backgroundColor = isAvailable ? "bg-[#9bc14b]" : "bg-[#4a7c8c]";

  // SVG Washer Icon - tight viewBox crops exactly around the washer (x:18-122, y:18-162)
  const WasherIcon = () => (
    <svg width="140" height="180" viewBox="18 18 104 144" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Washer body */}
      <rect x="20" y="20" width="100" height="140" rx="10" fill={washerColor} stroke={washerColor} strokeWidth="2"/>
      
      {/* Control panel - top section */}
      <rect x="32" y="35" width="25" height="5" rx="2.5" fill="white" opacity="0.5"/>
      <rect x="65" y="35" width="12" height="5" rx="2.5" fill="white" opacity="0.5"/>
      <rect x="82" y="35" width="12" height="5" rx="2.5" fill="white" opacity="0.5"/>
      <rect x="99" y="35" width="12" height="5" rx="2.5" fill="white" opacity="0.5"/>
      
      {/* Door outer circle - white background */}
      <circle cx="70" cy="100" r="42" fill="#e8f0f5" stroke={washerColor} strokeWidth="3"/>
      
      {/* Door inner circle */}
      <circle cx="70" cy="100" r="32" fill="none" stroke={washerColor} strokeWidth="2.5" opacity="0.6"/>
      
      {/* Water wave effect */}
      <path d="M 48 100 Q 54 96 60 100 T 72 100 T 84 100 Q 90 96 92 100" stroke={washerColor} strokeWidth="2.5" fill="none" opacity="0.4"/>
    </svg>
  );

  return (
    <div className="bg-yellow-200 py-10 px-6 flex flex-col items-end border border-red-500 mt-4">
      {/* Washer Icon */}
      <div className="mb-3">
        <WasherIcon />
      </div>

      {/* Washer Name Badge */}
      <div className={`${backgroundColor} text-white px-12 py-2.5 rounded-md mb-8 text-lg font-medium`}>
        {name}
      </div>

      {/* Status Information */}
      <div className="text-center mb-4">
        <span className="text-gray-800 text-base">{capacity} washer: </span>
        <span className="font-bold text-gray-900 text-base">{status}</span>
      </div>

      {/* Time and Progress Bar for In-Use Washers */}
      {!isAvailable && (
        <div className="w-full max-w-md px-6">
          <p className="text-gray-600 text-base text-center mb-3">
            Estimated time left: {timeLeft}
          </p>
          <ProgressBar value={progress} />
        </div>
      )}
    </div>
  );
};