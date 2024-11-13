import React, { useEffect, useState } from 'react';
import '../styles.css'; // Import your stylesheet

const MealPlanner = () => {
    const [meals, setMeals] = useState([]);
    const [day, setDay] = useState('');
    const [mealType, setMealType] = useState('');
    const [mealName, setMealName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [currentMealIndex, setCurrentMealIndex] = useState(null);

    // Load meals from local storage on component mount
    useEffect(() => {
        loadMeals();
    }, []);

    const loadMeals = () => {
        const storedMeals = JSON.parse(localStorage.getItem('meals')) || [];
        setMeals(storedMeals);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const meal = {
            id: Date.now(),
            day,
            type: mealType,
            name: mealName,
            ingredients: ingredients.split(',').map(item => item.trim()) // Split ingredients by commas
        };

        const updatedMeals = currentMealIndex !== null 
            ? meals.map((m, index) => index === currentMealIndex ? meal : m)
            : [...meals, meal];

        localStorage.setItem('meals', JSON.stringify(updatedMeals));
        resetForm();
        loadMeals();
    };

    const resetForm = () => {
        setDay('');
        setMealType('');
        setMealName('');
        setIngredients('');
        setCurrentMealIndex(null);
    };

    const editMeal = (index) => {
        const meal = meals[index];
        setDay(meal.day);
        setMealType(meal.type);
        setMealName(meal.name);
        setIngredients(meal.ingredients.join(', ')); // Join ingredients back into a string for editing
        setCurrentMealIndex(index);
    };

    const deleteMeal = (index) => {
        const updatedMeals = meals.filter((_, i) => i !== index);
        localStorage.setItem('meals', JSON.stringify(updatedMeals));
        loadMeals();
    };

    const exportPlan = () => {
        window.print();
    };

    return (
        <div>
            <header>
                <h1>Meal Planner</h1>
            </header>
            <main>
                <section className="meal-form">
                    <h2>Add Meal</h2>
                    <form id="mealForm" onSubmit={handleSubmit}>
                        <label htmlFor="day">Day:</label>
                        <select
                            id="day"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            required
                        >
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                        
                        <label htmlFor="mealType">Meal Type:</label>
                        <select
                            id="mealType"
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                            required
                        >
                            <option value="">Select Meal Type</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snack">Snack</option>
                        </select>
                        
                        <input
                            type="text"
                            id="mealName"
                            value={mealName}
                            onChange={(e) => setMealName(e.target.value)}
                            placeholder="Meal Name"
                            required
                        />
                        <input
                            type="text"
                            id="ingredients"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="Ingredients"
                        />
                        
                        <button type="submit">Add Meal</button>
                    </form>
                </section>
                
                <section className="meal-list">
                    <h2>Weekly Meal Plan</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Meal Type</th>
                                <th>Meal Name</th>
                                <th>Ingredients</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meals.map((meal, index) => (
                                <tr key={meal.id}>
                                    <td>{meal.day}</td>
                                    <td>{meal.type}</td>
                                    <td>{meal.name}</td>
                                    <td>{meal.ingredients.join(', ')}</td>
                                    <td>
                                        <button onClick={() => editMeal(index)}>Edit</button>
                                        <button onClick={() => deleteMeal(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={exportPlan} className="export-button">Export/Print Plan</button>
                </section>
            </main>
        </div>
    );
};

export default MealPlanner;
