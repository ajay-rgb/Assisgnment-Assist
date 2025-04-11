
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StudentAssignmentList from '../components/StudentAssignmentList';
import QuestionSection from '../components/QuestionSection';
import { getAssignmentsFromStorage, getSubmissionsFromStorage } from '../utils/localStorage';
import { Assignment, Submission } from '../types';

// Student dashboard page component
const StudentDashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const studentId = 'student1'; // Mock student ID
  
  useEffect(() => {
    // Load assignments and submissions from localStorage
    const storedAssignments = getAssignmentsFromStorage();
    const storedSubmissions = getSubmissionsFromStorage().filter(sub => sub.studentId === studentId);
    
    setAssignments(storedAssignments);
    setSubmissions(storedSubmissions);
  }, []);

  // Filter assignments that have submissions
  const submittedAssignmentIds = submissions
    .map(sub => sub.assignmentId);
    
  const submittedAssignments = assignments
    .filter(assignment => submittedAssignmentIds.includes(assignment.id));
    
  const pendingAssignments = assignments
    .filter(assignment => !submittedAssignmentIds.includes(assignment.id));

  return (
    <div>
      <Navbar />
      
      <div className="container dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
        </div>
        
        {/* Dashboard stats */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-title">Pending Assignments</div>
            <div className="stat-value">{pendingAssignments.length}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Completed Assignments</div>
            <div className="stat-value">{submittedAssignments.length}</div>
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
            <div className="stat-title">Next Deadline</div>
            <div className="stat-value" style={{ fontSize: '1rem' }}>
              {pendingAssignments.length > 0 
                ? new Date(pendingAssignments[0].deadline).toLocaleDateString()
                : 'None'}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex gap-8" style={{ flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
          {/* Left column */}
          <div style={{ flex: 1 }}>
            <StudentAssignmentList 
              assignments={pendingAssignments} 
              isPending={true} 
            />
            
            <StudentAssignmentList 
              assignments={submittedAssignments} 
              submissions={submissions}
              isPending={false} 
            />
          </div>
          
          {/* Right column */}
          <div style={{ flex: 1 }}>
            <QuestionSection />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
