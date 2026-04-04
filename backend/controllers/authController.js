const User = require("../models/user");

const validRoles = ["viewer", "analyst", "admin"];

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedRole = validRoles.includes(role) ? role : "viewer";

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole,
    });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};