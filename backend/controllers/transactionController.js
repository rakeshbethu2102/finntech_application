const Transaction = require("../models/transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { userId, amount, type, category, date, notes } = req.body;

    const transaction = await Transaction.create({
      userId,
      amount,
      type,
      category,
      date,
      notes,
    });

    res.json({ success: true, transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create transaction" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, userId } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch transactions" });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch transaction" });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const transaction = await Transaction.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to update transaction" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to delete transaction" });
  }
};