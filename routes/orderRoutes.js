const express = require("express");
const router = express.Router();

const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");


/**
 * @route   GET /api/orders/my
 * @desc    Get logged-in user's orders
 * @access  Private
 */
router.get("/my", authenticateUser, getMyOrders);

/**
 * @route   GET /api/orders
 * @desc    Admin - Get all orders
 * @access  Admin only
 */
router.get("/", authenticateUser, getMyOrders);

router.get("/all", authenticateUser, authorizeAdmin, getAllOrders);


/**
 * @route   PUT /api/orders/:id/status
 * @desc    Admin - Update order status
 * @access  Admin only
 */
router.put("/:id/status", authenticateUser, authorizeAdmin, updateOrderStatus);

/**
 * @route   POST /api/orders
 * @desc    Create order from cart
 * @access  Private (Logged-in users only)
 */
router.post("/", authenticateUser, createOrder);

module.exports = router;
