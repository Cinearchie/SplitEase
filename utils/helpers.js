const calculateSettlements = (expenses, members) => {
  const balances = {};
  members.forEach(member => balances[member._id] = 0);

  // Calculate how much each person should have paid and their balance
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const amountPerPerson = totalAmount / members.length;

  members.forEach(member => {
      const totalPaid = expenses
          .filter(expense => expense.payer._id.toString() === member._id.toString())
          .reduce((sum, expense) => sum + expense.amount, 0);

      balances[member._id] = totalPaid - amountPerPerson;
  });

  // Sort members into givers (who owe money) and receivers (who should be paid)
  const givers = Object.entries(balances)
      .filter(([_, balance]) => balance < 0)
      .map(([id, balance]) => ({ id, balance }));

  const receivers = Object.entries(balances)
      .filter(([_, balance]) => balance > 0)
      .map(([id, balance]) => ({ id, balance }));

  const settlements = [];

  // Settle payments
  while (givers.length && receivers.length) {
      const giver = givers[0];
      const receiver = receivers[0];

      const amount = Math.min(-giver.balance, receiver.balance);
      settlements.push({
          from: members.find(m => m._id.toString() === giver.id).name,
          to: members.find(m => m._id.toString() === receiver.id).name,
          amount: amount.toFixed(2),
      });

      // Adjust balances
      giver.balance += amount;
      receiver.balance -= amount;

      if (giver.balance === 0) givers.shift();
      if (receiver.balance === 0) receivers.shift();
  }

  return settlements;
};

module.exports = { calculateSettlements };
