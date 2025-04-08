
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginCardProps {
  role: 'teacher' | 'student';
}

// Login card component for both teacher and student
const LoginCard: React.FC<LoginCardProps> = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - normally would call an API here
    if (email && password) {
      // Redirect based on role
      if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
      <h2 className="text-center mb-4">
        {role === 'teacher' ? 'Teacher Login' : 'Student Login'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary w-full mt-4">
          Login
        </button>
      </form>
      
      <div className="text-center mt-4">
        <a href="#" className="nav-link">Forgot password?</a>
      </div>
    </div>
  );
};

export default LoginCard;
