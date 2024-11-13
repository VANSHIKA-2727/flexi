import React, { useEffect, useState } from 'react';
import '../styles.css'; // Correctly import your stylesheet
import axios from 'axios';

const BudgetPlanner = () => {
    const [budgets, setBudgets] = useState([]);
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [currentBudgetIndex, setCurrentBudgetIndex] = useState(null);
    const [buttonText, setButtonText] = useState('Set Budget'); // For the button text

    const API_URL = 'http://localhost:8080'; // URL for the backend API



    // Load budgets from local storage
    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = () => {
        const storedBudgets = JSON.parse(localStorage.getItem('budgets')) || [];
        setBudgets(storedBudgets);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();

        try {
             const expense = { category, amount };

            console.log("gaya 2");
            // Add new expense
            const response = await axios.post(`${API_URL}/api/expenses/limit`, expense);
            console.log("aaya 2");
            alert("budget added");
        
    } catch (error) {
        console.error('Error submitting expense:', error);

    }


        const dateAdded = new Date().toLocaleDateString(); // Get current date
        const budget = { category, amount, dateAdded };
        const updatedBudgets = [...budgets];

        if (currentBudgetIndex !== null) {
            updatedBudgets[currentBudgetIndex] = budget; // Update existing budget
            setCurrentBudgetIndex(null); // Reset index
            setButtonText('Set Budget'); // Reset button text
        } else {
            updatedBudgets.push(budget); // Add new budget
        }

        //localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
        //setBudgets(updatedBudgets);
        console.log(updatedBudgets);
        setCategory('');
        setAmount('');
    };

    const editBudget = (index) => {
        const budget = budgets[index];
        setCategory(budget.category);
        setAmount(budget.amount);
        setCurrentBudgetIndex(index); // Set index for editing
        setButtonText('Update Budget'); // Change button text for update
    };

    const deleteBudget = (index) => {
        const updatedBudgets = [...budgets];
        updatedBudgets.splice(index, 1); // Remove budget by index
        localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
        setBudgets(updatedBudgets); // Reload budgets
    };

    return (
        <div>
            <header>
                <h1>Budget Planner</h1>
            </header>
            <main>
                <section className="budget-form">
                    <h2>Set Budget</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Category"
                            required
                        />
                        
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                            required
                        />
                        
                        <button type="submit" className="action-button">{buttonText}</button> {/* Dynamic button text */}
                    </form>
                </section>
                
                <section className="budget-list">
                    <h2>Budgets</h2>
                    <table className="budget-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.length > 0 ? (
                                budgets.map((budget, index) => (
                                    <tr key={index}>
                                        <td>{budget.category}</td>
                                        <td>₹{budget.amount}</td>
                                        <td className="budget-actions">
                                            <button onClick={() => editBudget(index)} className="action-button">Edit</button>
                                            <button onClick={() => deleteBudget(index)} className="action-button delete-button">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No budgets recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default BudgetPlanner;