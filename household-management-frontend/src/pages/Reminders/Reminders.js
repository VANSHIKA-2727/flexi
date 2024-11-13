import React, { useEffect, useState } from 'react';
import '../styles.css'; // Import your stylesheet

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [reminderName, setReminderName] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');

    useEffect(() => {
        loadReminders();
    }, []);

    const loadReminders = () => {
        const loadedReminders = JSON.parse(localStorage.getItem("reminders")) || [];
        setReminders(loadedReminders);
    };

    const addReminder = (event) => {
        event.preventDefault();
        
        const newReminder = {
            id: Date.now(),
            name: reminderName,
            date: reminderDate,
            time: reminderTime
        };

        const updatedReminders = [...reminders, newReminder];
        localStorage.setItem("reminders", JSON.stringify(updatedReminders));
        
        setReminders(updatedReminders);
        resetForm();
    };

    const deleteReminder = (id) => {
        const updatedReminders = reminders.filter(reminder => reminder.id !== id);
        localStorage.setItem("reminders", JSON.stringify(updatedReminders));
        setReminders(updatedReminders);
    };

    const resetForm = () => {
        setReminderName('');
        setReminderDate('');
        setReminderTime('');
    };

    return (
        <div>
            <header>
                <h1>Automated Reminders</h1>
                <nav>
                    <a href="/">Home</a>
                </nav>
            </header>
            <main>
                <section className="reminder-form">
                    <h2>Add Reminder</h2>
                    <form id="reminderForm" onSubmit={addReminder}>
                        <label htmlFor="reminderName">Reminder Name:</label>
                        <input 
                            type="text" 
                            id="reminderName" 
                            placeholder="e.g., Doctor Appointment" 
                            value={reminderName}
                            onChange={(e) => setReminderName(e.target.value)}
                            required 
                        />
                        
                        <label htmlFor="reminderDate">Date:</label>
                        <input 
                            type="date" 
                            id="reminderDate" 
                            value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                            required 
                        />
                        
                        <label htmlFor="reminderTime">Time:</label>
                        <input 
                            type="time" 
                            id="reminderTime" 
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            required 
                        />
                        
                        <button type="submit">Add Reminder</button>
                    </form>
                </section>
                
                <section className="reminder-list">
                    <h2>Scheduled Reminders</h2>
                    <ul id="reminderList">
                        {reminders.length > 0 ? reminders.map((reminder) => (
                            <li key={reminder.id}>
                                <span>{reminder.date} {reminder.time} - {reminder.name}</span>
                                <button onClick={() => deleteReminder(reminder.id)}>Delete</button>
                            </li>
                        )) : <li>No reminders scheduled yet</li>}
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default Reminders;
