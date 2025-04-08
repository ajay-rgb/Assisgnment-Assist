
import React, { useState } from 'react';

// Component for students to ask questions about assignments
const QuestionSection: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answer, setAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Handle question submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsSubmitting(true);
    
    // Mock API call to submit question to backend
    setTimeout(() => {
      setHasSubmitted(true);
      setIsSubmitting(false);
      
      // Mock AI response after a delay
      setTimeout(() => {
        setAnswer(`To solve this problem, you'll need to apply the concepts we covered in class. 
        First, break down the problem into smaller parts. The key insight is that you can use recursive algorithms 
        to solve this type of problem efficiently. Remember to consider edge cases in your solution.`);
      }, 1500);
    }, 1000);
  };
  
  // Reset the form to ask another question
  const handleAskAnother = () => {
    setQuestion('');
    setAnswer('');
    setHasSubmitted(false);
  };

  return (
    <div className="card">
      <h3 className="mb-4">Ask a Question</h3>
      
      {!hasSubmitted ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="question" className="form-label">Your Question</label>
            <textarea
              id="question"
              className="form-input"
              rows={5}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's your doubt or question about the assignment?"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Question'}
          </button>
        </form>
      ) : (
        <div>
          <div className="card" style={{ backgroundColor: 'var(--background-light)', marginBottom: '1rem' }}>
            <strong>Your Question:</strong>
            <p style={{ marginTop: '0.5rem' }}>{question}</p>
          </div>
          
          <div className="card" style={{ backgroundColor: 'var(--background-light)' }}>
            <strong>Answer:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              {answer ? (
                <p>{answer}</p>
              ) : (
                <div className="flex items-center justify-center" style={{ padding: '2rem 0' }}>
                  <div className="spinner"></div>
                  <p style={{ marginLeft: '1rem' }}>Getting answer from AI...</p>
                </div>
              )}
            </div>
          </div>
          
          {answer && (
            <button 
              className="btn btn-primary w-full mt-4" 
              onClick={handleAskAnother}
            >
              Ask Another Question
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionSection;
