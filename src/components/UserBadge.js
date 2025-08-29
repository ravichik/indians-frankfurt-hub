import React from 'react';
import { FiStar, FiAward, FiTrendingUp, FiUser } from 'react-icons/fi';

const UserBadge = ({ user, showPoints = true, size = 'sm' }) => {
  // Return null if no user or contributions data
  if (!user) return null;
  
  // Use default values if contributions doesn't exist
  const contributions = user.contributions || {
    level: 'Newcomer',
    points: 0,
    badges: []
  };
  
  const { level, points, badges } = contributions;

  const levelColors = {
    'Newcomer': 'bg-gray-100 text-gray-700',
    'Member': 'bg-blue-100 text-blue-700',
    'Contributor': 'bg-green-100 text-green-700',
    'Expert': 'bg-purple-100 text-purple-700',
    'Champion': 'bg-yellow-100 text-yellow-700'
  };

  const levelIcons = {
    'Newcomer': <FiUser className="w-3 h-3" />,
    'Member': <FiTrendingUp className="w-3 h-3" />,
    'Contributor': <FiStar className="w-3 h-3" />,
    'Expert': <FiAward className="w-3 h-3" />,
    'Champion': '🏆'
  };

  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-sm px-2 py-0.5',
    md: 'text-base px-3 py-1'
  };

  return (
    <div className="inline-flex items-center gap-2">
      {/* Level Badge */}
      <span className={`inline-flex items-center gap-1 rounded-full font-medium ${levelColors[level]} ${sizeClasses[size]}`}>
        {levelIcons[level]}
        {level}
      </span>
      
      {/* Points */}
      {showPoints && points > 0 && (
        <span className="text-xs text-gray-500">
          {points} pts
        </span>
      )}
      
      {/* Special Badges */}
      {badges && badges.length > 0 && (
        <div className="flex gap-1">
          {badges.slice(0, 3).map((badge, index) => (
            <span key={index} className="text-sm" title={badge.name}>
              {badge.icon}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBadge;