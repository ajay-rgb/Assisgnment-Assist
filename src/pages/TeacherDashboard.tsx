
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AssignmentUpload from '../components/AssignmentUpload';
import AssignmentEvaluation from '../components/AssignmentEvaluation';
import PerformanceTable from '../components/PerformanceTable';
import { getAssignmentsFromStorage, getSubmissionsFromStorage } from '../utils/localStorage';
import { Assignment, Submission } from '../types';

// Teacher dashboard page component
const TeacherDashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Load assignments and submissions from local storage on component mount
  useEffect(() => {
    const storedAssignments = getAssignmentsFromStorage();
    const storedSubmissions = getSubmissionsFromStorage();
    
    setAssignments(storedAssignments);
    setSubmissions(storedSubmissions);
    
    if (storedSubmissions.length > 0) {
      setSelectedSubmission(storedSubmissions[0]);
    }
  }, []);

  // Function to handle selecting a submission for evaluation
  const handleSelectSubmission = (submissionId: string) => {
    const submission = submissions.find(sub => sub.id === submissionId);
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
            <div className="stat-value">{submissions.length}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Average Grade</div>
            <div className="stat-value">
              {submissions.length > 0 ?
                Math.round(
                  submissions
                    .filter(sub => sub.grade !== undefined)
                    .reduce((acc, sub) => acc + (sub.grade || 0), 0) / 
                    Math.max(1, submissions.filter(sub => sub.grade !== undefined).length)
                ) : 0}%
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Flagged Submissions</div>
            <div className="stat-value" style={{ color: 'var(--danger-color)' }}>
              {submissions.filter(sub => sub.status === 'flagged' || 
                (sub.plagiarismPercentage !== undefined && sub.plagiarismPercentage >= 60)).length}
            </div>
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
              {submissions.length > 0 ? (
                <div className="form-group">
                  <select 
                    className="form-input"
                    value={selectedSubmission?.id || ''}
                    onChange={(e) => handleSelectSubmission(e.target.value)}
                  >
                    {submissions.map(sub => {
                      const assignment = assignments.find(a => a.id === sub.assignmentId);
                      return (
                        <option key={sub.id} value={sub.id}>
                          {assignment ? assignment.title : 'Unknown Assignment'} - {sub.status}
                          {sub.plagiarismPercentage && sub.plagiarismPercentage >= 60 ? ' (Flagged)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ) : (
                <p>No submissions available for evaluation.</p>
              )}
            </div>
          </div>
          
          {/* Right column */}
          <div style={{ flex: 1 }}>
            {selectedSubmission && <AssignmentEvaluation submission={selectedSubmission} />}
          </div>
        </div>
        
        {/* Performance overview */}
        <div className="mt-8">
          <PerformanceTable data={submissions.map(sub => {
            const assignment = assignments.find(a => a.id === sub.assignmentId);
            return {
              studentId: sub.studentId,
              studentName: `Student ${sub.studentId}`,
              assignment: assignment ? assignment.title : 'Unknown Assignment',
              grade: sub.grade,
              plagiarismPercentage: sub.plagiarismPercentage,
              submissionStatus: sub.status,
              submissionDate: sub.submissionDate
            };
          })} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
