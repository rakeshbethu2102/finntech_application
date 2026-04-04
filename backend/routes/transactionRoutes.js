const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { requireRole } = require("../middleware/authorization");

router.post("/", requireRole("viewer", "analyst", "admin"), createTransaction);
router.get("/", requireRole("viewer", "analyst", "admin"), getTransactions);
router.get("/:id", requireRole("analyst", "admin"), getTransactionById);
router.put("/:id", requireRole("admin"), updateTransaction);
router.delete("/:id", requireRole("admin"), deleteTransaction);

module.exports = router;