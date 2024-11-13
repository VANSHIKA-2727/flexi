import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const ExpensePieChart = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(storedExpenses);
  }, []);

  // Categorize expenses by category
  const categorizeExpenses = () => {
    const categories = ['Rent', 'Food', 'Entertainment', 'Utilities'];
    const categoryExpenses = categories.map(category => {
      return expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    });
    return categoryExpenses;
  };

  const categoryExpenses = categorizeExpenses();

  // Data for Pie chart
  const data = {
    labels: ['Rent', 'Food', 'Entertainment', 'Utilities'],
    datasets: [
      {
        label: 'Expense Distribution',
        data: categoryExpenses,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // colors for each section
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="pie-chart-container">
      <h3>Expense Breakdown</h3>
      <Pie data={data} />
    </div>
  );
};

export default ExpensePieChart;
