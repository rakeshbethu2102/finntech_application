const mongoose = require("mongoose");

const ROLE_VALUES = ["viewer", "analyst", "admin"];
const STATUS_VALUES = ["active", "inactive"];
const TRANSACTION_TYPES = ["income", "expense"];

const toTrimmedString = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const isNonEmptyString = (value) => toTrimmedString(value).length > 0;

const isValidEmail = (value) => {
  const email = toTrimmedString(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const parseDateInput = (value) => {
  if (value === undefined || value === null || value === "") {
    return { provided: false };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { provided: true, valid: false };
  }

  return { provided: true, valid: true, value: parsed };
};

const buildDateRangeFilter = (startDate, endDate) => {
  const start = parseDateInput(startDate);
  const end = parseDateInput(endDate);

  if (start.provided && !start.valid) {
    return { ok: false, message: "startDate must be a valid date" };
  }

  if (end.provided && !end.valid) {
    return { ok: false, message: "endDate must be a valid date" };
  }

  if (start.valid && end.valid && start.value > end.value) {
    return { ok: false, message: "startDate cannot be after endDate" };
  }

  if (!start.valid && !end.valid) {
    return { ok: true, filter: null };
  }

  const filter = {};
  if (start.valid) filter.$gte = start.value;
  if (end.valid) filter.$lte = end.value;

  return { ok: true, filter };
};

const parsePositiveAmount = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return { ok: false };
  }

  return { ok: true, value: numeric };
};

const getAllowedFields = (payload, allowedFields) => {
  const updates = {};
  const invalidFields = [];

  Object.keys(payload || {}).forEach((field) => {
    if (!allowedFields.includes(field)) {
      invalidFields.push(field);
      return;
    }
    updates[field] = payload[field];
  });

  return { updates, invalidFields };
};

module.exports = {
  ROLE_VALUES,
  STATUS_VALUES,
  TRANSACTION_TYPES,
  toTrimmedString,
  isNonEmptyString,
  isValidEmail,
  isValidObjectId,
  parseDateInput,
  buildDateRangeFilter,
  parsePositiveAmount,
  getAllowedFields,
};
