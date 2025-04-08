
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StudentAssignmentList from '../components/StudentAssignmentList';
import QuestionSection from '../components/QuestionSection';
import { mockAssignments, mockSubmissions } from '../utils/mockData';

// Student dashboard page component
const StudentDashboard: React.FC = () => {
  // Filter assignments that have submissions
  const submittedAssignmentIds = mockSubmissions
    .filter(sub => sub.studentId === 'student1')
    .map(sub => sub.assignmentId);
    
  const submittedAssignments = mockAssignments
    .filter(assignment => submittedAssignmentIds.includes(assignment.id));
    
  const pendingAssignments = mockAssignments
    .filter(assignment => !submittedAssignmentIds.includes(assignment.id));
    
  const studentSubmissions = mockSubmissions
    .filter(sub => sub.studentId === 'student1');

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
              {Math.round(
                studentSubmissions
                  .filter(sub => sub.grade !== undefined)
                  .reduce((acc, sub) => acc + (sub.grade || 0), 0) / 
                  studentSubmissions.filter(sub => sub.grade !== undefined).length
              )}%
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
              submissions={studentSubmissions}
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
