import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 'default', animate = true, className = '' }) => {
  const sizes = {
    small: { container: 'w-8 h-8', text: 'text-xs' },
    default: { container: 'w-10 h-10', text: 'text-sm' },
    large: { container: 'w-16 h-16', text: 'text-xl' },
    xlarge: { container: 'w-24 h-24', text: 'text-3xl' }
  };

  const currentSize = sizes[size] || sizes.default;

  const LogoContent = () => (
    <div className={`${currentSize.container} ${className} relative`}>
      {/* Modern design with Indian flag colors and cultural element */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>
          <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>

        {/* Outer circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#bgGradient)"
          strokeWidth="2"
          fill="white"
        />

        {/* Indian flag inspired tricolor bands */}
        <rect x="20" y="25" width="60" height="15" fill="#FF9933" opacity="0.9" />
        <rect x="20" y="40" width="60" height="15" fill="#FFFFFF" opacity="0.9" />
        <rect x="20" y="55" width="60" height="15" fill="#138808" opacity="0.9" />

        {/* Ashoka Chakra inspired center element */}
        <circle
          cx="50"
          cy="47.5"
          r="8"
          fill="none"
          stroke="#000080"
          strokeWidth="1.5"
        />
        
        {/* Chakra spokes */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const x1 = 50 + 3 * Math.cos(angle);
          const y1 = 47.5 + 3 * Math.sin(angle);
          const x2 = 50 + 7 * Math.cos(angle);
          const y2 = 47.5 + 7 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#000080"
              strokeWidth="1"
            />
          );
        })}

        {/* Text FI */}
        <text
          x="50"
          y="85"
          textAnchor="middle"
          fill="#1a202c"
          fontSize="16"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          FI
        </text>
      </svg>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <LogoContent />
      </motion.div>
    );
  }

  return <LogoContent />;
};

// Alternative minimalist logo design
export const LogoMinimal = ({ size = 'default', animate = true, className = '' }) => {
  const sizes = {
    small: { container: 'w-8 h-8', text: 'text-lg' },
    default: { container: 'w-10 h-10', text: 'text-xl' },
    large: { container: 'w-16 h-16', text: 'text-3xl' },
    xlarge: { container: 'w-24 h-24', text: 'text-5xl' }
  };

  const currentSize = sizes[size] || sizes.default;

  const LogoContent = () => (
    <div 
      className={`${currentSize.container} ${className} bg-gradient-to-br from-orange-500 via-white to-green-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-orange-500"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-green-600"></div>
      </div>
      
      {/* Center circle with chakra */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-5/6 h-5/6 rounded-full bg-white/90 flex items-center justify-center">
          <span className={`${currentSize.text} font-bold bg-gradient-to-br from-orange-600 to-green-700 bg-clip-text text-transparent`}>
            FI
          </span>
        </div>
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <LogoContent />
      </motion.div>
    );
  }

  return <LogoContent />;
};

// Modern geometric logo design
export const LogoModern = ({ size = 'default', animate = true, className = '' }) => {
  const sizes = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  const currentSize = sizes[size] || sizes.default;

  const LogoContent = () => (
    <div className={`${currentSize} ${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#138808" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* Hexagon background */}
        <polygon
          points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
          fill="white"
          stroke="url(#gradient1)"
          strokeWidth="3"
        />

        {/* Inner design */}
        <path
          d="M 50 25 L 65 40 L 65 60 L 50 75 L 35 60 L 35 40 Z"
          fill="url(#gradient2)"
          opacity="0.8"
        />

        {/* FI text */}
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fill="white"
          fontSize="24"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          FI
        </text>
      </svg>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        whileHover={{ rotate: 180, scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <LogoContent />
      </motion.div>
    );
  }

  return <LogoContent />;
};

export default Logo;