const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const expenselimit = require('../controllers/limit');

// Routes for expenses
router.get('/', expenseController.getExpenses);
router.post('/', expenseController.addExpense);
router.post('/limit', expenselimit.limitExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
