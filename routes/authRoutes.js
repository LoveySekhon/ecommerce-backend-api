// Import Express Router
const express = require("express");
const router = express.Router();

// Import Auth Controller
const { registerUser, loginUser } = require("../controllers/authController");


/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", loginUser);



// Export router
module.exports = router;
