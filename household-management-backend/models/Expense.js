const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    notes: { type: String, required: false },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
