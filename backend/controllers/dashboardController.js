const Transaction = require("../models/transaction");
const { buildDateRangeFilter, isValidObjectId } = require("../utils/validation");

exports.getSummary = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const filter = {};

    if (userId) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ success: false, message: "userId must be a valid id" });
      }
      filter.userId = userId;
    }

    const dateRange = buildDateRangeFilter(startDate, endDate);
    if (!dateRange.ok) {
      return res.status(400).json({ success: false, message: dateRange.message });
    }
    if (dateRange.filter) {
      filter.date = dateRange.filter;
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