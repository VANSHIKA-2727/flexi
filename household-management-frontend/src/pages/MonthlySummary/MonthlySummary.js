import React, { useEffect, useState } from 'react';
import '../styles.css'; // Import your stylesheet

const MonthlySummary = () => {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [remainingBudget, setRemainingBudget] = useState(0);
    const [mealPlan, setMealPlan] = useState([]);
    const [habitProgress, setHabitProgress] = useState([]);
    const [savingsProgress, setSavingsProgress] = useState('');
    const [pantryItems, setPantryItems] = useState([]);
    const [lists, setLists] = useState([]);
    const [bills, setBills] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        loadMonthlySummary();
    }, []);

    const loadMonthlySummary = () => {
        // Load existing data from local storage
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        setTotalExpenses(total);

        const budgets = JSON.parse(localStorage.getItem("budgets")) || [];
        const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0);
        setRemainingBudget((totalBudget - total).toFixed(2));

        const meals = JSON.parse(localStorage.getItem("meals")) || [];
        setMealPlan(meals);

        const habits = JSON.parse(localStorage.getItem("habits")) || [];
        setHabitProgress(habits);

        const savingsGoals = JSON.parse(localStorage.getItem("savingsGoals")) || [];
        const totalSavingsGoal = savingsGoals.reduce((sum, goal) => sum + parseFloat(goal.amount), 0);
        const savingsPercentage = totalSavingsGoal > 0 ? (total / totalSavingsGoal) * 100 : 0;
        setSavingsProgress(`${savingsPercentage.toFixed(2)}% of your savings goal reached`);

        const pantryList = JSON.parse(localStorage.getItem("pantryItems")) || [];
        setPantryItems(pantryList);

        // Loading lists, bills, and subscriptions data
        const listItems = JSON.parse(localStorage.getItem("lists")) || [];
        setLists(listItems);

        const billItems = JSON.parse(localStorage.getItem("bills")) || [];
        setBills(billItems);

        const subscriptionItems = JSON.parse(localStorage.getItem("subscriptions")) || [];
        setSubscriptions(subscriptionItems);
    };

    return (
        <div>
            <header>
                <h1 className="dashboard-title">Monthly Summary Dashboard</h1>
            </header>
            <main>
                <section className="summary-container">
                    <div id="summary">
                        {/* Expense Tracker Card */}
                        <div className="summary-card">
                            <h2>Expense Tracker</h2>
                            <div>Total Expenses: ₹{totalExpenses.toFixed(2)}</div>
                        </div>

                        {/* Budget Planner Card */}
                        <div className="summary-card">
                            <h2>Budget Planner</h2>
                            <div>Remaining Budget: ₹{remainingBudget}</div>
                        </div>

                        {/* Meal Planner Card */}
                        <div className="summary-card">
                            <h2>Meal Planner</h2>
                            <ul id="mealPlanList">
                                {mealPlan.length > 0 ? mealPlan.map((meal, index) => (
                                    <li key={index}>{meal.name} - {meal.type}</li>
                                )) : <li>No meals planned yet</li>}
                            </ul>
                        </div>

                        {/* Habit Tracker Card */}
                        <div className="summary-card">
                            <h2>Habit Tracker</h2>
                            <ul id="habitProgress">
                                {habitProgress.length > 0 ? habitProgress.map((habit, index) => (
                                    <li key={index}>{habit.name} - Target: {habit.goal} times, Frequency: {habit.frequency}</li>
                                )) : <li>No habits added yet</li>}
                            </ul>
                        </div>

                        {/* Savings Goals Card */}
                        <div className="summary-card">
                            <h2>Savings Goals Tracker</h2>
                            <div>
                                <h3>Savings Progress</h3>
                                <div style={{ width: '100%', backgroundColor: '#f3f3f3' }}>
                                    <div style={{ width: savingsProgress.includes('%') ? savingsProgress.replace('%', '') + '%' : '0%', backgroundColor: '#4caf50', height: '30px' }}></div>
                                </div>
                                <span>{savingsProgress}</span>
                            </div>
                        </div>

                        {/* Pantry/Inventory Tracker Card */}
                        <div className="summary-card">
                            <h2>Pantry/Inventory Tracker</h2>
                            <div>Items expiring soon: {pantryItems.filter(item => {
                                const expiryDate = new Date(item.expiryDate);
                                const today = new Date();
                                const daysToExpiry = (expiryDate - today) / (1000 * 60 * 60 * 24);
                                return daysToExpiry > 0 && daysToExpiry <= 7;
                            }).length}</div>
                            <ul id="pantryList">
                                {pantryItems.length > 0 ? pantryItems.map((item, index) => (
                                    <li key={index}>{item.name} - Expiry: {item.expiryDate}</li>
                                )) : <li>No pantry items added yet</li>}
                            </ul>
                        </div>

                        {/* Lists Card */}
                        <div className="summary-card">
                            <h2>Lists</h2>
                            <ul id="lists">
                                {lists.length > 0 ? lists.map((listItem, index) => (
                                    <li key={index}>{listItem.name}</li>
                                )) : <li>No lists created</li>}
                            </ul>
                        </div>

                        {/* Bills Card */}
                        <div className="summary-card">
                            <h2>Bills</h2>
                            <ul id="bills">
                                {bills.length > 0 ? bills.map((bill, index) => (
                                    <li key={index}>{bill.name} - Due: {bill.dueDate}</li>
                                )) : <li>No bills due</li>}
                            </ul>
                        </div>

                        {/* Subscription Manager Card */}
                        <div className="summary-card">
                            <h2>Subscription Manager</h2>
                            <ul id="subscriptions">
                                {subscriptions.length > 0 ? subscriptions.map((sub, index) => (
                                    <li key={index}>{sub.name} - Cost: ₹{sub.cost} - Due: {sub.dueDate}</li>
                                )) : <li>No subscriptions</li>}
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MonthlySummary;
