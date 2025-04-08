
import React, { useState } from 'react';
import PlagiarismIndicator from './PlagiarismIndicator';
import { StudentPerformance } from '../types';

interface PerformanceTableProps {
  data: StudentPerformance[];
}

// Component for displaying class performance data
const PerformanceTable: React.FC<PerformanceTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof StudentPerformance>('studentName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Handle sorting
  const handleSort = (field: keyof StudentPerformance) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort the data based on current sort field and direction
  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] === undefined) return sortDirection === 'asc' ? 1 : -1;
    if (b[sortField] === undefined) return sortDirection === 'asc' ? -1 : 1;
    
    if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
      return sortDirection === 'asc' 
        ? (a[sortField] as string).localeCompare(b[sortField] as string)
        : (b[sortField] as string).localeCompare(a[sortField] as string);
    }
    
    // Handle numeric fields
    const aVal = a[sortField] as number;
    const bVal = b[sortField] as number;
    
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Get status badge class based on submission status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'graded': return 'badge-success';
      case 'submitted': return 'badge-warning';
      case 'flagged': return 'badge-danger';
      default: return '';
    }
  };

  return (
    <div className="card">
      <h3 className="mb-4">Class Performance Overview</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('studentName')} style={{ cursor: 'pointer' }}>
                Student Name {sortField === 'studentName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('assignment')} style={{ cursor: 'pointer' }}>
                Assignment {sortField === 'assignment' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('grade')} style={{ cursor: 'pointer' }}>
                Grade {sortField === 'grade' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('plagiarismPercentage')} style={{ cursor: 'pointer' }}>
                Plagiarism {sortField === 'plagiarismPercentage' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('submissionStatus')} style={{ cursor: 'pointer' }}>
                Status {sortField === 'submissionStatus' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('submissionDate')} style={{ cursor: 'pointer' }}>
                Submission Date {sortField === 'submissionDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={`${item.studentId}-${item.assignment}-${index}`}>
                <td>{item.studentName}</td>
                <td>{item.assignment}</td>
                <td>{item.grade !== undefined ? item.grade : '-'}</td>
                <td>
                  {item.plagiarismPercentage !== undefined ? (
                    <PlagiarismIndicator percentage={item.plagiarismPercentage} />
                  ) : '-'}
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(item.submissionStatus)}`}>
                    {item.submissionStatus.charAt(0).toUpperCase() + item.submissionStatus.slice(1)}
                  </span>
                </td>
                <td>
                  {item.submissionDate 
                    ? new Date(item.submissionDate).toLocaleDateString() 
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTable;
