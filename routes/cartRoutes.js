const express = require("express");
const router = express.Router();

const { addToCart, getCart, removeFromCart } = require("../controllers/cartController");
const { authenticateUser } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/cart
 * @desc    Add product to cart
 * @access  Private (Logged-in users only)
 */
router.post("/", authenticateUser, addToCart);

/**
 * @route   GET /api/cart
 * @desc    Get logged-in user's cart
 * @access  Private
 */
router.get("/", authenticateUser, getCart);

/**
 * @route   DELETE /api/cart
 * @desc    Remove product from cart
 * @access  Private
 */
router.delete("/", authenticateUser, removeFromCart);

module.exports = router;
