// src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css';


const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="header">
        <h1>Welcome to Household Management</h1>
        <p>Your ultimate solution for managing household expenses and budgets.</p>
        <nav>
          <Link to="/login" className="cta-button">Login</Link>
          <Link to="/signup" className="cta-button">Sign up</Link>
        </nav>
      </header>
    </div>
  );
};

export default LandingPage;
