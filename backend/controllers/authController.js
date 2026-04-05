const User = require("../models/user");
const {
  ROLE_VALUES,
  isNonEmptyString,
  isValidEmail,
  toTrimmedString,
} = require("../utils/validation");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({
        success: false,
        message: "name, email, and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must be a valid email address",
      });
    }

    if (role && !ROLE_VALUES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `role must be one of: ${ROLE_VALUES.join(", ")}`,
      });
    }

    const normalizedEmail = toTrimmedString(email).toLowerCase();
    const normalizedRole = role || "viewer";

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name: toTrimmedString(name),
      email: normalizedEmail,
      password: toTrimmedString(password),
      role: normalizedRole,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must be a valid email address",
      });
    }

    const normalizedEmail = toTrimmedString(email).toLowerCase();

    const user = await User.findOne({ email: normalizedEmail, password: toTrimmedString(password) });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "This account is inactive. Contact an administrator",
      });
    }

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};