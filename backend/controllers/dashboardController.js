const Transaction = require("../models/transaction");

exports.getSummary = async (req, res) => {
  const txns = await Transaction.find();

  let income = 0;
  let expense = 0;

  txns.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  res.json({
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - expense,
  });
};