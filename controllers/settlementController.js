const Expense = require('../models/Expense');
const Room = require('../models/Room');
const { calculateSettlements } = require('../utils/helpers');

exports.getSettlements = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId }).populate('members');
    const expenses = await Expense.find({ room: room._id }).populate('payer');
    const settlements = calculateSettlements(expenses, room.members);
    res.render('settlement/settlement', { settlements, room });
  } catch (err) {
    console.error(err);
    res.redirect(`/room/${req.params.roomId}`);
  }
};