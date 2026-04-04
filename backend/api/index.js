const app = require("../app");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: "Database connection failed"
    });
    return;
  }

  return app(req, res);
};
