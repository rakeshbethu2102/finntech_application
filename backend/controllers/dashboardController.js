const Transaction = require("../models/transaction");

exports.getSummary = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};

    transactions.forEach((txn) => {
      if (txn.type === "income") totalIncome += txn.amount;
      if (txn.type === "expense") totalExpense += txn.amount;
      if (!categoryTotals[txn.category]) {
        categoryTotals[txn.category] = 0;
      }
      categoryTotals[txn.category] += txn.amount;
    });

    const recentActivity = transactions.slice(0, 5);

    const monthlyTrendData = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyTrends = monthlyTrendData.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      type: item._id.type,
      total: item.total,
    }));

    res.json({
      success: true,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryTotals,
      recentActivity,
      monthlyTrends,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to load dashboard summary" });
  }
};