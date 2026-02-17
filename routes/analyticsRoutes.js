const express = require("express");
const router = express.Router();

const {
    getDashboardSummary,
    getRevenuePerDay,
    getTopSellingProducts
} = require("../controllers/analyticsController");

const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");

/**
 * ADMIN ANALYTICS ROUTES
 */

// Dashboard Summary
router.get("/dashboard", authenticateUser, authorizeAdmin, getDashboardSummary);

// Revenue Per Day
router.get("/revenue-per-day", authenticateUser, authorizeAdmin, getRevenuePerDay);

// Top Selling Products
router.get("/top-products", authenticateUser, authorizeAdmin, getTopSellingProducts);

module.exports = router;
