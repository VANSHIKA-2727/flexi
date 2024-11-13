import React, { useEffect, useState } from 'react';
import '../styles.css'; // Import your stylesheet

const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [habitName, setHabitName] = useState('');
    const [frequency, setFrequency] = useState('');
    const [goal, setGoal] = useState('');
    const [time, setTime] = useState('');

    // Load habits from local storage on component mount
    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = () => {
        const storedHabits = JSON.parse(localStorage.getItem('habits')) || [];
        setHabits(storedHabits);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const habit = {
            id: Date.now(), // Unique ID for each habit
            name: habitName,
            frequency,
            goal,
            time,  // Add the time field to the habit object
        };

        const updatedHabits = [...habits, habit]; // Add new habit

        localStorage.setItem('habits', JSON.stringify(updatedHabits)); // Save to local storage
        resetForm();
        loadHabits(); // Reload habits
    };

    const resetForm = () => {
        setHabitName('');
        setFrequency('');
        setGoal('');
        setTime('');
    };

    const deleteHabit = (id) => {
        const updatedHabits = habits.filter(habit => habit.id !== id); // Remove habit by ID
        localStorage.setItem('habits', JSON.stringify(updatedHabits)); // Update local storage
        loadHabits(); // Reload habits
    };

    return (
        <div>
            <header>
                <h1>Habit Tracker</h1>
            </header>
            <main>
                <section className="habit-form">
                    <h2>Add Habit</h2>
                    <form id="habitForm" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="habitName"
                            value={habitName}
                            onChange={(e) => setHabitName(e.target.value)}
                            placeholder="Habit Name"
                            required
                        />
                        
                        <input
                            type="text"
                            id="frequency"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            placeholder="Frequency"
                            required
                        />
                        
                        <input
                            type="number"
                            id="goal"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="Set Goal"
                            required
                        />

                        <label htmlFor="habitTime">Time:</label>
                        <input
                            type="time"
                            id="habitTime"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}  
                            required
                        />
                        
                        <button type="submit">Add Habit</button>
                    </form>
                </section>      
                <section className="habit-list">
                    <h2>Your Habits</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Habit Name</th>
                                <th>Frequency</th>
                                <th>Goal</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => (
                                <tr key={habit.id}>
                                    <td>{habit.name}</td>
                                    <td>{habit.frequency}</td>
                                    <td>{habit.goal} times</td>
                                    <td>{habit.time}</td>
                                    <td><button onClick={() => deleteHabit(habit.id)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default HabitTracker;
