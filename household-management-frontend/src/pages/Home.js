// React Component
import React, { useEffect, useState } from 'react';
import './styles.css';
import { Pie } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Home = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [reminders, setReminders] = useState([]);
  const [userName, setUserName] = useState('');
  const [achievements, setAchievements] = useState('');
  // Add these default values at the beginning of your component, for example after any imports and useState/useEffect hooks:
const latestExpense = 250;  // Replace with actual dynamic value if available
const latestCategory = 'Groceries';  // Replace with dynamic data if available
const goalProgress = 75;  // Percentage of goal achieved, e.g., 75%
const activeSubscriptions = 3;  // Number of active subscriptions
const subscriptionCost = 500;  // Total cost of active subscriptions, replace with real data

  const [expenseDistributionData, setExpenseDistributionData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#4CAF50', '#FF5733', '#FF8C00', '#FFD700'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  });
  
  const [currentCard, setCurrentCard] = useState(0);  // Track the current visible card

  useEffect(() => {
    const storedUserName = localStorage.getItem('username');
    if (storedUserName) {
      setUserName(storedUserName);
    }

    updateDataSummary();
    displayReminders();
    displayAchievements();
  }, []);

  const updateDataSummary = () => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const income = JSON.parse(localStorage.getItem("income")) || [];
    const budgets = JSON.parse(localStorage.getItem("budgets")) || [];
  
    const categoryBudgets = {
      rent: budgets.find(b => b.category === "Rent")?.amount || 0,
      food: budgets.find(b => b.category === "Food")?.amount || 0,
      entertainment: budgets.find(b => b.category === "Entertainment")?.amount || 0,
      utilities: budgets.find(b => b.category === "Utilities")?.amount || 0,
    };
  
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalIncome = income.reduce((sum, incomeItem) => sum + parseFloat(incomeItem.amount), 0);

    setTotalExpenses(totalExpenses.toFixed(2));
    setTotalIncome(totalIncome.toFixed(2));
  
    const totalBudget = Object.values(categoryBudgets).reduce((sum, budget) => sum + parseFloat(budget), 0);
    setRemainingBudget((totalBudget - totalExpenses).toFixed(2));

    updateExpenseDistributionData(expenses);
  };

  const updateExpenseDistributionData = (expenses) => {
    const categoryTotals = {};

    expenses.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += parseFloat(expense.amount);
      } else {
        categoryTotals[expense.category] = parseFloat(expense.amount);
      }
    });

    setExpenseDistributionData({
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: ['#4CAF50', '#FF5733', '#FF8C00', '#FFD700'],
          borderColor: '#fff',
          borderWidth: 1,
        },
      ],
    });
  };

  const displayReminders = () => {
    const remindersList = [];
    const today = new Date();

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.forEach(expense => {
      const dueDate = new Date(expense.dueDate);
      if ((dueDate - today) / (1000 * 60 * 60 * 24) <= 7) {
        remindersList.push(`Expense "${expense.name}" is due soon.`);
      }
    });

    const pantryItems = JSON.parse(localStorage.getItem("pantryItems")) || [];
    pantryItems.forEach(item => {
      const expiryDate = new Date(item.expiryDate);
      if ((expiryDate - today) / (1000 * 60 * 60 * 24) <= 7) {
        remindersList.push(`Pantry item "${item.name}" expires soon.`);
      }
    });

    setReminders(remindersList.length ? remindersList : ["No upcoming reminders."]);
  };

  const displayAchievements = () => {
    if (remainingBudget > 0) {
      setAchievements("Great job! You stayed within budget this month!");
    } else {
      setAchievements("Keep an eye on expenses to stay within budget next month.");
    }
  };

  const handleClearAllData = () => {
    localStorage.removeItem("expenses");
    localStorage.removeItem("budgets");
    localStorage.removeItem("pantryItems");
    updateDataSummary();
    displayReminders();
    setAchievements("");
    alert("All data has been cleared.");
  };

  const handleBackupData = () => {
    const data = {
      expenses: JSON.parse(localStorage.getItem("expenses")) || [],
      budgets: JSON.parse(localStorage.getItem("budgets")) || [],
      pantryItems: JSON.parse(localStorage.getItem("pantryItems")) || []
    };
    const dataStr = JSON.stringify(data);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup.json';
    link.click();

    URL.revokeObjectURL(url);
    alert("Backup downloaded successfully.");
  };

  const totalCards = 10; // Total number of cards

const handleNextCard = () => {
  setCurrentCard((prevCard) => (prevCard + 1) % totalCards); // Cycle through 5 cards
};

const handlePrevCard = () => {
  setCurrentCard((prevCard) => (prevCard - 1 + totalCards) % totalCards); // Cycle through 5 cards
};

  return (
    <div className="home-container">
  <header className="hero">
    <h1>Household Management Dashboard</h1>
  </header>

  <section className="greeting">
    <h2>Hello, {userName || 'Guest'}!</h2>
    <p>Welcome back! Here’s your financial overview for today.</p>
  </section>

  <section className="summary-section">
    {/* New container for cards and chart */}
    <div className="cards-and-chart-container">
      {/* Summary Cards (Sliding Cards) */}
      <section className="summary-section">
      <div className="summary-cards-container">
            {/* Card 1: Home */}
            <div className={`summary-box ${currentCard === 0 ? 'visible' : 'hidden'}`}>
              <h3>Overview</h3>
              <p>Your dashboard at a glance.</p>
            </div>

            {/* Card 2: Expense Tracker */}
            <div className={`summary-box ${currentCard === 1 ? 'visible' : 'hidden'}`}>
              <h3>Expense Tracker</h3>
              <p>Total Expenses: ₹[Amount]</p>
              <p>Latest Expense: ₹[Amount]</p>
            </div>

            {/* Card 3: Budget Planner */}
            <div className={`summary-box ${currentCard === 2 ? 'visible' : 'hidden'}`}>
              <h3>Budget Planner</h3>
              <p>Current Budget: ₹[Amount]</p>
              <p>Remaining Budget: ₹[Amount]</p>
            </div>

            {/* Card 4: Meal Planner */}
            <div className={`summary-box ${currentCard === 3 ? 'visible' : 'hidden'}`}>
              <h3>Meal Planner</h3>
              <p>Upcoming Meal: [Meal Name]</p>
              <p>Calories: [Calories]</p>
            </div>

            {/* Card 5: Habit Tracker */}
            <div className={`summary-box ${currentCard === 4 ? 'visible' : 'hidden'}`}>
              <h3>Habit Tracker</h3>
              <p>Habit Streak: [Streak]</p>
              <p>Current Habit: [Habit]</p>
            </div>

            {/* Card 6: Monthly Summary */}
            <div className={`summary-box ${currentCard === 5 ? 'visible' : 'hidden'}`}>
              <h3>Monthly Summary</h3>
              <p>Total Savings: ₹[Amount]</p>
              <p>Total Expenses: ₹[Amount]</p>
            </div>

            {/* Card 7: Reminders */}
            <div className={`summary-box ${currentCard === 6 ? 'visible' : 'hidden'}`}>
              <h3>Reminders</h3>
              <p>Next Due Date: [Date]</p>
              <p>Upcoming Reminder: [Reminder]</p>
            </div>

            {/* Card 8: Subscription Manager */}
            <div className={`summary-box ${currentCard === 7 ? 'visible' : 'hidden'}`}>
              <h3>Subscription Manager</h3>
              <p>Active Subscriptions: [Number]</p>
              <p>Monthly Cost: ₹[Amount]</p>
            </div>

            {/* Card 9: Bill Tracker */}
            <div className={`summary-box ${currentCard === 8 ? 'visible' : 'hidden'}`}>
              <h3>Bill Tracker</h3>
              <p>Upcoming Bill: [Bill Name]</p>
              <p>Due Amount: ₹[Amount]</p>
            </div>

            {/* Card 10: Shopping List */}
            <div className={`summary-box ${currentCard === 9 ? 'visible' : 'hidden'}`}>
              <h3>Shopping List</h3>
              <p>Items Remaining: [Number]</p>
              <p>Budget for Shopping: ₹[Amount]</p>
            </div>
          </div>

  {/* Updated Arrow Buttons */}
  <div className="carousel-arrows">
    <button className="carousel-arrow left" onClick={handlePrevCard}>←</button>
    <button className="carousel-arrow right" onClick={handleNextCard}>→</button>
  </div>
</section>


      {/* Pie Chart Section */}
      <div className="pie-chart">
        <h3>Expense Distribution</h3>
        <Pie data={expenseDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  </section>

  <section className="actions">
    <div className="buttons-group">
      <button onClick={handleBackupData}>Backup Data</button>
      <button className="clear-button" onClick={handleClearAllData}>Clear All Data</button>
    </div>
  </section>

  <section className="reminder-section">
    <h3>Reminders</h3>
    <ul>
      {reminders.length === 0 ? <li>No upcoming reminders.</li> : reminders.map((reminder, index) => (
        <li key={index}>{reminder}</li>
      ))}
    </ul>
  </section>
</div>
  );
};

export default Home;
