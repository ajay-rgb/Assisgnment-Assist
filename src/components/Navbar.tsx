
import React from 'react';
import { Link } from 'react-router-dom';

// Navigation bar component
const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="nav-logo">Grade Guardian</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
