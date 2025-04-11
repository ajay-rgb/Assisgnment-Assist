
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AssignmentUpload from '../components/AssignmentUpload';
import AssignmentEvaluation from '../components/AssignmentEvaluation';
import PerformanceTable from '../components/PerformanceTable';
import { getAssignmentsFromStorage, getSubmissionsFromStorage } from '../utils/localStorage';
import { Assignment, Submission } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Teacher dashboard page component
const TeacherDashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  // Load assignments and submissions from local storage on component mount
  useEffect(() => {
    const loadData = () => {
      const storedAssignments = getAssignmentsFromStorage();
      const storedSubmissions = getSubmissionsFromStorage();
      
      setAssignments(storedAssignments);
      setSubmissions(storedSubmissions);
    };

    loadData();
    
    // Set up an interval to refresh data regularly
    const intervalId = setInterval(loadData, 5000);
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to handle selecting a submission for evaluation
  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    
    toast({
      title: "Submission Selected",
      description: "You can now evaluate this submission.",
    });
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
        <div className="flex gap-8 mt-8" style={{ flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
          {/* Left column - Submission List */}
          <div style={{ flex: 1 }}>
            <div className="card">
              <h3 className="mb-4">Student Submissions</h3>
              
              {submissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map(submission => {
                      const assignment = assignments.find(a => a.id === submission.assignmentId);
                      return (
                        <TableRow 
                          key={submission.id}
                          className={selectedSubmission?.id === submission.id ? 'bg-muted' : ''}
                        >
                          <TableCell>{assignment?.title || 'Unknown'}</TableCell>
                          <TableCell>Student {submission.studentId}</TableCell>
                          <TableCell>
                            <span className={`badge ${
                              submission.status === 'graded' ? 'badge-success' : 
                              submission.status === 'flagged' ? 'badge-danger' : 
                              'badge-warning'
                            }`}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectSubmission(submission)}
                            >
                              Grade
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p>No submissions available for evaluation.</p>
              )}
            </div>
            
            <div className="mt-6">
              <AssignmentUpload />
            </div>
          </div>
          
          {/* Right column - Evaluation */}
          <div style={{ flex: 1 }}>
            {selectedSubmission ? (
              <AssignmentEvaluation 
                submission={selectedSubmission}
                assignments={assignments}
              />
            ) : (
              <div className="card">
                <h3 className="mb-4">Assignment Evaluation</h3>
                <p className="text-center py-8 text-gray-500">
                  Select a submission from the list to evaluate
                </p>
              </div>
            )}
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
