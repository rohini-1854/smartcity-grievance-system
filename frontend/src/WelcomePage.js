import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">WELCOME TO</h1>
        <h1 className="welcome-subtitle">
          Smart City Online Grievance System for Municipal Corporation
        </h1>
        <button className="welcome-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
