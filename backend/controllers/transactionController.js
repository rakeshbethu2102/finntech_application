const Transaction = require("../models/transaction");
const User = require("../models/user");
const {
  TRANSACTION_TYPES,
  buildDateRangeFilter,
  getAllowedFields,
  isNonEmptyString,
  isValidObjectId,
  parseDateInput,
  parsePositiveAmount,
  toTrimmedString,
} = require("../utils/validation");

exports.createTransaction = async (req, res) => {
  try {
    const { userId, amount, type, category, date, notes } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "userId must be a valid id" });
    }

    const amountResult = parsePositiveAmount(amount);
    if (!amountResult.ok) {
      return res.status(400).json({ success: false, message: "amount must be a positive number" });
    }

    if (!TRANSACTION_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `type must be one of: ${TRANSACTION_TYPES.join(", ")}`,
      });
    }

    if (!isNonEmptyString(category)) {
      return res.status(400).json({ success: false, message: "category is required" });
    }

    const parsedDate = parseDateInput(date);
    if (parsedDate.provided && !parsedDate.valid) {
      return res.status(400).json({ success: false, message: "date must be a valid date" });
    }

    if (notes !== undefined && notes !== null && typeof notes !== "string") {
      return res.status(400).json({ success: false, message: "notes must be a string" });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const transaction = await Transaction.create({
      userId,
      amount: amountResult.value,
      type,
      category: toTrimmedString(category),
      ...(parsedDate.valid ? { date: parsedDate.value } : {}),
      ...(notes !== undefined ? { notes: toTrimmedString(notes) } : {}),
    });

    res.status(201).json({ success: true, transaction });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Unable to create transaction" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, userId } = req.query;
    const filter = {};

    if (userId) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ success: false, message: "userId must be a valid id" });
      }
      filter.userId = userId;
    }

    if (type) {
      if (!TRANSACTION_TYPES.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `type must be one of: ${TRANSACTION_TYPES.join(", ")}`,
        });
      }
      filter.type = type;
    }

    if (category) {
      if (!isNonEmptyString(category)) {
        return res.status(400).json({ success: false, message: "category must be a non-empty string" });
      }
      filter.category = toTrimmedString(category);
    }

    const dateRange = buildDateRangeFilter(startDate, endDate);
    if (!dateRange.ok) {
      return res.status(400).json({ success: false, message: dateRange.message });
    }
    if (dateRange.filter) {
      filter.date = dateRange.filter;
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

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Transaction id is invalid" });
    }

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
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Transaction id is invalid" });
    }

    const { updates, invalidFields } = getAllowedFields(req.body, [
      "amount",
      "type",
      "category",
      "date",
      "notes",
    ]);

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unsupported fields in request: ${invalidFields.join(", ")}`,
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one updatable field is required",
      });
    }

    if (updates.amount !== undefined) {
      const amountResult = parsePositiveAmount(updates.amount);
      if (!amountResult.ok) {
        return res.status(400).json({ success: false, message: "amount must be a positive number" });
      }
      updates.amount = amountResult.value;
    }

    if (updates.type !== undefined && !TRANSACTION_TYPES.includes(updates.type)) {
      return res.status(400).json({
        success: false,
        message: `type must be one of: ${TRANSACTION_TYPES.join(", ")}`,
      });
    }

    if (updates.category !== undefined) {
      if (!isNonEmptyString(updates.category)) {
        return res.status(400).json({ success: false, message: "category must be a non-empty string" });
      }
      updates.category = toTrimmedString(updates.category);
    }

    if (updates.date !== undefined) {
      const parsedDate = parseDateInput(updates.date);
      if (!parsedDate.valid) {
        return res.status(400).json({ success: false, message: "date must be a valid date" });
      }
      updates.date = parsedDate.value;
    }

    if (updates.notes !== undefined) {
      if (updates.notes !== null && typeof updates.notes !== "string") {
        return res.status(400).json({ success: false, message: "notes must be a string" });
      }
      updates.notes = updates.notes === null ? null : toTrimmedString(updates.notes);
    }

    const transaction = await Transaction.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, transaction });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Unable to update transaction" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Transaction id is invalid" });
    }

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