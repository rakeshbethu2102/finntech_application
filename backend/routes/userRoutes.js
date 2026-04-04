const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  getUserWithTransactions,
  deleteUser,
} = require("../controllers/userController");
const { requireRole } = require("../middleware/authorization");

// Get all users (analyst and admin only)
router.get("/", requireRole("analyst", "admin"), getAllUsers);

// Get user by ID (analyst and admin only)
router.get("/:id", requireRole("analyst", "admin"), getUserById);

// Get user with transactions (analyst and admin only)
router.get("/:userId/transactions", requireRole("analyst", "admin"), getUserWithTransactions);

// Update user status (admin only)
router.put("/:id/status", requireRole("admin"), updateUserStatus);

// Update user role (admin only)
router.put("/:id/role", requireRole("admin"), updateUserRole);

// Delete user (admin only)
router.delete("/:id", requireRole("admin"), deleteUser);

module.exports = router;
