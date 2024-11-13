import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css'; // Import your stylesheet

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [date, setDate] = useState('');
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [currentExpenseIndex, setCurrentExpenseIndex] = useState(null);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state
    const [error, setError] = useState(''); // Added error state
    const [allCategories] = useState(['Food', 'Transport', 'Entertainment', 'Bills', 'Others']);


    const API_URL = 'http://localhost:8080'; // URL for the backend API

    // Load expenses from the backend on component mount
    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        setLoading(true); // Start loading
        setError(''); // Clear previous errors
        try {
            const response = await axios.get(`${API_URL}/expenses`);
            setExpenses(response.data);
            setFilteredExpenses(response.data);
            generateCategoryList(response.data);
        } catch (error) {
            setError('Error loading expenses. Please try again later.');
            console.error('Error loading expenses:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const generateCategoryList = (storedExpenses) => {
        const uniqueCategories = [...new Set(storedExpenses.map(expense => expense.category))];
        setCategories(uniqueCategories);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form
        if (!date || !expenseName || !expenseAmount || !expenseCategory) {
            setError('All fields are required.');
            return;
        }

        // Validate expense amount
        if (expenseAmount <= 0 || isNaN(expenseAmount)) {
            setError('Please enter a valid expense amount.');
            return;
        }

        const expense = { date, category: expenseCategory, amount: parseFloat(expenseAmount), notes };
        const updatedExpenses = [...expenses];

        try {
            setLoading(true);
            setError('');
            if (currentExpenseIndex !== null) {
                // Update existing expense
                console.log("gaya 1");
                await axios.put(`${API_URL}/expenses/${expenses[currentExpenseIndex]._id}`, expense);
                updatedExpenses[currentExpenseIndex] = expense; // Update local state
                setCurrentExpenseIndex(null);
                console.log("aaya 1");
            } else {
                console.log("gaya 2");
                // Add new expense
                const response = await axios.post(`${API_URL}/api/expenses`, expense);
                updatedExpenses.push(response.data); // Add new expense to local state
                console.log("aaya 2");
            }
            setExpenses(updatedExpenses);
            setFilteredExpenses(updatedExpenses);
            resetForm();
        } catch (error) {
            setError('Error saving expense. Please try again later.');
            console.error('Error submitting expense:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setDate('');
        setExpenseName('');
        setExpenseAmount('');
        setExpenseCategory('');
        setNotes('');
    };

    const editExpense = (index) => {
        const expense = expenses[index];
        setDate(expense.date);
        setExpenseCategory(expense.category);
        setExpenseAmount(expense.amount);
        setNotes(expense.notes);
        setCurrentExpenseIndex(index); // Set index for editing
    };

    const deleteExpense = async (index) => {
        try {
            const expenseId = expenses[index]._id;
            await axios.delete(`${API_URL}/expenses/${expenseId}`);
            const updatedExpenses = expenses.filter((_, i) => i !== index); // Remove expense by index
            setExpenses(updatedExpenses);
            setFilteredExpenses(updatedExpenses);
        } catch (error) {
            setError('Error deleting expense. Please try again later.');
            console.error('Error deleting expense:', error);
        }
    };

    // Filter expenses by category
    const filterExpensesByCategory = (category) => {
        const filtered = expenses.filter(expense => expense.category === category);
        setFilteredExpenses(filtered);
    };

    // Filter all expenses when "All" button is clicked
    const showAllExpenses = () => {
        setFilteredExpenses(expenses);
    };

    return (
        <div>
            <header>
                <h1>Expense Tracker</h1>
                
            </header>
            <main>
                <section id="expenseTracker">
                    {error && <div className="error-message">{error}</div>} {/* Error message */}
                    <form id="expenseForm" onSubmit={handleSubmit}>
                        <h2>Add New Expense</h2>

                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            id="expenseName"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                            required
                            placeholder="Expense Name"
                        />

                        <input
                            type="number"
                            id="expenseAmount"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            required
                            placeholder="Amount"
                        />

                        <select
                            id="expenseCategory"
                            value={expenseCategory}
                            onChange={(e) => setExpenseCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {allCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>


                        <label htmlFor="notes">Notes:</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Add Expense'}
                        </button>
                    </form>

                    <h2>Expense List</h2>
                    <div>
                        <button onClick={() => showAllExpenses()}>Show All</button>
                        {categories.map((category, index) => (
                            <button key={index} onClick={() => filterExpensesByCategory(category)}>
                                Filter by {category}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p>Loading expenses...</p>
                    ) : (
                        <table id="expenseTable">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Amount (₹)</th>
                                    <th>Notes</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.map((expense, index) => (
                                    <tr key={index}>
                                        <td>{expense.date}</td>
                                        <td>{expense.category}</td>
                                        <td>₹{expense.amount}</td>
                                        <td>{expense.notes}</td>
                                        <td>
                                            <button onClick={() => editExpense(index)}>Edit</button>
                                            <button onClick={() => deleteExpense(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </div>
    );
};

export default ExpenseTracker;
