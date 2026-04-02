const Transaction = require("../models/transaction");

exports.createTransaction = async (req, res) => {
  const txn = await Transaction.create(req.body);
  res.json(txn);
};

exports.getTransactions = async (req, res) => {
  const txns = await Transaction.find();
  res.json(txns);
};