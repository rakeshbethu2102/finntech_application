require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const cors = require("cors");

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-role"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Root route for deployment checks
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "FinTech backend is running",
    health: "/health",
    apiBase: "/api"
  });
});

// API index route for quick verification
app.get("/api", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is reachable",
    endpoints: {
      auth: "/api/auth",
      transactions: "/api/transactions",
      dashboard: "/api/dashboard",
      users: "/api/users"
    }
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;