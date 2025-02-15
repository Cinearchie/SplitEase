const Expense = require('../models/Expense');
const Room = require('../models/Room');

exports.addExpense = async (req, res) => {
  const { description, amount } = req.body;
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    const expense = new Expense({ description, amount, payer: req.user._id, room: room._id });
    await expense.save();

    // Populate payer details for real-time update
    const populatedExpense = await Expense.findById(expense._id).populate('payer');

    // Emit the new expense to all clients in the room
    req.app.get('io').to(room.roomId).emit('new_expense', populatedExpense);

    req.flash('success_msg', 'Expense added successfully!');
    res.redirect(`/view-expenses/${req.params.roomId}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to add expense. Please try again.');
    res.redirect(`/view-expenses/${req.params.roomId}`);
  }
};

exports.viewExpenses = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    const expenses = await Expense.find({ room: room._id }).populate('payer');
    res.render('expense/viewExpenses', { expenses, room });
  } catch (err) {
    console.error(err);
    res.redirect(`/room/${req.params.roomId}`);
  }
};