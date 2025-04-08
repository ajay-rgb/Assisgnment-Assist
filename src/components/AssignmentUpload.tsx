
import React, { useState } from 'react';

// Component for teachers to upload new assignments
const AssignmentUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call to upload assignment
    setIsUploading(true);
    
    // Mock API response after 1 second
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setDeadline('');
        setFile(null);
        setUploadSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="card">
      <h3 className="mb-4">Upload New Assignment</h3>
      
      {uploadSuccess && (
        <div className="badge badge-success" style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%', textAlign: 'center' }}>
          Assignment uploaded successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Assignment Title</label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="deadline" className="form-label">Deadline</label>
          <input
            type="datetime-local"
            id="deadline"
            className="form-input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="file" className="form-label">Assignment File (Optional)</label>
          <input
            type="file"
            id="file"
            className="form-input"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          <small style={{ color: 'var(--text-light)' }}>Upload any supporting documents</small>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-full" 
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Assignment'}
        </button>
      </form>
    </div>
  );
};

export default AssignmentUpload;
