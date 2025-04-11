
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginCard from '../components/LoginCard';

// Home page component
const HomePage: React.FC = () => {
  const [activeLogin, setActiveLogin] = React.useState<'teacher' | 'student' | null>(null);
  const navigate = useNavigate();

  const handleLoginClick = (role: 'teacher' | 'student') => {
    setActiveLogin(role);
  };

  return (
    <div>
      <Navbar />
      
      <div className="container">
        <div className="hero-section">
          {/* Left side content */}
          <div className="hero-content">
            <h1 className="hero-title">Assignment Assist</h1>
            <p className="hero-subtitle">
              Automated grading and plagiarism detection for students and teachers.
            </p>
            
            <div className="flex gap-4 mt-8">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => handleLoginClick('teacher')}
              >
                Teacher Login
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => handleLoginClick('student')}
              >
                Student Login
              </button>
            </div>
          </div>
          
          {/* Right side - login or image */}
          <div className="flex justify-center">
            {activeLogin ? (
              <LoginCard role={activeLogin} />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80" 
                alt="Digital Learning"
                className="hero-image"
                style={{ borderRadius: '0.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
              />
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
