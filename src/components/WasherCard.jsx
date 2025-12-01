import { useState, useEffect, useRef } from "react";
import ProgressBar from "./ProgressBar";

export const WasherCard = ({ washer, language = 'EN', onClick }) => {
  const {
    name,
    capacity,
    status,
    timeLeft,
    progress
  } = washer;

  const isAvailable = status === "AVAILABLE";
  const isOccupied = status === "OCCUPIED";
  const isInUse = status === "IN USE";
  const washerColor = isAvailable ? "#9bc14b" : isOccupied ? "#d4a017" : "#4a7c8c";
  const backgroundColor = isAvailable ? "bg-[#9bc14b]" : isOccupied ? "bg-[#d4a017]" : "bg-[#4a7c8c]";

  // Translate status text based on language
  const getStatusText = () => {
    if (language === 'ZH') {
      if (isInUse) return '使用中';
      if (isOccupied) return '完成';
      return '可用';
    }
    return status;
  };

  const displayStatus = getStatusText();

  // Use refs for animation to avoid re-renders
  const clothesPosRef = useRef({ x: 50, y: 80 });
  const clothesVelocityRef = useRef({ x: 0.8, y: 0.6 });
  const imageRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!isInUse) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      const radius = 28;
      const pos = clothesPosRef.current;
      const vel = clothesVelocityRef.current;
      
      const newX = pos.x + vel.x;
      const newY = pos.y + vel.y;
      
      const dx = newX - 70;
      const dy = newY - 100;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance >= radius) {
        const normalX = dx / distance;
        const normalY = dy / distance;
        const dotProduct = vel.x * normalX + vel.y * normalY;
        
        clothesVelocityRef.current = {
          x: vel.x - 2 * dotProduct * normalX,
          y: vel.y - 2 * dotProduct * normalY
        };
        
        clothesPosRef.current = {
          x: 70 + normalX * (radius - 1),
          y: 100 + normalY * (radius - 1)
        };
      } else {
        clothesPosRef.current = { x: newX, y: newY };
      }
      
      // Update the image position directly via DOM
      if (imageRef.current) {
        imageRef.current.setAttribute('x', clothesPosRef.current.x - 15);
        imageRef.current.setAttribute('y', clothesPosRef.current.y - 15);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInUse]);

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
      
      {/* Clip path for circular boundary */}
      <defs>
        <clipPath id="drumClip">
          <circle cx="70" cy="100" r="32"/>
        </clipPath>
      </defs>
      
      {/* Door inner circle with spinning animation when in use */}
      <g className={isInUse ? 'animate-spin' : ''} style={{ transformOrigin: '70px 100px' }}>
        <circle cx="70" cy="100" r="32" fill="none" stroke={washerColor} strokeWidth="2.5" opacity="0.6"/>
        
        {/* Water wave effect */}
        <path d="M 48 100 Q 54 96 60 100 T 72 100 T 84 100 Q 90 96 92 100" stroke={washerColor} strokeWidth="2.5" fill="none" opacity="0.4"/>
      </g>
      
      {/* Open door overlay when available */}
      {isAvailable && (
        <g>
          {/* Door opened to the side - semi-transparent ellipse */}
          <ellipse cx="85" cy="100" rx="25" ry="42" fill="#e8f0f5" stroke={washerColor} strokeWidth="2" opacity="0.85"/>
          <ellipse cx="87" cy="100" rx="18" ry="32" fill="none" stroke={washerColor} strokeWidth="1.5" opacity="0.5"/>
          {/* Shadow effect to show depth */}
          <ellipse cx="70" cy="100" rx="32" ry="32" fill="black" opacity="0.15"/>
        </g>
      )}
      
      {/* Bouncing clothes image when in use */}
      {isInUse && (
        <g clipPath="url(#drumClip)">
          <image 
            ref={imageRef}
            href="/images/sticker.webp" 
            x="40" 
            y="70" 
            width="30" 
            height="30"
            opacity="0.9"
          />
        </g>
      )}
      
      {/* Static clothes when occupied (ready for collection) */}
      {isOccupied && (
        <g clipPath="url(#drumClip)">
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
  );

  return (
    <div 
      className="flex flex-col items-center py-8 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
      onClick={onClick}
    >
      {/* Washer Icon */}
      <div className="mb-4">
        <WasherIcon />
      </div>

      {/* Washer Name Badge */}
      <div className={`${backgroundColor} text-white px-8 py-2 rounded-lg mb-4 text-base font-medium`}>
        {name}
      </div>

      {/* Status Information */}
      <div className="text-center mb-4">
        <span className="font-bold">{displayStatus}</span>
      </div>
    </div>
  );
};