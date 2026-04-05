const User = require("../models/user");
const { ROLE_VALUES, STATUS_VALUES, isValidObjectId } = require("../utils/validation");

// Get all users (for admin/analyst to view)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user by ID with their details
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "User id is invalid" });
    }

    const user = await User.findById(id, { password: 0 });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user status (active/inactive) - admin only
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "User id is invalid" });
    }

    if (!STATUS_VALUES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user role - admin only
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "User id is invalid" });
    }

    if (!ROLE_VALUES.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user with their transactions (for admin/analyst to view user details)
exports.getUserWithTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const Transaction = require("../models/transaction");

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "User id is invalid" });
    }

    const user = await User.findById(userId, { password: 0 });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    // Calculate user statistics
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      user,
      transactions,
      stats: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        categoryTotals,
        transactionCount: transactions.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete user - admin only
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const Transaction = require("../models/transaction");

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "User id is invalid" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(409).json({
          success: false,
          message: "Cannot delete the last admin user",
        });
      }
    }

    // Delete user's transactions first
    await Transaction.deleteMany({ userId: id });

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
