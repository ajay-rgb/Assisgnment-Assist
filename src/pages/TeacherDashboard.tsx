import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AssignmentUpload from '../components/AssignmentUpload';
import AssignmentEvaluation from '../components/AssignmentEvaluation';
import PerformanceTable from '../components/PerformanceTable';
import { mockSubmissions, mockPerformanceData } from '../utils/mockData';
import { getAssignmentsFromStorage } from '../utils/localStorage';
import { Assignment } from '../types';

// Teacher dashboard page component
const TeacherDashboard: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(mockSubmissions[0]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Load assignments from local storage on component mount
  useEffect(() => {
    const storedAssignments = getAssignmentsFromStorage();
    if (storedAssignments.length > 0) {
      setAssignments(storedAssignments);
    }
  }, []);

  // Function to handle selecting a submission for evaluation
  const handleSelectSubmission = (submissionId: string) => {
    const submission = mockSubmissions.find(sub => sub.id === submissionId);
    if (submission) {
      setSelectedSubmission(submission);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="container dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Teacher Dashboard</h1>
        </div>
        
        {/* Dashboard tiles */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-title">Total Assignments</div>
            <div className="stat-value">{assignments.length}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Submissions</div>
            <div className="stat-value">5</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Average Grade</div>
            <div className="stat-value">84%</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Flagged Submissions</div>
            <div className="stat-value" style={{ color: 'var(--danger-color)' }}>1</div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex gap-8" style={{ flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
          {/* Left column */}
          <div style={{ flex: 1 }}>
            <AssignmentUpload />
            
            {/* Submission selector */}
            <div className="card">
              <h3 className="mb-4">Select Submission to Evaluate</h3>
              <div className="form-group">
                <select 
                  className="form-input"
                  value={selectedSubmission.id}
                  onChange={(e) => handleSelectSubmission(e.target.value)}
                >
                  {mockSubmissions.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      ID: {sub.id} - {sub.status}
                      {sub.plagiarismPercentage && sub.plagiarismPercentage >= 60 ? ' (Flagged)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div style={{ flex: 1 }}>
            <AssignmentEvaluation submission={selectedSubmission} />
          </div>
        </div>
        
        {/* Performance overview */}
        <div className="mt-8">
          <PerformanceTable data={mockPerformanceData} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
