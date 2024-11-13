import React, { useEffect, useState } from 'react';
import '../styles.css'; // Import your stylesheet

const SavingsGoals = () => {
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [currentGoalIndex, setCurrentGoalIndex] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); // Success message state

    useEffect(() => {
        loadSavingsGoals();
    }, []);

    const loadSavingsGoals = () => {
        const goals = JSON.parse(localStorage.getItem("savingsGoals")) || [];
        setSavingsGoals(goals);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newGoal = { name: goalName, amount: goalAmount, deadline: deadline };
        const updatedGoals = [...savingsGoals];

        if (currentGoalIndex !== null) {
            updatedGoals[currentGoalIndex] = newGoal; // Update existing goal
            setSuccessMessage('Goal updated successfully!'); // Success message for updating
            setCurrentGoalIndex(null);
        } else {
            updatedGoals.push(newGoal); // Add new goal
            setSuccessMessage('Goal added successfully!'); // Success message for adding
        }

        localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
        setSavingsGoals(updatedGoals);
        resetForm();
    };

    const editGoal = (index) => {
        const goal = savingsGoals[index];
        setGoalName(goal.name);
        setGoalAmount(goal.amount);
        setDeadline(goal.deadline);
        setCurrentGoalIndex(index); // Track the index of the goal being edited
    };

    const deleteGoal = (index) => {
        const updatedGoals = savingsGoals.filter((_, i) => i !== index);
        localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
        setSavingsGoals(updatedGoals);
    };

    const resetForm = () => {
        setGoalName('');
        setGoalAmount('');
        setDeadline('');
    };

    return (
        <div>
            <header>
                <div className="title-card">
                    <h1>Savings Goals</h1>
                </div>
            </header>
            <main>
                <section className="savings-form">
                    <h2>{currentGoalIndex === null ? "Set Savings Goal" : "Edit Savings Goal"}</h2>
                    <form id="savingsForm" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="goalName"
                            placeholder="Goal Name"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            id="goalAmount"
                            placeholder="Amount"
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            required
                        />
                        <label htmlFor="deadline">Deadline:</label>
                        <input
                            type="date"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                        />
                        <button type="submit">
                            {currentGoalIndex === null ? "Add Goal" : "Update Goal"}
                        </button>
                    </form>
                    {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message */}
                </section>
                <section className="savings-list">
                    <h2>Your Savings Goals</h2>
                    <table className="goals-table">
                        <thead>
                            <tr>
                                <th>Goal Name</th>
                                <th>Amount</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savingsGoals.map((goal, index) => (
                                <tr key={index}>
                                    <td>{goal.name}</td>
                                    <td>₹{goal.amount}</td>
                                    <td>{goal.deadline}</td>
                                    <td>In Progress</td> {/* Placeholder for status */}
                                    <td>
                                        <button className="edit-btn" onClick={() => editGoal(index)}>Edit</button>
                                        <button className="delete-btn" onClick={() => deleteGoal(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default SavingsGoals;
