
import React, { useState } from 'react';
import PlagiarismIndicator from './PlagiarismIndicator';
import { Submission, Assignment } from '../types';
import { updateSubmissionInStorage } from '../utils/localStorage';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface AssignmentEvaluationProps {
  submission: Submission;
  assignments: Assignment[];
}

// Component for evaluating student assignments
const AssignmentEvaluation: React.FC<AssignmentEvaluationProps> = ({ submission, assignments }) => {
  const [grade, setGrade] = useState<number | undefined>(submission.grade);
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Get the assignment details
  const assignment = assignments.find(a => a.id === submission.assignmentId);
  
  // Check if assignment is flagged for high plagiarism
  const isFlagged = submission.plagiarismPercentage ? submission.plagiarismPercentage >= 60 : false;

  // Handle AI evaluation
  const handleAIEvaluation = () => {
    setIsEvaluating(true);
    
    // Generate a random grade between 1-10
    setTimeout(() => {
      const aiGrade = Math.floor(Math.random() * 10) + 1;
      const scaledGrade = aiGrade * 10; // Scale to percentage (1-10 → 10-100%)
      
      setGrade(scaledGrade);
      setFeedback(`This submission demonstrates ${aiGrade > 7 ? 'excellent' : aiGrade > 5 ? 'good' : 'basic'} understanding of the concepts. The code structure is ${aiGrade > 7 ? 'very well organized' : aiGrade > 5 ? 'well organized' : 'somewhat organized'}, but could use ${aiGrade > 7 ? 'minor improvements' : 'more comments for clarity'}.`);
      setIsEvaluating(false);
      
      toast({
        title: "AI Evaluation Complete",
        description: `AI has suggested a grade of ${scaledGrade}%`,
      });
    }, 2000);
  };
  
  // Handle manual submission of grades
  const handleSubmitEvaluation = () => {
    setIsSubmitting(true);
    
    const updatedSubmission: Submission = {
      ...submission,
      grade,
      feedback,
      status: 'graded'
    };
    
    // Update submission in local storage
    updateSubmissionInStorage(updatedSubmission);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Evaluation Submitted",
        description: "The assignment has been graded successfully.",
      });
    }, 1000);
  };

  return (
    <div className="card">
      <h3 className="mb-4">Assignment Evaluation</h3>
      
      {/* Assignment details */}
      <div className="form-group">
        <label className="form-label">Assignment</label>
        <p className="text-sm text-gray-700">{assignment?.title || 'Unknown Assignment'}</p>
      </div>
      
      {/* Student details */}
      <div className="form-group">
        <label className="form-label">Student ID</label>
        <p className="text-sm text-gray-700">{submission.studentId}</p>
      </div>
      
      {/* Submission date */}
      <div className="form-group">
        <label className="form-label">Submission Date</label>
        <p className="text-sm text-gray-700">
          {new Date(submission.submissionDate).toLocaleString()}
        </p>
      </div>
      
      {/* File download link */}
      <div className="form-group">
        <label className="form-label">Submission File</label>
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            className="w-full"
            onClick={() => window.open(`#${submission.fileUrl}`)}
          >
            Download Submission ({submission.fileUrl})
          </Button>
        </div>
      </div>
      
      {/* Plagiarism section */}
      <div className="form-group">
        <label className="form-label">Plagiarism Analysis</label>
        <PlagiarismIndicator 
          percentage={submission.plagiarismPercentage || 0} 
        />
      </div>
      
      {/* Evaluation section - disabled if flagged */}
      <div className={`${isFlagged ? 'opacity-50' : ''}`}>
        <div className="form-group">
          <label htmlFor="grade" className="form-label">Grade (1-10)</label>
          <input
            type="number"
            id="grade"
            className="form-input"
            min="1"
            max="10"
            value={grade ? Math.round(grade / 10) : ''}
            onChange={(e) => setGrade(Number(e.target.value) * 10)}
            disabled={isFlagged || isEvaluating}
          />
          <p className="text-xs text-gray-500 mt-1">Will be saved as {grade || 0}% in the system</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="feedback" className="form-label">Feedback</label>
          <textarea
            id="feedback"
            className="form-input"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isFlagged || isEvaluating}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            className="flex-1"
            onClick={handleAIEvaluation}
            disabled={isFlagged || isEvaluating}
          >
            {isEvaluating ? 'Evaluating...' : 'Grade with AI'}
          </Button>
          
          <Button 
            variant="default"
            className="flex-1"
            onClick={handleSubmitEvaluation}
            disabled={isFlagged || isEvaluating || isSubmitting || !grade}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
          </Button>
        </div>
        
        {isFlagged && (
          <div className="mt-4 text-center" style={{ color: 'var(--danger-color)' }}>
            This submission is flagged for high plagiarism and cannot be evaluated.
            Please review the submission manually.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentEvaluation;
