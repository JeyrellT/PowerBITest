import React from 'react';
import './ProgressRing.css';

/**
 * ProgressRing - Indicador circular de progreso
 * Basado en FASE_2 wireframes
 */
const ProgressRing = ({
  percentage = 0,
  size = 120,
  strokeWidth = 8,
  label = '',
  showPercentage = true,
  color = 'var(--primary-color)',
  backgroundColor = 'var(--progress-bg)'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg className="progress-ring-svg" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="progress-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={backgroundColor}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          className="progress-ring-circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* Center content */}
      <div className="progress-ring-content">
        {showPercentage && (
          <span className="progress-ring-percentage">{Math.round(percentage)}%</span>
        )}
        {label && <span className="progress-ring-label">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
