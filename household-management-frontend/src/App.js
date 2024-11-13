// src/App.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExpenseTracker from './pages/ExpenseTracker/ExpenseTracker';
import BudgetPlanner from './pages/BudgetPlanner/BudgetPlanner';
import MealPlanner from './pages/MealPlanner/MealPlanner';
import HabitTracker from './pages/HabitTracker/HabitTracker';
import SavingsGoals from './pages/SavingsGoals/SavingsGoals';
import MonthlySummary from './pages/MonthlySummary/MonthlySummary';
import Reminders from './pages/Reminders/Reminders';
import SubscriptionManager from './pages/SubscriptionManager/SubscriptionManager';
import BillTracker from './pages/BillTracker/BillTracker';
import Lists from './pages/Lists/Lists';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import LandingPage from './pages/LandingPage';
import EditProfile from './pages/EditProfile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null to handle the loading state
  const [isDarkMode, setIsDarkMode] = useState(false); // Manage theme state

  // Check if the user is authenticated when the app loads
  useEffect(() => {
    const username = localStorage.getItem('username'); // Get the username from localStorage
    setIsAuthenticated(username ? true : false); // Set to true if a username exists
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode); // Toggle theme
  };

  // Protected Route component to wrap private routes
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  // Wait until authentication state is determined (not null)
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Navbar handleThemeToggle={handleThemeToggle} />

      <Routes>
        {/* Default Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} />} />

        {/* Redirect to Home after successful Login */}
        <Route 
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />

        {/* Private Routes */}
        <Route path="/profile" element={<ProtectedRoute element={<Navigate to="/profile/edit" />} />} />
        <Route path="/profile/edit" element={<ProtectedRoute element={<EditProfile />} />} />

        {/* Feature Routes */}
        <Route path="/features/expense-tracker" element={<ProtectedRoute element={<ExpenseTracker />} />} />
        <Route path="/features/budget-planner" element={<ProtectedRoute element={<BudgetPlanner />} />} />
        <Route path="/features/meal-planner" element={<ProtectedRoute element={<MealPlanner />} />} />
        <Route path="/features/habit-tracker" element={<ProtectedRoute element={<HabitTracker />} />} />
        <Route path="/features/savings-goals" element={<ProtectedRoute element={<SavingsGoals />} />} />
        <Route path="/features/monthly-summary" element={<ProtectedRoute element={<MonthlySummary />} />} />
        <Route path="/features/reminders" element={<ProtectedRoute element={<Reminders />} />} />
        <Route path="/features/subscription-manager" element={<ProtectedRoute element={<SubscriptionManager />} />} />
        <Route path="/features/bill-tracker" element={<ProtectedRoute element={<BillTracker />} />} />
        <Route path="/features/shopping-list" element={<ProtectedRoute element={<Lists />} />} />
      </Routes>
    </div>
  );
}

export default App;
