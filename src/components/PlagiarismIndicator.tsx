
import React from 'react';

interface PlagiarismIndicatorProps {
  percentage: number;
}

// Component to visually represent plagiarism percentage
const PlagiarismIndicator: React.FC<PlagiarismIndicatorProps> = ({ percentage }) => {
  // Determine badge color based on plagiarism percentage
  const getBadgeClass = () => {
    if (percentage < 20) return 'badge-success';
    if (percentage < 60) return 'badge-warning';
    return 'badge-danger';
  };

  // Determine message based on plagiarism percentage
  const getMessage = () => {
    if (percentage < 20) return 'Low';
    if (percentage < 60) return 'Moderate';
    return 'High';
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className={`badge ${getBadgeClass()}`}>
          {getMessage()}
        </span>
        <span>{percentage}%</span>
      </div>
      
      {/* Progress bar */}
      <div 
        style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#e2e8f0', 
          borderRadius: '4px',
          marginTop: '6px'
        }}
      >
        <div 
          style={{ 
            width: `${Math.min(percentage, 100)}%`, 
            height: '100%', 
            backgroundColor: percentage >= 60 ? 'var(--danger-color)' : 
                             percentage >= 20 ? 'var(--warning-color)' : 
                             'var(--accent-color)', 
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} 
        />
      </div>
      
      {percentage >= 60 && (
        <div className="mt-2" style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>
          This submission has been flagged for high similarity
        </div>
      )}
    </div>
  );
};

export default PlagiarismIndicator;
