const express = require("express");
const router = express.Router();
const { getSummary } = require("../controllers/dashboardController");
const { requireRole } = require("../middleware/authorization");

router.get("/summary", requireRole("viewer", "analyst", "admin"), getSummary);

module.exports = router;