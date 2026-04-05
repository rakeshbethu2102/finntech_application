require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const cors = require("cors");

// CORS configuration for production
const defaultOrigins = [
  "http://localhost:5173",
  "https://finntech-frontend.vercel.app"
];

const envOrigins = [process.env.FRONTEND_URLS, process.env.FRONTEND_URL]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-role"]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

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

// Global error handler for JSON parse errors, CORS errors, and unexpected failures
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
  }

  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin is not allowed by CORS policy",
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
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