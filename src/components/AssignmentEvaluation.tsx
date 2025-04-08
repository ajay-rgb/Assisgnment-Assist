
import React, { useState } from 'react';
import PlagiarismIndicator from './PlagiarismIndicator';
import { Submission } from '../types';

interface AssignmentEvaluationProps {
  submission: Submission;
}

// Component for evaluating student assignments
const AssignmentEvaluation: React.FC<AssignmentEvaluationProps> = ({ submission }) => {
  const [grade, setGrade] = useState<number | undefined>(submission.grade);
  const [feedback, setFeedback] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if assignment is flagged for high plagiarism
  const isFlagged = submission.plagiarismPercentage ? submission.plagiarismPercentage >= 60 : false;

  // Handle AI evaluation
  const handleAIEvaluation = () => {
    setIsEvaluating(true);
    
    // Mock API call for AI evaluation
    setTimeout(() => {
      // AI typically provides a grade and feedback
      setGrade(Math.floor(Math.random() * 30) + 70); // Random grade between 70-99
      setFeedback('This submission demonstrates good understanding of the concepts. The code structure is well organized, but could use more comments for clarity.');
      setIsEvaluating(false);
    }, 2000);
  };
  
  // Handle manual submission of grades
  const handleSubmitEvaluation = () => {
    setIsSubmitting(true);
    
    // Mock API call to submit evaluation
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Evaluation submitted successfully!');
    }, 1000);
  };

  return (
    <div className="card">
      <h3 className="mb-4">Assignment Evaluation</h3>
      
      {/* File download link */}
      <div className="form-group">
        <label className="form-label">Submission File</label>
        <div className="flex gap-2">
          <a 
            href={`#${submission.fileUrl}`} 
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            Download Submission
          </a>
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
          <label htmlFor="grade" className="form-label">Grade</label>
          <input
            type="number"
            id="grade"
            className="form-input"
            min="0"
            max="100"
            value={grade || ''}
            onChange={(e) => setGrade(Number(e.target.value))}
            disabled={isFlagged || isEvaluating}
          />
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
          <button 
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={handleAIEvaluation}
            disabled={isFlagged || isEvaluating}
          >
            {isEvaluating ? 'Evaluating...' : 'Evaluate with AI'}
          </button>
          
          <button 
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleSubmitEvaluation}
            disabled={isFlagged || isEvaluating || isSubmitting || !grade}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
          </button>
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
