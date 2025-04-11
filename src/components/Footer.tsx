
import React from 'react';

// Footer component
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Assignment Assist.</p>
          <div className="flex gap-4">
            <a href="#" className="nav-link">Terms</a>
            <a href="#" className="nav-link">Privacy</a>
            <a href="#" className="nav-link">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
