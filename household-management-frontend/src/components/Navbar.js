import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

function Navbar({ handleThemeToggle }) {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // For Profile dropdown menu state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false); // For Features dropdown

  const handleFeaturesMenuToggle = () => setFeaturesMenuOpen(!featuresMenuOpen); // Toggle Features dropdown
  const handleProfileMenuToggle = () => setProfileMenuOpen(!profileMenuOpen); // Toggle Profile dropdown
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    handleThemeToggle();
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark-mode');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      localStorage.setItem('theme', 'light');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-section') && profileMenuOpen) {
        setProfileMenuOpen(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="home" className="navbar-logo">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLkCvaceexOvp91gxagcGAhWCc3yYCy4tGHw&s" alt="Logo" />
        </Link>
        <button onClick={handleFeaturesMenuToggle} className="features-button">Features</button>
        {featuresMenuOpen && (
          <div className="features-dropdown">
            <ul>
              <li><Link to="features/expense-tracker" className="dropdown-item">Expense Tracker</Link></li>
              <li><Link to="features/budget-planner" className="dropdown-item">Budget Planner</Link></li>
              <li><Link to="features/meal-planner" className="dropdown-item">Meal Planner</Link></li>
              <li><Link to="features/habit-tracker" className="dropdown-item">Habit Tracker</Link></li>
              <li><Link to="features/savings-goals" className="dropdown-item">Savings Goals</Link></li>
              <li><Link to="features/monthly-summary" className="dropdown-item">Monthly Summary</Link></li>
              <li><Link to="features/subscription-manager" className="dropdown-item">Subscription Manager</Link></li>
              <li><Link to="features/bill-tracker" className="dropdown-item">Bill Tracker</Link></li>
              <li><Link to="features/shopping-list" className="dropdown-item">Lists</Link></li>
            </ul>
          </div>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="profile-section">
            <button onClick={toggleTheme} className="icon-button">
              <img 
                src="https://cdn-icons-png.flaticon.com/128/12377/12377255.png"
                alt="Theme Toggle Icon"
                className="custom-icon"
              />
            </button>

            <button
              onClick={handleProfileMenuToggle}
              className="icon-button profile-button"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/18092/18092540.png"
                alt="Profile Icon"
                className="profile-icon"
              />
            </button>

            {profileMenuOpen && (
              <div className="profile-dropdown">
                <ul>
                  <li><Link to="profile/edit" className="dropdown-item">Edit Profile</Link></li>
                  <li><button onClick={handleLogout} className="dropdown-item">Logout</button></li>
                  <li><button onClick={() => alert('Notifications Clicked')} className="dropdown-item">Notifications</button></li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button onClick={handleLogin} className="link">Login</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
