import React, { useState, useEffect } from 'react';
import { Assignment, Submission } from '../types';
import PlagiarismIndicator from './PlagiarismIndicator';
import { getAssignmentsFromStorage, saveAssignmentsToStorage, addSubmissionToStorage } from '../utils/localStorage';
import { useToast } from "@/hooks/use-toast";

// Define a type for plagiarism results
interface PlagiarismResult {
  plagiarised: boolean;
  similarity: number;
}

interface StudentAssignmentListProps {
  assignments: Assignment[];
  submissions?: Submission[];
  isPending?: boolean;
}

// Component for displaying assignments to students
const StudentAssignmentList: React.FC<StudentAssignmentListProps> = ({ 
  assignments: initialAssignments, 
  submissions = [], 
  isPending = false 
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [selectedFile, setSelectedFile] = useState<{ [key: string]: File | null }>({});
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [uploadSuccess, setUploadSuccess] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  // Fetch assignments from local storage when the component loads
  useEffect(() => {
    const storedAssignments = getAssignmentsFromStorage();
    if (storedAssignments.length > 0) {
      setAssignments(storedAssignments);
    }
  }, []);

  // Handle file selection
  const handleFileChange = (assignmentId: string, file: File | null) => {
    setSelectedFile(prev => ({
      ...prev,
      [assignmentId]: file
    }));
  };

  // Handle file submission
  const handleSubmit = async (assignmentId: string) => {
    const file = selectedFile[assignmentId];
    if (!file) return;

    setUploading(prev => ({ ...prev, [assignmentId]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3001/assignments', {
        method: 'POST',
        headers: {
          // No need to set Content-Type, FormData sets it automatically
        },
        body: formData
      });

      if (response.status === 204) {
        // Handle 204 No Content as success
        return [];
      }


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload assignment');
      }

      const plagiarismResults = await response.json();
      
      // Create submission object with plagiarism results
      const newSubmission: Submission = {
        id: `submission_${Date.now()}`,
        assignmentId: assignmentId,
        studentId: 'student1', // Mock student ID
        submissionDate: new Date().toISOString(),
        fileUrl: file.name,
        status: plagiarismResults.some((r) => r.plagiarised) ? 'flagged' : 'submitted',
        plagiarismPercentage: Math.max(...plagiarismResults.map((r) => r.similarity * 100)),
      };

      addSubmissionToStorage(newSubmission);
      setUploadSuccess(prev => ({ ...prev, [assignmentId]: true }));

      toast({
        title: newSubmission.status === 'flagged' ? "Warning: High Similarity Detected" : "Assignment Submitted",
        description: newSubmission.status === 'flagged' 
          ? `Your submission shows ${newSubmission.plagiarismPercentage.toFixed(1)}% similarity with existing submissions.`
          : "Your assignment has been submitted successfully.",
        variant: newSubmission.status === 'flagged' ? "destructive" : "default",
      });

      setTimeout(() => {
        setUploadSuccess(prev => ({ ...prev, [assignmentId]: false }));
        setSelectedFile(prev => ({ ...prev, [assignmentId]: null }));
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  // Find submission for an assignment
  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(sub => sub.assignmentId === assignmentId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Check if deadline has passed
  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="card">
      <h3 className="mb-4">
        {isPending ? 'Pending Assignments' : 'Submitted Assignments'}
      </h3>
      
      {assignments.length === 0 ? (
        <p>No {isPending ? 'pending' : 'submitted'} assignments found.</p>
      ) : (
        <div>
          {assignments.map(assignment => {
            const submission = getSubmissionForAssignment(assignment.id);
            const isSubmitted = !!submission;
            
            return (
              <div 
                key={assignment.id} 
                className="mb-4 pb-4" 
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>{assignment.title}</h4>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      {assignment.description}
                    </p>
                    
                    <div className="mt-2" style={{ fontSize: '0.9rem' }}>
                      <span style={{ 
                        color: isDeadlinePassed(assignment.deadline) ? 'var(--danger-color)' : 'var(--text-light)' 
                      }}>
                        Deadline: {formatDate(assignment.deadline)}
                        {isDeadlinePassed(assignment.deadline) && ' (Passed)'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Submission details or upload form */}
                <div className="mt-4">
                  {isPending && !isSubmitted ? (
                    <div>
                      <div className="form-group">
                        <input
                          type="file"
                          className="form-input"
                          onChange={(e) => handleFileChange(assignment.id, e.target.files?.[0] || null)}
                        />
                      </div>
                      
                      {uploadSuccess[assignment.id] && (
                        <div className="badge badge-success" style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%', textAlign: 'center' }}>
                          Assignment submitted successfully!
                        </div>
                      )}
                      
                      <button
                        className="btn btn-primary"
                        disabled={!selectedFile[assignment.id] || uploading[assignment.id] || isDeadlinePassed(assignment.deadline)}
                        onClick={() => handleSubmit(assignment.id)}
                      >
                        {uploading[assignment.id] ? 'Uploading...' : 'Submit Assignment'}
                      </button>
                      
                      {isDeadlinePassed(assignment.deadline) && (
                        <div className="mt-2" style={{ color: 'var(--danger-color)', fontSize: '0.75rem' }}>
                          The deadline for this assignment has passed.
                        </div>
                      )}
                    </div>
                  ) : (!isPending && isSubmitted) && (
                    <div>
                      <div className="flex justify-between mt-2" style={{ fontSize: '0.9rem' }}>
                        <span>Submitted: {submission?.submissionDate ? formatDate(submission.submissionDate) : 'Unknown'}</span>
                        
                        <span className={`badge ${
                          submission?.status === 'graded' ? 'badge-success' : 
                          submission?.status === 'flagged' ? 'badge-danger' : 
                          'badge-warning'
                        }`}>
                          {submission?.status.charAt(0).toUpperCase() + (submission?.status.slice(1) || '')}
                        </span>
                      </div>
                      
                      {submission?.grade !== undefined && (
                        <div className="mt-2" style={{ fontSize: '0.9rem' }}>
                          <strong>Grade: {submission.grade}/100</strong>
                        </div>
                      )}
                      
                      {submission?.plagiarismPercentage !== undefined && (
                        <div className="mt-2">
                          <label className="form-label">Plagiarism Analysis:</label>
                          <PlagiarismIndicator percentage={submission.plagiarismPercentage} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentList;
