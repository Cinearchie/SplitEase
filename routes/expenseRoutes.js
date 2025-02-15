const express = require('express');
const expenseController = require('../controllers/expenseController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/add-expense/:roomId', (req, res) => {
    res.render('expense/addExpense', { roomId: req.params.roomId }); // Render the add expense form
  });
  
router.post('/add-expense/:roomId', ensureAuthenticated, expenseController.addExpense); // Handle expense form submissionrouter.get('/view-expenses/:roomId', expenseController.viewExpenses);

router.get('/view-expenses/:roomId', expenseController.viewExpenses); // Handle viewing expenses

module.exports = router;